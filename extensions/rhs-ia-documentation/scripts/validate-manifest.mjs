/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestRoot = path.join(extensionRoot, 'manifests');
const content = JSON.parse(await fs.readFile(path.join(manifestRoot, 'content.json'), 'utf8'));
const assets = JSON.parse(await fs.readFile(path.join(manifestRoot, 'assets.json'), 'utf8'));
const navigation = JSON.parse(await fs.readFile(path.join(manifestRoot, 'navigation.json'), 'utf8'));
const verification = JSON.parse(await fs.readFile(path.join(manifestRoot, 'verification.json'), 'utf8'));
const references = JSON.parse(await fs.readFile(path.join(manifestRoot, 'upstream-references.json'), 'utf8'));
const baseline = JSON.parse(await fs.readFile(path.join(extensionRoot, 'upstream', 'baseline.json'), 'utf8'));
const errors = [];
const validContentDispositions = new Set(['KEEP', 'ADAPT', 'REWRITE', 'REMOVE', 'REVIEW']);
const validAssetDispositions = new Set(['REUSE', 'REPLACE', 'REMOVE', 'RECREATE', 'REVIEW']);
const validProductionDispositions = new Set(['KEEP', 'ADAPT', 'REWRITE']);

checkUnique(content.entries, 'content');
checkUnique(assets.entries, 'asset');

for (const entry of content.entries) {
	if (!validContentDispositions.has(entry.disposition)) {
		errors.push(`Unsupported content disposition ${entry.disposition}: ${entry.source}`);
	}
	if (!entry.reason) {
		errors.push(`Missing disposition reason: ${entry.source}`);
	}
}

for (const entry of assets.entries) {
	if (!validAssetDispositions.has(entry.disposition)) {
		errors.push(`Unsupported asset disposition ${entry.disposition}: ${entry.source}`);
	}
}

const contentBySource = new Map(content.entries.map(entry => [entry.source, entry]));
const classifiedSources = new Set([...content.entries, ...assets.entries].map(entry => entry.source));
for (const file of baseline.files) {
	if (!classifiedSources.has(file.path)) {
		errors.push(`Upstream file is not classified: ${file.path}`);
	}
}
for (const source of classifiedSources) {
	if (!baseline.files.some(file => file.path === source)) {
		errors.push(`Classified source is absent from the baseline: ${source}`);
	}
}
for (const reference of references.entries) {
	if (reference.resolvedTarget && !classifiedSources.has(reference.resolvedTarget)) {
		errors.push(`Referenced source is not classified: ${reference.source} -> ${reference.resolvedTarget}`);
	}
}

const navigationIds = new Set();
const navigationSources = new Set();
const verificationById = new Map();
for (const entry of verification.entries) {
	if (verificationById.has(entry.id)) {
		errors.push(`Duplicate verification entry: ${entry.id}`);
	}
	verificationById.set(entry.id, entry);
}
for (const section of navigation.sections) {
	for (const page of section.pages) {
		if (navigationIds.has(page.id)) {
			errors.push(`Duplicate navigation ID: ${page.id}`);
		}
		if (navigationSources.has(page.source)) {
			errors.push(`Source appears more than once in navigation: ${page.source}`);
		}
		navigationIds.add(page.id);
		navigationSources.add(page.source);

		const contentEntry = contentBySource.get(page.source);
		if (!contentEntry) {
			errors.push(`Navigation source is absent from content manifest: ${page.source}`);
		} else if (contentEntry.disposition === 'REMOVE') {
			errors.push(`Removed content appears in navigation: ${page.source}`);
		} else if (contentEntry.targetId !== page.id) {
			errors.push(`Navigation target mismatch for ${page.source}`);
		}

		const verificationEntry = verificationById.get(page.id);
		if (!verificationEntry) {
			errors.push(`Navigation page is not verified: ${page.id}`);
		} else {
			if (verificationEntry.status !== 'READY') {
				errors.push(`Navigation page is not ready: ${page.id}`);
			}
			if (!validProductionDispositions.has(verificationEntry.disposition)) {
				errors.push(`Invalid production disposition for ${page.id}: ${verificationEntry.disposition}`);
			}
			if (contentEntry && contentEntry.disposition !== verificationEntry.disposition) {
				errors.push(`Verification disposition mismatch for ${page.id}`);
			}
			if (!Array.isArray(verificationEntry.evidence) || verificationEntry.evidence.length === 0) {
				errors.push(`Missing verification evidence: ${page.id}`);
			} else {
				for (const evidence of verificationEntry.evidence) {
					try {
						await fs.access(path.resolve(extensionRoot, '..', '..', evidence));
					} catch {
						errors.push(`Verification evidence does not exist for ${page.id}: ${evidence}`);
					}
				}
			}
			if (verificationEntry.visualPolicy !== 'TEXT_ONLY' && verificationEntry.visualPolicy !== 'RECREATED') {
				errors.push(`Invalid visual policy for ${page.id}: ${verificationEntry.visualPolicy}`);
			}
		}
	}
}

for (const id of verificationById.keys()) {
	if (!navigationIds.has(id)) {
		errors.push(`Verification entry is absent from navigation: ${id}`);
	}
}

for (const entry of content.entries) {
	if (entry.targetId && !navigationIds.has(entry.targetId)) {
		errors.push(`Unknown target ID ${entry.targetId}: ${entry.source}`);
	}
	if (entry.disposition !== 'REMOVE' && entry.targetId && !navigationSources.has(entry.source)) {
		errors.push(`Planned content is missing from navigation: ${entry.source}`);
	}
}

if (errors.length) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Validated ${content.entries.length} content entries, ${assets.entries.length} asset entries, and ${navigationIds.size} verified navigation pages.`);
}

function checkUnique(entries, label) {
	const seen = new Set();
	for (const entry of entries) {
		if (seen.has(entry.source)) {
			errors.push(`Duplicate ${label} entry: ${entry.source}`);
		}
		seen.add(entry.source);
	}
}

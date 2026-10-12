/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { extensionRoot, hash, loadCatalog, parseSource, readSource, readJson, writeJson, translationStatus } from './documentation.mjs';
import { checkTranslation } from './translation-qa.mjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const { pages, translations } = await loadCatalog();
const glossary = await readJson('manifests/terminology.json');
const review = await readJson('manifests/translation-review.json');
const markIndex = process.argv.indexOf('--mark-current');
const markIds = markIndex >= 0 ? process.argv.slice(markIndex + 1) : [];
const allowIncomplete = process.argv.includes('--allow-incomplete');
const sync = process.argv.includes('--sync');
const errors = [];
const ids = translations.entries.map(entry => entry.id);
if (new Set(ids).size !== ids.length || JSON.stringify([...ids].sort()) !== JSON.stringify(pages.map(page => page.id).sort())) {
	throw new Error('Translation manifest must cover exactly the canonical page IDs once.');
}
if (markIndex >= 0 && (!markIds.length || markIds.some(id => !ids.includes(id)))) {
	throw new Error('--mark-current requires explicit registered page IDs, after editorial review.');
}
let current = 0;
for (const page of pages) {
	const entry = translations.entries.find(entry => entry.id === page.id);
	const spanish = await readSource('es', page.sourceFileName);
	const english = page.sources.en;
	let status = translationStatus(english, spanish, entry);
	const findings = spanish === undefined ? [] : checkTranslation(english, spanish, glossary, review.allowedUntranslated[page.id]);
	if (markIds.includes(page.id)) {
		if (spanish === undefined || findings.length) {
			errors.push(`${page.id}: cannot mark current: ${spanish === undefined ? 'missing translation' : findings.join('; ')}`);
		} else {
			entry.source_revision = hash(english);
			entry.translation_revision = hash(spanish);
			entry.translation_status = 'current';
			status = 'current';
		}
	}
	if (sync) {
		entry.translation_status = status;
	}
	if (status === 'current') {
		current++;
	}
	if (markIndex < 0) {
		if (status !== 'current' && !allowIncomplete) {
			errors.push(`${page.id}: translation is ${status}`);
		}
		errors.push(...findings.map(finding => `${page.id}: ${finding}`));
	}
	// Parse English too: bad frontmatter must not be hidden by a missing translation.
	parseSource(english);
}
const expectedFiles = new Set(pages.map(page => page.sourceFileName));
async function inspectDirectory(directory, prefix = '') {
	for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
		const relative = prefix + entry.name;
		if (entry.isDirectory()) {
			await inspectDirectory(path.join(directory, entry.name), `${relative}/`);
		} else if (entry.name.endsWith('.qmd') && !expectedFiles.has(relative)) {
			errors.push(`Unregistered Spanish source: ${relative}`);
		}
	}
}
await inspectDirectory(path.join(extensionRoot, 'docs-src', 'es'));
if (sync || (markIndex >= 0 && !errors.length)) {
	await writeJson('manifests/translations.json', translations);
}
if (errors.length) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Translation audit: ${current}/${pages.length} current Spanish pages${allowIncomplete || markIndex >= 0 ? ' (development/editorial mode)' : ''}.`);
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowlist = JSON.parse(await fs.readFile(path.join(extensionRoot, 'manifests', 'branding-allowlist.json'), 'utf8'));
const roots = [path.join(extensionRoot, 'docs-src'), path.join(extensionRoot, 'media', 'docs')];
const terms = [
	['Positron', /\bPositron\b/i],
	['Posit Software', /\bPosit Software\b/i],
	['posit.co', /\bposit\.co\b/i],
	['positron.', /\bpositron\./i],
	['positron:', /\bpositron:/i],
	['assistant', /\bassistant\b/i],
	['Databot', /\bDatabot\b/i],
	['Publisher', /\bPublisher\b/i],
];
const violations = [];

for (const root of roots) {
	for (const file of await walk(root)) {
		if (!/\.(?:qmd|md|html)$/i.test(file)) {
			continue;
		}
		const relative = path.relative(extensionRoot, file).replaceAll(path.sep, '/');
		const allowed = new Set(allowlist.allowedFiles[relative] ?? []);
		const text = stripRepositoryHeader(await fs.readFile(file, 'utf8'));
		for (const [term, pattern] of terms) {
			if (pattern.test(text) && !allowed.has(term)) {
				violations.push(`${relative}: unexpected upstream brand reference: ${term}`);
			}
		}
	}
}

if (violations.length) {
	console.error(violations.join('\n'));
	process.exitCode = 1;
} else {
	console.log('Branding audit passed: only approved RHS-IA and attribution references remain.');
}

function stripRepositoryHeader(text) {
	return text
		.replace(/^\/\*-+[\s\S]*?-+\*\/\s*/, '')
		.replace(/^(?:# -+\n#.*\n#.*\n# -+\n\s*)/, '');
}

async function walk(root) {
	const result = [];
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		const file = path.join(root, entry.name);
		if (entry.isDirectory()) {
			result.push(...await walk(file));
		} else if (entry.isFile()) {
			result.push(file);
		}
	}
	return result;
}

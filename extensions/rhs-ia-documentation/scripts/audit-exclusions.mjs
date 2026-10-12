/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = [path.join(extensionRoot, 'docs-src'), path.join(extensionRoot, 'media', 'docs')];
const exclusions = [
	[/\b(?:agente|asistente) (?:de )?RHS-IA\b|\basistente (?:de )?(?:Posit|Positron)\b/i, 'excluded agent documentation in Spanish'],
	[/\bactualiza(?:r|ci[o\u00f3]n de) Positron\b|\bpublica(?:r)? tu trabajo\b/i, 'updating or publishing documentation in Spanish'],
	[/\bgu[i\u00ed]as? de migraci[o\u00f3]n\b|\bmigra(?:r|ci[o\u00f3]n) desde (?:VS Code|RStudio)\b/i, 'migration documentation in Spanish'],
	[/\b(?:RHS-IA|Posit|Positron) Assistant\b/i, 'assistant documentation'],
	[/\bDatabot\b/i, 'Databot documentation'],
	[/\bRHS-IA Agent\b/i, 'RHS-IA Agent documentation'],
	[/\bupdat(?:e|ing) Positron\b/i, 'updating documentation'],
	[/\bPosit Publisher\b|\bPublish your work\b/i, 'publishing documentation'],
	[/\bMigration Guides?\b|\bmigrat(?:e|ion) from (?:VS Code|RStudio)\b/i, 'migration documentation'],
];
const violations = [];

for (const root of roots) {
	for (const file of await walk(root)) {
		if (!/\.(?:qmd|md|html)$/i.test(file)) {
			continue;
		}
		const text = await fs.readFile(file, 'utf8');
		for (const [pattern, description] of exclusions) {
			if (pattern.test(text)) {
				violations.push(`${path.relative(extensionRoot, file)}: excluded ${description}`);
			}
		}
	}
}

if (violations.length) {
	console.error(violations.join('\n'));
	process.exitCode = 1;
} else {
	console.log('Exclusion audit passed: deferred and removed topics are absent.');
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

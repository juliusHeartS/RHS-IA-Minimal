/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = [path.join(extensionRoot, 'media', 'runtime'), path.join(extensionRoot, 'media', 'docs')];
const violations = [];

for (const root of roots) {
	for (const file of await walk(root)) {
		if (!/\.(?:html|css|js)$/i.test(file)) {
			continue;
		}
		const text = await fs.readFile(file, 'utf8');
		check(file, text, /<(?:script|img)\b[^>]*\bsrc=["'](?:https?:)?\/\//gi, 'remote script or image');
		check(file, text, /<link\b[^>]*\bhref=["'](?:https?:)?\/\//gi, 'remote linked resource');
		check(file, text, /url\(\s*["']?(?:https?:)?\/\//gi, 'remote CSS resource');
		check(file, text, /\b(?:fetch|WebSocket|EventSource)\s*\(/g, 'network API');
	}
}

if (violations.length) {
	console.error(violations.join('\n'));
	process.exitCode = 1;
} else {
	console.log('Offline audit passed: no remote runtime dependencies were found.');
}

function check(file, text, pattern, description) {
	if (pattern.test(text)) {
		violations.push(`${path.relative(extensionRoot, file)}: ${description}`);
	}
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

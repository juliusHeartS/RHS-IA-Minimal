/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parseFragment } from 'parse5';
import { extensionRoot, loadCatalog, locales, parseSource, readJson } from './documentation.mjs';

const { pages } = await loadCatalog();
const allowIncomplete = process.argv.includes('--allow-incomplete');
const actions = await readJson('manifests/actions.json');
const errors = [];
const bySource = new Map(pages.map(page => [page.sourceFileName, page]));
const byOutput = new Map(pages.map(page => [page.fileName, page]));
let count = 0;

function htmlAttributes(html) {
	const links = [];
	const ids = [];
	function visit(node) {
		for (const attribute of node.attrs ?? []) {
			if (attribute.name === 'href' || attribute.name === 'src') {
				links.push({ value: attribute.value, asset: attribute.name === 'src' });
			} else if (attribute.name === 'id') {
				ids.push(attribute.value);
			}
		}
		for (const child of node.childNodes ?? []) {
			visit(child);
		}
	}
	visit(parseFragment(html));
	return { links, ids };
}

const rendered = new Map();
for (const locale of locales) {
	for (const page of pages) {
		if (!page.sources[locale]) {
			if (!allowIncomplete) {
				errors.push(`${locale}/${page.sourceFileName}: missing/current translation required`);
			}
			continue;
		}
		try {
			const html = await fs.readFile(path.join(extensionRoot, 'media', 'docs', locale, page.fileName), 'utf8');
			rendered.set(`${locale}/${page.fileName}`, htmlAttributes(html));
		} catch (error) {
			errors.push(`${locale}/${page.fileName}: cannot read rendered page: ${error.code}`);
		}
	}
}

for (const locale of locales) {
	for (const page of pages) {
		if (!page.sources[locale]) {
			continue;
		}
		count++;
		const source = parseSource(page.sources[locale]);
		const links = [];
		marked.walkTokens(marked.lexer(source.body), token => {
			if (token.type === 'link' || token.type === 'image') {
				links.push({ value: token.href, asset: token.type === 'image' });
			} else if (token.type === 'html') {
				links.push(...htmlAttributes(token.text).links);
			}
		});
		await checkLinks(locale, page.sourceFileName, links, true);
		const output = rendered.get(`${locale}/${page.fileName}`);
		if (output) {
			if (new Set(output.ids).size !== output.ids.length) {
				errors.push(`${locale}/${page.fileName}: duplicate rendered IDs`);
			}
			await checkLinks(locale, page.fileName, output.links, false);
		}
	}
}

async function checkLinks(locale, file, links, source) {
	for (const { value, asset } of links) {
		if (!asset && value.startsWith('rhs-doc-action:') && Object.hasOwn(actions, value.slice(15))) {
			continue;
		}
		if (/^https:\/\//i.test(value) && !asset) {
			continue;
		}
		if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('/') || value.includes('\\')) {
			errors.push(`${locale}/${file}: unsupported local link/resource ${value}`);
			continue;
		}
		const [pathname, anchor] = value.split('#', 2);
		const resolved = pathname ? path.posix.normalize(path.posix.join(path.posix.dirname(file), pathname)) : file;
		if (resolved === '..' || resolved.startsWith('../')) {
			errors.push(`${locale}/${file}: path escapes documentation: ${value}`);
			continue;
		}
		if (asset) {
			const root = source ? path.join(extensionRoot, 'docs-src', 'shared') : path.join(extensionRoot, 'media', 'docs', locale);
			try {
				await fs.access(path.join(root, resolved));
			} catch {
				errors.push(`${locale}/${file}: missing asset ${value}`);
			}
			continue;
		}
		const target = bySource.get(resolved) ?? byOutput.get(resolved);
		if (!target) {
			errors.push(`${locale}/${file}: unregistered document ${value}`);
			continue;
		}
		const targetLocale = target.sources[locale] ? locale : 'en';
		const destination = rendered.get(`${targetLocale}/${target.fileName}`);
		if (!destination || (anchor && !destination.ids.includes(anchor))) {
			errors.push(`${locale}/${file}: missing rendered document/anchor ${value}`);
		}
	}
}

if (errors.length) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Link audit passed for ${count} source/rendered pages, including anchors and shared assets.`);
}

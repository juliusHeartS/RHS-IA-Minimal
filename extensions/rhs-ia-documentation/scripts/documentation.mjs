/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

export const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const locales = ['en', 'es'];
export const hash = text => createHash('sha256').update(text).digest('hex');
export const readJson = async file => JSON.parse(await fs.readFile(path.join(extensionRoot, file), 'utf8'));
export const writeJson = async (file, value) => fs.writeFile(path.join(extensionRoot, file), `${JSON.stringify(value, null, '\t')}\n`);
export const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function parseSource(source) {
	const stripped = source.replace(/^(?:# -+\n#.*\n#.*\n# -+\n\s*)/, '');
	const frontmatter = stripped.match(/^---\n([\s\S]*?)\n---\n/);
	if (!frontmatter) {
		throw new Error('Missing QMD frontmatter.');
	}
	const metadata = yaml.load(frontmatter[1]);
	if (typeof metadata?.title !== 'string' || !metadata.title.trim()) {
		throw new Error('Missing documentation title.');
	}
	return { title: metadata.title, body: stripped.slice(frontmatter[0].length), source: stripped };
}

export async function readSource(locale, file) {
	try {
		return await fs.readFile(path.join(extensionRoot, 'docs-src', locale, file), 'utf8');
	} catch (error) {
		if (error.code === 'ENOENT') {
			return undefined;
		}
		throw error;
	}
}

export function translationStatus(english, spanish, entry) {
	if (spanish === undefined) {
		return 'missing';
	}
	return entry?.translation_status === 'current' && entry.source_revision === hash(english) && entry.translation_revision === hash(spanish)
		? 'current' : 'stale';
}

export async function loadCatalog() {
	const navigation = await readJson('manifests/navigation.json');
	const translations = await readJson('manifests/translations.json');
	if (translations.schemaVersion !== 1 || translations.canonicalLocale !== 'en' || translations.locale !== 'es') {
		throw new Error('Unsupported translation manifest schema or locales.');
	}
	const pages = [
		{ id: 'home', sourceFileName: 'index.qmd' },
		...navigation.sections.flatMap(section => section.pages.map(page => ({ id: page.id, sourceFileName: `${page.id}.qmd` }))),
	];
	for (const page of pages) {
		page.fileName = page.sourceFileName.replace(/\.qmd$/, '.html');
		page.sources = {};
		page.titles = {};
		const english = await readSource('en', page.sourceFileName);
		if (english === undefined) {
			throw new Error(`Missing canonical page: ${page.sourceFileName}`);
		}
		page.sources.en = english;
		page.titles.en = parseSource(english).title;
		const spanish = await readSource('es', page.sourceFileName);
		page.translationStatus = translationStatus(english, spanish, translations.entries.find(entry => entry.id === page.id));
		if (page.translationStatus === 'current') {
			page.sources.es = spanish;
			page.titles.es = parseSource(spanish).title;
		}
	}
	return { navigation, pages, translations };
}

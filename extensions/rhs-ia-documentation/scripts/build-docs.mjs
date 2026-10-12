/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { marked, Renderer } from 'marked';
import { extensionRoot, locales, loadCatalog, parseSource, escapeHtml } from './documentation.mjs';
import { indexArticle } from './search-index.mjs';
import { generateNavigation } from './generate-navigation.mjs';

const { pages } = await loadCatalog();
const incomplete = pages.filter(page => page.translationStatus !== 'current');
if (incomplete.length && !process.argv.includes('--allow-incomplete')) {
	throw new Error(`Spanish translations are missing or stale: ${incomplete.map(page => page.id).join(', ')}. Use --allow-incomplete only for development.`);
}
// Quarto ignores projects beneath hidden directories such as .build.
const buildRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'rhs-ia-documentation-'));
const bundleRoot = path.join(buildRoot, 'bundle');
const quarto = process.env.QUARTO_PATH || 'quarto';
const useQuarto = !process.argv.includes('--markdown') && spawnSync(quarto, ['--version'], { encoding: 'utf8' }).status === 0;
await fs.mkdir(bundleRoot, { recursive: true });
if (!useQuarto) {
	console.log('Using local Markdown renderer. Set QUARTO_PATH to use Quarto.');
}

for (const locale of locales) {
	const available = pages.filter(page => page.sources[locale] !== undefined);
	const entries = [];
	const sourceRoot = path.join(buildRoot, 'source', locale);
	const outputRoot = path.join(buildRoot, 'rendered', locale);
	await fs.mkdir(sourceRoot, { recursive: true });
	await fs.cp(path.join(extensionRoot, 'docs-src', 'shared', 'images'), path.join(sourceRoot, 'images'), { recursive: true });
	for (const page of available) {
		const destination = path.join(sourceRoot, page.sourceFileName);
		await fs.mkdir(path.dirname(destination), { recursive: true });
		// Repository copyright comments are source metadata, not article headings.
		await fs.writeFile(destination, parseSource(page.sources[locale]).source);
	}
	if (useQuarto && available.length) {
		const config = await fs.readFile(path.join(extensionRoot, 'docs-src', 'en', '_quarto.yml'), 'utf8');
		await fs.writeFile(path.join(sourceRoot, '_quarto.yml'), `${config}\nlang: ${locale}\n`);
		const result = spawnSync(quarto, ['render', '.', '--output-dir', outputRoot], { cwd: sourceRoot, stdio: 'inherit' });
		if (result.status !== 0) {
			throw new Error(`Quarto failed for ${locale}: ${result.error ?? result.status}`);
		}
	}
	for (const page of available) {
		const source = parseSource(page.sources[locale]);
		let article;
		if (useQuarto) {
			const html = await fs.readFile(path.join(outputRoot, page.fileName), 'utf8');
			const main = html.match(/<main\b[^>]*id=["']quarto-document-content["'][^>]*>([\s\S]*?)<\/main>/i)
				?? html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
				?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
			if (!main) {
				throw new Error(`Quarto output has no article: ${locale}/${page.fileName}`);
			}
			article = main[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').trim();
		} else {
			const renderer = new Renderer();
			renderer.heading = (text, level) => {
				const anchor = text.match(/\s*\{#([a-z\d][a-z\d_.:-]*)\}$/i);
				if (!anchor) {
					throw new Error(`Heading needs a stable explicit ID: ${locale}/${page.sourceFileName}: ${text}`);
				}
				return `<h${level} id="${anchor[1]}">${text.slice(0, anchor.index)}</h${level}>\n`;
			};
			article = `<h1 class="title">${escapeHtml(source.title)}</h1>\n${marked.parse(source.body, { gfm: true, renderer })}`;
		}
		entries.push(...indexArticle(article, { id: page.id, title: source.title }));
		const destination = path.join(bundleRoot, locale, page.fileName);
		await fs.mkdir(path.dirname(destination), { recursive: true });
		await fs.writeFile(destination, `<article class="quarto-article" lang="${locale}">${article}</article>\n`);
	}
	await fs.mkdir(path.join(bundleRoot, locale), { recursive: true });
	await fs.cp(path.join(sourceRoot, 'images'), path.join(bundleRoot, locale, 'images'), { recursive: true });
	const searchRoot = path.join(buildRoot, 'search', locale);
	await fs.mkdir(searchRoot, { recursive: true });
	await fs.writeFile(path.join(searchRoot, 'index.json'), JSON.stringify({ schemaVersion: 1, locale, entries }) + '\n');
	console.log(`Rendered ${available.length} ${locale} pages.`);
}

// Publish only after both locale renders succeed; failed renders retain the prior bundle.
const stagedBundle = path.join(extensionRoot, '.build', 'docs-ready');
await fs.rm(stagedBundle, { recursive: true, force: true });
await fs.cp(bundleRoot, stagedBundle, { recursive: true });
await fs.rm(path.join(extensionRoot, 'media', 'docs'), { recursive: true, force: true });
await fs.rename(stagedBundle, path.join(extensionRoot, 'media', 'docs'));
await fs.rm(path.join(extensionRoot, 'media', 'search'), { recursive: true, force: true });
await fs.cp(path.join(buildRoot, 'search'), path.join(extensionRoot, 'media', 'search'), { recursive: true });
await generateNavigation();
await fs.rm(buildRoot, { recursive: true, force: true });

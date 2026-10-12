/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { extensionRoot, loadCatalog, locales } from './documentation.mjs';
import { indexArticle } from './search-index.mjs';

const { pages } = await loadCatalog();
for (const locale of locales) {
	const expected = [];
	for (const page of pages.filter(page => page.sources[locale])) {
		const html = await fs.readFile(path.join(extensionRoot, 'media', 'docs', locale, page.fileName), 'utf8');
		expected.push(...indexArticle(html, { id: page.id, title: page.titles[locale] }));
	}
	const index = JSON.parse(await fs.readFile(path.join(extensionRoot, 'media', 'search', locale, 'index.json'), 'utf8'));
	assert.deepEqual(index, { schemaVersion: 1, locale, entries: expected }, `${locale} search index must match the shipped articles and anchors`);
	console.log(`Search audit passed: ${locale}, ${expected.length} sections.`);
}

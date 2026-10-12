/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'node:assert/strict';
import test from 'node:test';
import { checkTranslation } from './translation-qa.mjs';
import { hash, translationStatus } from './documentation.mjs';

const source = body => `---\ntitle: "Example"\n---\n\n${body}`;
const en = source('## Setup {#setup}\n\nInstall `pkg.name` using [the guide](guide.qmd#setup).\n\n![Diagram](images/diagram.png)\n\n```r\nx <- 1\n```');
const es = source('## Inicio {#setup}\n\nInstala `pkg.name` con [esta gu\u00eda](guide.qmd#setup).\n\n![Diagrama](images/diagram.png)\n\n```r\nx <- 1\n```');
const glossary = { terms: [{ en: 'workspace', es: 'espacio de trabajo', forbidden: ['area de trabajo'] }] };

test('translation permits prose changes but protects structure, anchors, links, images and code', () => {
	assert.deepEqual([
		checkTranslation(en, es, glossary),
		...[
			['## Inicio', '### Inicio', 'headings'],
			['{#setup}', '{#inicio}', 'headings'],
			['guide.qmd#setup', 'guia.qmd#setup', 'links'],
			['images/diagram.png', 'images/diagrama.png', 'images'],
			['x <- 1', 'x <- 2', 'code'],
			['`pkg.name`', '`paquete.nombre`', 'identifiers'],
		].map(([before, after, expected]) => checkTranslation(en, es.replace(before, after), glossary).includes(`${expected} parity failed`)),
	], [[], true, true, true, true, true, true]);
});

test('untranslated prose and forbidden terminology require review', () => {
	const english = source('This entire sentence has deliberately remained in English.');
	assert.deepEqual([
		checkTranslation(english, english, glossary).length,
		checkTranslation(english, english, glossary, [{ text: 'This entire sentence has deliberately remained in English.', reason: 'A quoted UI message.' }]).length,
		checkTranslation(source('A workspace.'), source('Un area de trabajo.'), glossary).length,
	], [1, 0, 1]);
});

test('source and translation edits invalidate approval without silently updating hashes', () => {
	const entry = { source_revision: hash(en), translation_revision: hash(es), translation_status: 'current' };
	assert.deepEqual([
		translationStatus(en, es, entry),
		translationStatus(en + '\n', es, entry),
		translationStatus(en, es + '\n', entry),
		translationStatus(en, undefined, entry),
		translationStatus(en, es, { ...entry, translation_status: 'stale' }),
	], ['current', 'stale', 'stale', 'missing', 'stale']);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'node:assert/strict';
import test from 'node:test';
import { indexArticle } from './search-index.mjs';

test('indexes decoded prose and heading anchors, excluding executable content', () => {
	const entries = indexArticle('<h1>Title</h1><p>Intro &amp; overview</p><h2 id="stable">Setup <code>R</code></h2><p>First</p><p>Second</p><script>secret</script><h3 id="nested">Details</h3><p>More</p>', { id: 'page', title: 'Page' });
	assert.deepEqual(entries, [
		{ documentId: 'page', title: 'Page', section: 'Page', text: 'Intro & overview' },
		{ documentId: 'page', title: 'Page', section: 'Setup R', anchor: 'stable', text: 'First Second' },
		{ documentId: 'page', title: 'Page', section: 'Details', anchor: 'nested', text: 'More' },
	]);
	assert.throws(() => indexArticle('<h2>Unstable</h2>', { id: 'page', title: 'Page' }), /Missing search anchor/);
});

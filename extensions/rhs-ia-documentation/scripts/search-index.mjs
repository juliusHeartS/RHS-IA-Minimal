/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { parseFragment } from 'parse5';

export function indexArticle(html, page) {
	const entries = [];
	let current = { documentId: page.id, title: page.title, section: page.title, text: '' };
	function text(node) {
		if (node.nodeName === '#text') { return node.value; }
		return (node.childNodes ?? []).map(text).join('');
	}
	function finish() {
		current.text = current.text.replace(/\s+/g, ' ').trim();
		entries.push(current);
	}
	function visit(node) {
		if (['script', 'style', 'h1'].includes(node.tagName)) { return; }
		if (/^h[2-6]$/.test(node.tagName)) {
			finish();
			const anchor = node.attrs?.find(attribute => attribute.name === 'id')?.value;
			if (!anchor) { throw new Error(`Missing search anchor: ${page.id}`); }
			current = { documentId: page.id, title: page.title, section: text(node).trim(), anchor, text: '' };
			return;
		}
		if (node.nodeName === '#text') { current.text += node.value; }
		for (const child of node.childNodes ?? []) { visit(child); }
		if (['p', 'li', 'pre', 'td', 'th', 'div', 'br'].includes(node.tagName)) { current.text += ' '; }
	}
	visit(parseFragment(html));
	finish();
	return entries;
}

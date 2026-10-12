/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { marked } from 'marked';
import { parseSource } from './documentation.mjs';

/** Compare meaning-bearing structure without requiring identical translated prose. */
export function checkTranslation(english, spanish, glossary, allowedUntranslated = []) {
	const en = parseSource(english);
	const es = parseSource(spanish);
	const errors = [];
	const inspect = body => {
		const structure = [];
		const headings = [];
		const links = [];
		const images = [];
		const code = [];
		const identifiers = [];
		const prose = [];
		marked.walkTokens(marked.lexer(body), token => {
			if (['paragraph', 'heading', 'list', 'list_item', 'blockquote', 'table', 'code', 'hr'].includes(token.type)) {
				structure.push(token.type === 'list' ? `list:${token.ordered}` : token.type === 'table' ? `table:${token.header.length}:${token.rows.length}` : token.type);
			}
			if (token.type === 'heading') {
				headings.push([token.depth, token.text.match(/\{#([a-z\d][a-z\d_.:-]*)\}$/i)?.[1] ?? null]);
			}
			if (token.type === 'link') {
				links.push(token.href);
			}
			if (token.type === 'image') {
				images.push(token.href);
			}
			if (token.type === 'code') {
				code.push([token.lang ?? '', token.text]);
			}
			if (token.type === 'codespan') {
				identifiers.push(token.text);
			}
			if (token.type === 'paragraph' || token.type === 'heading') {
				prose.push(token.text.replace(/\s*\{#[^}]+\}/g, '').trim());
			}
			if (token.type === 'html') {
				for (const match of token.text.matchAll(/\b(src|href)=["']([^"']*)["']/g)) {
					(match[1] === 'src' ? images : links).push(match[2]);
				}
			}
		});
		return { structure, headings, links, images, code, identifiers, prose };
	};
	const left = inspect(en.body);
	const right = inspect(es.body);
	for (const key of ['structure', 'headings', 'links', 'images', 'code', 'identifiers']) {
		if (JSON.stringify(left[key]) !== JSON.stringify(right[key])) {
			errors.push(`${key} parity failed`);
		}
	}
	if (left.headings.some(([, anchor]) => !anchor) || right.headings.some(([, anchor]) => !anchor)) {
		errors.push('Headings require explicit stable IDs.');
	}
	const allowed = new Set(allowedUntranslated.filter(entry => entry.reason?.trim()).map(entry => entry.text));
	for (const text of [es.title, ...right.prose]) {
		if (text.split(/\s+/).length >= 6 && [en.title, ...left.prose].includes(text) && !allowed.has(text)) {
			errors.push(`Untranslated prose requires review: ${text}`);
		}
	}
	for (const term of glossary.terms) {
		for (const forbidden of term.forbidden ?? []) {
			if (new RegExp(`(?:^|[^\\p{L}])${escapeRegex(forbidden)}(?:$|[^\\p{L}])`, 'iu').test(es.body)) {
				errors.push(`Terminology: use "${term.es}" instead of "${forbidden}".`);
			}
		}
		if (term.translate === false && en.body.includes(term.en) && !es.body.includes(term.en)) {
			errors.push(`Protected term was lost: ${term.en}`);
		}
	}
	return errors;
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

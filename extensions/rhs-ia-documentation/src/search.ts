/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

export interface SearchEntry {
	readonly documentId: string;
	readonly title: string;
	readonly section: string;
	readonly anchor?: string;
	readonly text: string;
}

export interface SearchIndex {
	readonly schemaVersion: number;
	readonly locale: string;
	readonly entries: SearchEntry[];
}

function normalize(value: string): string {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function searchDocumentation(entries: readonly SearchEntry[], query: string): SearchEntry[] {
	const terms = [...new Set(normalize(query.slice(0, 200)).match(/[\p{L}\p{N}_]+/gu) ?? [])];
	if (!terms.length) { return []; }
	return entries.map(entry => {
		const title = normalize(entry.title);
		const section = normalize(entry.section);
		const body = normalize(entry.text);
		const combined = `${title} ${section} ${body}`;
		const score = terms.every(term => combined.includes(term))
			? terms.reduce((total, term) => total + (title.includes(term) ? 8 : 0) + (section.includes(term) ? 5 : 0) + (body.includes(term) ? 1 : 0), 0)
			: 0;
		return { entry, score };
	}).filter(result => result.score > 0).sort((a, b) => b.score - a.score)
		.slice(0, 20).map(({ entry }) => {
			const position = normalize(entry.text).indexOf(terms.find(term => normalize(entry.text).includes(term)) ?? '');
			const start = Math.max(0, position - 70);
			return { ...entry, text: `${start ? '...' : ''}${entry.text.slice(start, start + 240)}${entry.text.length > start + 240 ? '...' : ''}` };
		});
}

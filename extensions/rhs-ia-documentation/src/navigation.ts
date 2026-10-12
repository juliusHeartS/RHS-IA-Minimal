/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { generatedDocumentationPages } from './navigation.generated';
import { DocumentationLocale } from './localization';

export interface DocumentationPage {
	readonly id: string;
	readonly fileName: string;
	readonly sourceFileName: string;
	readonly titles: { readonly en: string; readonly es?: string };
}

export interface LocalizedDocumentationPage extends DocumentationPage {
	readonly title: string;
	readonly locale: DocumentationLocale;
	readonly isFallback: boolean;
}

const documentationPages: readonly DocumentationPage[] = generatedDocumentationPages;
const pagesById = new Map(documentationPages.map(page => [page.id, page]));
const pagesByFileName = new Map(documentationPages.flatMap(page => [
	[pathKey(page.fileName), page] as const,
	[pathKey(page.sourceFileName), page] as const,
]));

export function localizeDocumentationPage(page: DocumentationPage, locale: DocumentationLocale): LocalizedDocumentationPage {
	const actualLocale = page.titles[locale] ? locale : 'en';
	return { ...page, title: page.titles[actualLocale] ?? page.titles.en, locale: actualLocale, isFallback: actualLocale !== locale };
}

export function getDocumentationPage(id: string, locale: DocumentationLocale = 'en'): LocalizedDocumentationPage | undefined {
	const page = pagesById.get(id);
	return page ? localizeDocumentationPage(page, locale) : undefined;
}

export function getDocumentationPageByFileName(fileName: string): DocumentationPage | undefined {
	return pagesByFileName.get(pathKey(fileName));
}

function pathKey(fileName: string): string {
	return fileName.replace(/\\/g, '/').replace(/^\.\//, '');
}

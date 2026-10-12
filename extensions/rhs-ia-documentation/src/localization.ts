/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { documentationStrings } from './navigation.generated';

export type DocumentationLocale = 'en' | 'es';

/** Resolve documentation from the host's active UI language, including regional Spanish. */
export function resolveDocumentationLocale(language: string): DocumentationLocale {
	return /^es(?:-|$)/i.test(language) ? 'es' : 'en';
}

export function getDocumentationStrings(locale: DocumentationLocale): typeof documentationStrings[DocumentationLocale] {
	return documentationStrings[locale];
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'node:path';
import * as vscode from 'vscode';
import { documentationActions } from './navigation.generated';
import { getDocumentationPageByFileName } from './navigation';

const attributePattern = /\b(src|href)=(['"])(.*?)\2/gi;

export function rewriteArticleResources(
	articleHtml: string,
	webview: vscode.Webview,
	documentRoot: vscode.Uri,
	currentFileName: string,
): string {
	const currentDirectory = path.posix.dirname(currentFileName);
	return articleHtml.replace(attributePattern, (match, attribute: string, quote: string, value: string) => {
		if (attribute.toLowerCase() === 'src') {
			const resourceUri = resolveLocalResource(value, documentRoot, currentDirectory);
			return resourceUri ? `src=${quote}${webview.asWebviewUri(resourceUri)}${quote}` : match;
		}

		if (value.startsWith('rhs-doc-action:') && Object.keys(documentationActions).includes(value.slice(15))) {
			return `href="#" data-doc-action="${escapeAttribute(value.slice(15))}"`;
		}

		if (isUri(value) || value.startsWith('/')) {
			return match;
		}
		const [fileName, anchor] = value.split('#', 2);
		const targetName = fileName
			? normalizeRelativePath(currentDirectory, fileName)
			: currentFileName;
		const page = targetName ? getDocumentationPageByFileName(targetName) : undefined;
		if (!page) {
			return match;
		}

		const anchorAttribute = anchor ? ` data-doc-anchor=${quote}${escapeAttribute(anchor)}${quote}` : '';
		return `href=${quote}#${quote} data-doc-id=${quote}${page.id}${quote}${anchorAttribute}`;
	});
}

function resolveLocalResource(
	value: string,
	documentRoot: vscode.Uri,
	currentDirectory: string,
): vscode.Uri | undefined {
	if (isUri(value) || value.startsWith('#') || value.startsWith('/')) {
		return undefined;
	}

	const normalized = normalizeRelativePath(currentDirectory, value);
	if (!normalized) {
		return undefined;
	}

	return vscode.Uri.joinPath(documentRoot, normalized);
}

function normalizeRelativePath(currentDirectory: string, value: string): string | undefined {
	if (value.includes('\\') || /[%?]/.test(value)) { return undefined; }
	const normalized = path.posix.normalize(path.posix.join(currentDirectory, value));
	if (normalized === '..' || normalized.startsWith('../')) {
		return undefined;
	}
	return normalized.replace(/^\.\//, '');
}

function isUri(value: string): boolean {
	return /^[a-z][a-z\d+.-]*:/i.test(value);
}

function escapeAttribute(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

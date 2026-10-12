/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { documentationActions, generatedDocumentationSections } from './navigation.generated';
import { SearchIndex, searchDocumentation } from './search';
import { randomBytes } from 'node:crypto';
import * as vscode from 'vscode';
import { getDocumentationStrings, resolveDocumentationLocale } from './localization';
import { rewriteArticleResources } from './linkHandler';
import { LocalizedDocumentationPage, getDocumentationPage } from './navigation';

export const DOCUMENTATION_VIEW_ID = 'rhs-ia.documentation.view';

interface WebviewMessage {
	readonly type:
	| 'search'
	| 'ready'
	| 'scroll'
	| 'appAction'
	| 'navigate'
	| 'back'
	| 'forward'
	| 'home'
	| 'retry'
	| 'openExternal'
	| 'unsupportedUri';
	readonly documentId?: string;
	readonly anchor?: string;
	readonly uri?: string;
	readonly query?: string;
	readonly action?: string;
	readonly version?: number;
	readonly scrollY?: number;
}

interface HistoryEntry {
	scrollY?: number;
	readonly documentId: string;
	readonly anchor?: string;
}

export class DocumentationViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
	private readonly history: HistoryEntry[] = [{ documentId: 'home' }];
	private historyIndex = 0;
	private renderVersion = 0;
	private searchIndex: SearchIndex | undefined;
	private focusSearch = false;
	private readonly locale = resolveDocumentationLocale(vscode.env.language);
	private readonly strings = getDocumentationStrings(this.locale);
	private view: vscode.WebviewView | undefined;
	private viewDisposables = vscode.Disposable.from();

	constructor(private readonly extensionUri: vscode.Uri, private readonly storage?: vscode.Memento) {
		const saved = storage?.get<{ history: HistoryEntry[]; index: number }>('documentation.history');
		if (saved && Array.isArray(saved.history) && saved.history.length > 0 && saved.history.length <= 100 &&
			Number.isInteger(saved.index) && saved.index >= 0 && saved.index < saved.history.length &&
			saved.history.every(entry => entry && typeof entry.documentId === 'string' && getDocumentationPage(entry.documentId))) {
			this.history.splice(0, 1, ...saved.history.map(entry => ({ documentId: entry.documentId, anchor: sanitizeAnchor(entry.anchor), scrollY: validScroll(entry.scrollY) ? entry.scrollY : undefined })));
			this.historyIndex = saved.index;
		}
	}

	public openHome(): void {
		this.navigate({ documentId: 'home' });
	}

	public async search(): Promise<void> {
		this.focusSearch = true;
		if (this.view) { await this.view.webview.postMessage({ type: 'focusSearch' }); }
	}

	private persist(): void {
		void this.storage?.update('documentation.history', { history: this.history, index: this.historyIndex });
	}

	public resolveWebviewView(webviewView: vscode.WebviewView): void {
		this.viewDisposables.dispose();
		this.view = webviewView;

		const mediaRoot = vscode.Uri.joinPath(this.extensionUri, 'media');
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [mediaRoot],
		};

		this.viewDisposables = vscode.Disposable.from(
			webviewView.webview.onDidReceiveMessage(message => this.handleMessage(message)),
			webviewView.onDidDispose(() => {
				if (this.view === webviewView) {
					this.view = undefined;
				}
			}),
		);

		void this.renderCurrentPage();
	}

	public dispose(): void {
		this.view = undefined;
		this.viewDisposables.dispose();
	}

	private async handleMessage(candidate: object): Promise<void> {
		if (!isWebviewMessage(candidate)) {
			return;
		}

		if (candidate.version !== undefined && candidate.version !== this.renderVersion) { return; }
		if (validScroll(candidate.scrollY)) {
			this.history[this.historyIndex].scrollY = candidate.scrollY;
			this.persist();
		}
		switch (candidate.type) {
			case 'ready':
				if (this.focusSearch) {
					this.focusSearch = false;
					await this.view?.webview.postMessage({ type: 'focusSearch' });
				}
				break;
			case 'scroll':
				break;
			case 'search': {
				const view = this.view;
				const version = this.renderVersion;
				const query = (candidate.query ?? '').slice(0, 200);
				try {
					if (!this.searchIndex) {
						const bytes = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(this.extensionUri, 'media', 'search', this.locale, 'index.json'));
						const index: SearchIndex = JSON.parse(new TextDecoder().decode(bytes));
						if (index.schemaVersion !== 1 || index.locale !== this.locale || !Array.isArray(index.entries)) { throw new Error('Invalid search index'); }
						this.searchIndex = index;
					}
					if (view === this.view && version === this.renderVersion) {
						await view?.webview.postMessage({ type: 'searchResults', query, results: searchDocumentation(this.searchIndex.entries, query) });
					}
				} catch {
					if (view === this.view && version === this.renderVersion) {
						await view?.webview.postMessage({ type: 'searchResults', query, error: this.strings.searchError });
					}
				}
				break;
			}
			case 'appAction':
				if (candidate.action && Object.keys(documentationActions).includes(candidate.action)) {
					try { await vscode.commands.executeCommand(documentationActions[candidate.action as keyof typeof documentationActions]); }
					catch { void vscode.window.showWarningMessage(this.strings.actionError); }
				} else { void vscode.window.showWarningMessage(this.strings.blockedLink); }
				break;
			case 'navigate':
				if (
					candidate.documentId &&
					getDocumentationPage(candidate.documentId)
				) {
					this.navigate({
						documentId: candidate.documentId,
						anchor: sanitizeAnchor(candidate.anchor),
					});
				}
				break;
			case 'back':
				this.moveHistory(-1);
				break;
			case 'forward':
				this.moveHistory(1);
				break;
			case 'home':
				this.navigate({ documentId: 'home' });
				break;
			case 'retry':
				void this.renderCurrentPage();
				break;
			case 'openExternal':
				await this.openExternal(candidate.uri);
				break;
			case 'unsupportedUri':
				void vscode.window.showWarningMessage(
					this.strings.blockedLink,
				);
				break;
		}
	}

	private navigate(entry: HistoryEntry): void {
		const current = this.history[this.historyIndex];
		if (
			current.documentId === entry.documentId &&
			current.anchor === entry.anchor
		) {
			current.scrollY = undefined;
			this.persist();
			void this.renderCurrentPage();
			return;
		}

		this.history.splice(this.historyIndex + 1);
		this.history.push(entry);
		if (this.history.length > 100) { this.history.shift(); }
		this.historyIndex = this.history.length - 1;
		this.persist();
		void this.renderCurrentPage();
	}

	private moveHistory(offset: number): void {
		const nextIndex = this.historyIndex + offset;
		if (nextIndex < 0 || nextIndex >= this.history.length) {
			return;
		}

		this.historyIndex = nextIndex;
		this.persist();
		void this.renderCurrentPage();
	}

	private async openExternal(uriValue: string | undefined): Promise<void> {
		if (typeof uriValue !== 'string' || !uriValue) {
			return;
		}

		let uri: vscode.Uri;
		try {
			uri = vscode.Uri.parse(uriValue, true);
		} catch {
			return;
		}

		if (uri.scheme !== 'https' || !uri.authority) {
			void vscode.window.showWarningMessage(
				this.strings.httpsOnly,
			);
			return;
		}

		try { await vscode.env.openExternal(uri); }
		catch { void vscode.window.showWarningMessage(this.strings.blockedLink); }
	}

	private async renderCurrentPage(): Promise<void> {
		const view = this.view;
		if (!view) {
			return;
		}

		const entry = this.history[this.historyIndex];
		const page =
			getDocumentationPage(entry.documentId, this.locale) ?? getDocumentationPage('home', this.locale);
		if (!page) {
			throw new Error(
				this.strings.loadError,
			);
		}

		const version = ++this.renderVersion;
		let html: string;
		try {
			html = await this.createWebviewHtml(view.webview, page, entry.anchor);
		} catch {
			html = this.createShell(view.webview, page.title, `<p role="alert">${escapeHtml(this.strings.loadError)}</p><button type="button" data-action="retry">${escapeHtml(this.strings.retry)}</button>`, entry.anchor);
		}
		if (this.view === view && version === this.renderVersion) {
			view.description = page.title;
			view.webview.html = html;
		}
	}

	private async createWebviewHtml(
		webview: vscode.Webview,
		page: LocalizedDocumentationPage,
		anchor: string | undefined,
	): Promise<string> {
		const documentRoot = vscode.Uri.joinPath(
			this.extensionUri,
			'media',
			'docs',
			page.locale,
		);
		const articleUri = vscode.Uri.joinPath(documentRoot, page.fileName);
		const articleBytes = await vscode.workspace.fs.readFile(articleUri);
		const article = rewriteArticleResources(
			new TextDecoder().decode(articleBytes),
			webview,
			documentRoot,
			page.fileName,
		);
		const fallback = page.isFallback ? `<p class="documentation-fallback" role="status">${escapeHtml(this.strings.fallback)}</p>` : '';
		return this.createShell(webview, page.title, fallback + article, anchor);
	}

	private createShell(webview: vscode.Webview, title: string, article: string, anchor: string | undefined): string {
		const runtimeRoot = vscode.Uri.joinPath(
			this.extensionUri,
			'media',
			'runtime',
		);
		const stylesheetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(runtimeRoot, 'documentation.css'),
		);
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(runtimeRoot, 'documentation.js'),
		);
		const nonce = randomBytes(16).toString('base64');
		const initialAnchor = escapeAttribute(anchor ?? '');
		const current = this.history[this.historyIndex];
		const link = (id: string, label?: string) => {
			const page = getDocumentationPage(id, this.locale)!;
			return `<a href="#" data-doc-id="${escapeAttribute(id)}" ${id === current.documentId ? 'aria-current="page"' : ''}>${escapeHtml(label ?? page.title)}</a>`;
		};
		const sections = generatedDocumentationSections;
		const section = sections.find(section => (section.pageIds as readonly string[]).includes(current.documentId));
		const contents = sections.map(section => `<details ${section.pageIds.some(id => id === current.documentId) ? 'open' : ''}><summary>${escapeHtml(section.titles[this.locale])}</summary><ul>${section.pageIds.map(id => `<li>${link(id)}</li>`).join('')}</ul></details>`).join('');
		const orderedIds: string[] = ['home', ...sections.flatMap(section => [...section.pageIds])];
		const position = orderedIds.indexOf(current.documentId);
		const adjacent = (offset: number, label: string) => orderedIds[position + offset] ? `<div><span>${escapeHtml(label)}</span>${link(orderedIds[position + offset])}</div>` : '<div></div>';

		return /* html */ `<!DOCTYPE html>
<html lang="${this.locale}">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="${stylesheetUri}">
	<title>${escapeHtml(title)}</title>
</head>
<body data-document-id="${escapeAttribute(current.documentId)}" data-version="${this.renderVersion}" data-scroll-y="${current.scrollY ?? ''}" data-initial-anchor="${initialAnchor}">
	<header class="documentation-toolbar" aria-label="${escapeAttribute(this.strings.navigation)}">
		<button type="button" data-action="back" aria-label="${escapeAttribute(this.strings.back)}" title="${escapeAttribute(this.strings.back)}" ${this.historyIndex === 0 ? 'disabled' : ''}>&larr;</button>
		<button type="button" data-action="forward" aria-label="${escapeAttribute(this.strings.forward)}" title="${escapeAttribute(this.strings.forward)}" ${this.historyIndex === this.history.length - 1 ? 'disabled' : ''}>&rarr;</button>
		<button type="button" data-action="home" title="${escapeAttribute(this.strings.home)}">${escapeHtml(this.strings.home)}</button>
	</header>
	<section class="documentation-search" aria-label="${escapeAttribute(this.strings.search)}">
		<label for="documentation-search">${escapeHtml(this.strings.search)}</label>
		<div class="search-input-row"><input id="documentation-search" type="search" maxlength="200" autocomplete="off" placeholder="${escapeAttribute(this.strings.searchHint)}"><button data-action="closeSearch" aria-label="${escapeAttribute(this.strings.closeSearch)}" title="${escapeAttribute(this.strings.closeSearch)}">&times;</button></div>
		<div id="search-results" hidden data-empty="${escapeAttribute(this.strings.searchEmpty)}" data-loading="${escapeAttribute(this.strings.searchLoading)}" data-results="${escapeAttribute(this.strings.searchResults)}"><p role="status"></p><ul></ul></div>
	</section>
	<div class="documentation-layout">
		<details class="documentation-contents"><summary>${escapeHtml(this.strings.contents)}</summary><nav aria-label="${escapeAttribute(this.strings.contents)}">${link('home')}${contents}</nav></details>
		<main class="documentation-page" id="documentation-article">
			${section ? `<p class="documentation-breadcrumb">${escapeHtml(section.titles[this.locale])}</p>` : ''}
			<details class="documentation-toc" hidden><summary>${escapeHtml(this.strings.onThisPage)}</summary><nav aria-label="${escapeAttribute(this.strings.onThisPage)}"><ul></ul></nav></details>
			${article}
			<nav class="documentation-adjacent" aria-label="${escapeAttribute(this.strings.navigation)}">${adjacent(-1, this.strings.previous)}${adjacent(1, this.strings.next)}</nav>
		</main>
	</div>
	<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
	}
}

function isWebviewMessage(candidate: object): candidate is WebviewMessage {
	if (!candidate || typeof candidate !== 'object' || !('type' in candidate)) {
		return false;
	}

	for (const field of ['documentId', 'anchor', 'uri', 'query', 'action'] as const) {
		if (field in candidate && typeof candidate[field as keyof typeof candidate] !== 'string' && candidate[field as keyof typeof candidate] !== undefined) {
			return false;
		}
	}
	for (const field of ['version', 'scrollY'] as const) {
		if (field in candidate && !validScroll(candidate[field as keyof typeof candidate])) { return false; }
	}
	const type = candidate.type;
	return (
		type === 'search' || type === 'ready' || type === 'scroll' || type === 'appAction' ||
		type === 'navigate' ||
		type === 'back' ||
		type === 'forward' ||
		type === 'home' ||
		type === 'retry' ||
		type === 'openExternal' ||
		type === 'unsupportedUri'
	);
}

function sanitizeAnchor(anchor: string | undefined): string | undefined {
	if (typeof anchor !== 'string' || !anchor || !/^[a-z\d][a-z\d_.:-]*$/i.test(anchor)) {
		return undefined;
	}
	return anchor;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
	return escapeHtml(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function validScroll(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10_000_000;
}

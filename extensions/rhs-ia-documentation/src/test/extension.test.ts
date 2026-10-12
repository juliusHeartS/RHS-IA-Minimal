/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { searchDocumentation, SearchIndex } from '../search';
import { documentationActions } from '../navigation.generated';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { rewriteArticleResources } from '../linkHandler';
import { getDocumentationPage, getDocumentationPageByFileName, localizeDocumentationPage } from '../navigation';

import { getDocumentationStrings, resolveDocumentationLocale } from '../localization';
import { DocumentationViewProvider } from '../documentationView';

suite('RHS-IA Documentation', () => {
	test('contributes and opens the dedicated Documentation view', async () => {
		const extension = vscode.extensions.getExtension('paho.rhs-ia-documentation');
		assert.ok(extension);
		assert.deepStrictEqual(
			extension.packageJSON.contributes.viewsContainers.auxiliarybar,
			[{
				id: 'rhs-ia-documentation',
				title: resolveDocumentationLocale(vscode.env.language) === 'es' ? 'Documentaci\u00f3n de RHS-IA' : 'RHS-IA Documentation',
				icon: 'media/documentation.svg',
				order: 0,
			}],
		);
		assert.deepStrictEqual(
			extension.packageJSON.contributes.views['rhs-ia-documentation'][0],
			{
				id: 'rhs-ia.documentation.view',
				name: resolveDocumentationLocale(vscode.env.language) === 'es' ? 'Documentaci\u00f3n' : 'Documentation',
				type: 'webview',
				contextualTitle: getDocumentationStrings(resolveDocumentationLocale(vscode.env.language)).home,
			},
		);

		await extension.activate();
		const commands = await vscode.commands.getCommands(true);
		assert.deepStrictEqual(
			[
				commands.includes('rhs-ia.documentation.open'),
				commands.includes('rhs-ia.documentation.view.focus'),
			],
			[true, true],
		);

		await vscode.commands.executeCommand('rhs-ia.documentation.open');
	});

	test('allows only registered documentation pages', () => {
		assert.deepStrictEqual(
			[
				getDocumentationPage('getting-started/overview')?.fileName,
				getDocumentationPageByFileName('getting-started/overview.qmd')?.id,
				getDocumentationPage('../getting-started'),
			],
			['getting-started/overview.html', 'getting-started/overview', undefined]
		);
	});

	test('resolves nested page links and resources inside the documentation root', () => {
		const webview = {
			asWebviewUri: (uri: vscode.Uri) => uri,
		} as unknown as vscode.Webview;
		const rewritten = rewriteArticleResources(
			'<a href="../interpreters/python.qmd#setup">Python</a><img src="../images/logo.png"><img src="../../../secret.png">',
			webview,
			vscode.Uri.file('/documentation'),
			'languages/python.html',
		);

		assert.ok(rewritten.includes('data-doc-id="interpreters/python"'));
		assert.ok(rewritten.includes('data-doc-anchor="setup"'));
		assert.ok(rewritten.includes('src="file:///documentation/images/logo.png"'));
		assert.ok(rewritten.includes('src="../../../secret.png"'));
	});

	test('inherits the host language and provides no documentation language controls', () => {
		const manifest = vscode.extensions.getExtension('paho.rhs-ia-documentation')!.packageJSON;
		const expectedLanguage = process.env.RHS_IA_DOCS_TEST_LOCALE;
		if (expectedLanguage) {
			assert.strictEqual(resolveDocumentationLocale(vscode.env.language), expectedLanguage);
		}
		assert.deepStrictEqual({
			locales: ['es', 'es-MX', 'es-EC', 'es-ES', 'ES-mx', 'en', 'en-US', 'fr', 'estonian', ''].map(resolveDocumentationLocale),
			commands: manifest.contributes.commands.map((command: { command: string }) => command.command),
			configuration: manifest.contributes.configuration,
		}, {
			locales: ['es', 'es', 'es', 'es', 'es', 'en', 'en', 'en', 'en', 'en'],
			commands: ['rhs-ia.documentation.open', 'rhs-ia.documentation.home', 'rhs-ia.documentation.search'],
			configuration: undefined,
		});
	});

	test('falls back at the page level without changing document identity', () => {
		const page = { id: 'example', fileName: 'example.html', sourceFileName: 'example.qmd', titles: { en: 'Example' } };
		const resolved = localizeDocumentationPage(page, 'es');
		assert.deepStrictEqual([resolved.id, resolved.locale, resolved.isFallback, resolved.title], ['example', 'en', true, 'Example']);
	});

	test('renders the active language, navigates nested pages and retains history on reveal', async () => {
		const extensionUri = vscode.extensions.getExtension('paho.rhs-ia-documentation')!.extensionUri;
		const provider = new DocumentationViewProvider(extensionUri);
		const messages = new vscode.EventEmitter<object>();
		const disposed = new vscode.EventEmitter<void>();
		let html = '';
		const replies: { type: string; query?: string; results?: { documentId: string; anchor?: string }[] }[] = [];
		const view = {
			webview: {
				get html() { return html; },
				set html(value: string) { html = value; },
				postMessage: async (message: typeof replies[number]) => { replies.push(message); return true; },
			cspSource: 'vscode-webview:',
				asWebviewUri: (uri: vscode.Uri) => uri,
				onDidReceiveMessage: messages.event,
			},
			onDidDispose: disposed.event,
		} as unknown as vscode.WebviewView;
		const locale = resolveDocumentationLocale(vscode.env.language);
		const home = getDocumentationPage('home', locale)!;
		const layout = getDocumentationPage('user-interface/layout', locale)!;
		try {
			provider.resolveWebviewView(view);
			await waitFor(() => html.includes(`<title>${home.title}</title>`));
			assert.ok(html.includes(`<html lang="${locale}">`));
			assert.ok(html.includes(getDocumentationStrings(locale).home));
			assert.ok(html.includes('data-doc-id="user-interface/layout"'));
			assert.ok(!html.includes('data-action="language"'));
			messages.fire({ type: 'search', query: 'Python' });
			await waitFor(() => replies.some(reply => reply.type === 'searchResults'));
			assert.ok(replies.find(reply => reply.type === 'searchResults')?.results?.some(result => result.documentId.includes('python')));
			messages.fire({ type: 'navigate', documentId: 'user-interface/layout', scrollY: 420 });
			await waitFor(() => html.includes(`<title>${layout.title}</title>`));
			assert.ok(html.includes(`lang="${layout.locale}"`));
			messages.fire({ type: 'back' });
			await waitFor(() => html.includes(`<title>${home.title}</title>`));
			assert.ok(html.includes('data-scroll-y="420"'));
			messages.fire({ type: 'forward' });
			await waitFor(() => html.includes(`<title>${layout.title}</title>`));
			disposed.fire();
			html = '';
			provider.resolveWebviewView(view);
			await waitFor(() => html.includes(`<title>${layout.title}</title>`));
			// Ignore malformed and unregistered navigation without breaking the view.
			messages.fire({ type: 'navigate', documentId: '../../secret' });
			messages.fire({ type: 'navigate', documentId: { path: 'home' } });
			assert.ok(html.includes(`<title>${layout.title}</title>`));
		} finally {
			provider.dispose();
			messages.dispose();
			disposed.dispose();
		}
	});

	test('searches accents, multiple terms and title relevance without interpreting query markup', () => {
		const entries = [
			{ documentId: 'one', title: 'Console', section: 'Setup', text: 'Python configuraci\u00f3n for the session', anchor: 'setup' },
			{ documentId: 'two', title: 'Python', section: 'Interpreter', text: 'Choose a session', anchor: 'interpreter' },
		];
		assert.deepStrictEqual({
			ranked: searchDocumentation(entries, 'python').map(result => result.documentId),
			accent: searchDocumentation(entries, 'python configuracion').map(result => result.anchor),
			missing: searchDocumentation(entries, 'missing'),
			empty: searchDocumentation(entries, '  !!!  '),
			markup: searchDocumentation(entries, '<script>alert(1)</script>'),
		}, { ranked: ['two', 'one'], accent: ['setup'], missing: [], empty: [], markup: [] });
	});

	test('ships independent active-locale indexes with registered anchored results', async () => {
		const root = vscode.extensions.getExtension('paho.rhs-ia-documentation')!.extensionUri;
		for (const locale of ['en', 'es']) {
			const bytes = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(root, 'media', 'search', locale, 'index.json'));
			const index: SearchIndex = JSON.parse(new TextDecoder().decode(bytes));
			assert.deepStrictEqual([index.schemaVersion, index.locale, new Set(index.entries.map(entry => entry.documentId)).size], [1, locale, 50]);
			assert.ok(index.entries.every(entry => getDocumentationPage(entry.documentId)));
			assert.ok(searchDocumentation(index.entries, 'Python').some(entry => entry.anchor));
		}
	});

	test('rewrites only exact allowlisted application actions', async () => {
		const webview = { asWebviewUri: (uri: vscode.Uri) => uri } as unknown as vscode.Webview;
		const html = rewriteArticleResources('<a href="rhs-doc-action:settings">Settings</a><a href="rhs-doc-action:settings?command=evil">Bad</a><a href="command:evil">Bad</a><a href="rhs-doc-action:toString">Bad</a>', webview, vscode.Uri.file('/docs'), 'index.html');
		assert.strictEqual((html.match(/data-doc-action=/g) ?? []).length, 1);
		const commands = await vscode.commands.getCommands(true);
		assert.ok(Object.values(documentationActions).every(command => commands.includes(command)));
	});

	test('restores locale-neutral history and ignores corrupt saved state', async () => {
		const root = vscode.extensions.getExtension('paho.rhs-ia-documentation')!.extensionUri;
		for (const saved of [
			{ history: [{ documentId: 'user-interface/layout', anchor: 'panels', scrollY: 180 }], index: 0 },
			{ history: [{ documentId: '../../secret' }], index: 4 },
		]) {
			const storage = { get: () => saved, update: async () => { } } as unknown as vscode.Memento;
			const provider = new DocumentationViewProvider(root, storage);
			const messages = new vscode.EventEmitter<object>();
			const disposed = new vscode.EventEmitter<void>();
			let html = '';
			const view = {
				webview: { set html(value: string) { html = value; }, cspSource: 'vscode-webview:', asWebviewUri: (uri: vscode.Uri) => uri, onDidReceiveMessage: messages.event },
				onDidDispose: disposed.event,
			} as unknown as vscode.WebviewView;
			try {
				provider.resolveWebviewView(view);
				await waitFor(() => !!html);
				assert.ok(html.includes(`data-document-id="${saved.index === 0 ? 'user-interface/layout' : 'home'}"`));
				if (saved.index === 0) { assert.ok(html.includes('data-scroll-y="180"')); }
			} finally { provider.dispose(); messages.dispose(); disposed.dispose(); }
		}
	});

});


async function waitFor(predicate: () => boolean): Promise<void> {
	const deadline = Date.now() + 5000;
	while (!predicate()) {
		if (Date.now() >= deadline) {
			throw new Error('Documentation rendering did not complete.');
		}
		await new Promise(resolve => setTimeout(resolve, 20));
	}
}

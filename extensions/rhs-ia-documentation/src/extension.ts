/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentationViewProvider, DOCUMENTATION_VIEW_ID } from './documentationView';

export function activate(context: vscode.ExtensionContext): void {
	const documentationViewProvider = new DocumentationViewProvider(context.extensionUri, context.globalState);
	context.subscriptions.push(
		documentationViewProvider,
		vscode.window.registerWebviewViewProvider(
			DOCUMENTATION_VIEW_ID,
			documentationViewProvider,
			{
				webviewOptions: {
					retainContextWhenHidden: true,
				},
			},
		),
		vscode.commands.registerCommand('rhs-ia.documentation.home', async () => {
			documentationViewProvider.openHome();
			await vscode.commands.executeCommand(`${DOCUMENTATION_VIEW_ID}.focus`);
		}),
		vscode.commands.registerCommand('rhs-ia.documentation.search', async () => {
			await vscode.commands.executeCommand(`${DOCUMENTATION_VIEW_ID}.focus`);
			await documentationViewProvider.search();
		}),
		vscode.commands.registerCommand('rhs-ia.documentation.open', async () => {
			await vscode.commands.executeCommand(`${DOCUMENTATION_VIEW_ID}.focus`);
		}),
	);
}

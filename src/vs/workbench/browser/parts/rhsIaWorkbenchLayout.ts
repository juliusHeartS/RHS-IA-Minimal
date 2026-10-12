/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

const defaultHiddenViewContainerIds = new Set([
	'workbench.view.scm',
	'workbench.view.debug',
	'workbench.view.remote',
	'workbench.view.extensions',
	'workbench.view.extension.test',
	'workbench.viewContainer.positronPackages',
	'workbench.panel.positronConnections',
	'workbench.panel.positronHelp',
	'workbench.panel.positronHistory',
	'workbench.panel.positronPreview',
]);

export function isRhsIaViewContainerHiddenByDefault(id: string): boolean {
	return defaultHiddenViewContainerIds.has(id);
}

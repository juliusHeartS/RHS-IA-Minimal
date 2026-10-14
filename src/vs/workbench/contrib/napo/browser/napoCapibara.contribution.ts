/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

const CAPIBARA_VIEW_ID = 'capibara.SidebarProvider';

/**
 * Napo starts with the welcome page and no folder, but Capibara is part of the
 * product surface and must be ready immediately. Opening the contributed view
 * here activates the unchanged Capibara extension and lets its webview render.
 *
 * The view is opened only for an empty startup window. When a user opens a
 * folder or workspace later, the normal workbench state is preserved.
 */
class NapoCapibaraStartupContribution extends Disposable implements IWorkbenchContribution {
	private opening = false;
	private opened = false;
	private initializedTask = false;

	constructor(
		@IProductService private readonly productService: IProductService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IViewsService private readonly viewsService: IViewsService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		super();

		if (this.productService.applicationName !== 'napo' || this.workspaceContextService.getWorkbenchState() !== WorkbenchState.EMPTY) {
			return;
		}

		this._register(this.viewDescriptorService.onDidChangeViewContainers(() => {
			void this.openCapibaraWhenAvailable();
		}));
		void this.openCapibaraWhenAvailable();
	}

	private async openCapibaraWhenAvailable(): Promise<void> {
		if (this.opened || this.opening || this.viewDescriptorService.getViewDescriptorById(CAPIBARA_VIEW_ID) === null) {
			return;
		}

		this.opening = true;
		try {
			// A no-folder Napo window is a new working surface. Reuse Capibara's
			// public command instead of touching its implementation: it cancels a
			// stale in-flight turn, keeps the old chat in history, and creates a
			// clean task before the webview can recover pending runtime work.
			if (!this.initializedTask) {
				this.initializedTask = true;
				await this.commandService.executeCommand('capibara.newTask');
			}
			this.opened = (await this.viewsService.openView(CAPIBARA_VIEW_ID, true)) !== null;
		} finally {
			this.opening = false;
		}
	}
}

registerWorkbenchContribution2('napo.capibaraStartup', NapoCapibaraStartupContribution, WorkbenchPhase.Eventually);

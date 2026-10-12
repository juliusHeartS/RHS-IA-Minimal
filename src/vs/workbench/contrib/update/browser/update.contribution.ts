/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../platform/update/common/update.config.contribution.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { CONTEXT_UPDATE_STATE, showReleaseNotesInEditor } from './update.js';
import product from '../../../../platform/product/common/product.js';
import { IUpdateService, StateType } from '../../../../platform/update/common/update.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { isWindows } from '../../../../base/common/platform.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { mnemonicButtonLabel } from '../../../../base/common/labels.js';
import { ShowCurrentReleaseNotesActionId, ShowCurrentReleaseNotesFromCurrentFileActionId } from '../common/update.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

// --- Start Positron ---
import { IRuntimeSessionService } from '../../../services/runtimeSession/common/runtimeSessionService.js';
// eslint-disable-next-line no-duplicate-imports
import { IsDevelopmentContext } from '../../../../platform/contextkey/common/contextkeys.js';
// eslint-disable-next-line no-duplicate-imports
import { storeLastUpdateVersion } from './update.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
// --- End Positron ---

// Disabled: update functionality removed
// workbench.registerWorkbenchContribution(ProductContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(UpdateContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(SwitchProductQualityContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(DefaultAccountUpdateContribution, LifecyclePhase.Eventually);

// Release notes

export class ShowCurrentReleaseNotesAction extends Action2 {

	constructor() {
		super({
			id: ShowCurrentReleaseNotesActionId,
			title: {
				...localize2('showReleaseNotes', "Show Release Notes"),
				mnemonicTitle: localize({ key: 'mshowReleaseNotes', comment: ['&& denotes a mnemonic'] }, "Show &&Release Notes"),
			},
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			menu: [{
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 5,
			}]
		});
	}

	async run(accessor: ServicesAccessor, version?: string): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const productService = accessor.get(IProductService);
		// --- Start Positron ---
		// const openerService = accessor.get(IOpenerService);

		const targetVersion = version ?? productService.positronVersion;

		try {
			await showReleaseNotesInEditor(instantiationService, targetVersion, false);
		} catch (err) {
			throw new Error(localize('update.noReleaseNotesOnline', "This version of {0} does not have release notes available", productService.nameLong));
		}
		// --- End Positron ---
	}
}

export class ShowCurrentReleaseNotesFromCurrentFileAction extends Action2 {

	constructor() {
		super({
			id: ShowCurrentReleaseNotesFromCurrentFileActionId,
			title: {
				...localize2('showReleaseNotesCurrentFile', "Open Current File as Release Notes"),
				mnemonicTitle: localize({ key: 'mshowReleaseNotes', comment: ['&& denotes a mnemonic'] }, "Show &&Release Notes"),
			},
			category: localize2('developerCategory', "Developer"),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const productService = accessor.get(IProductService);

		try {
			// --- Start Positron ---
			await showReleaseNotesInEditor(instantiationService, productService.positronVersion, true);
			// --- End Positron ---
		} catch (err) {
			throw new Error(localize('releaseNotesFromFileNone', "Cannot open the current file as Release Notes"));
		}
	}
}

registerAction2(ShowCurrentReleaseNotesAction);
registerAction2(ShowCurrentReleaseNotesFromCurrentFileAction);

// --- Start Positron ---
class DeveloperRefreshLanguageUsage extends Action2 {
	constructor() {
		super({
			id: 'update.updateLanguageUsage',
			title: localize2('updateLanguageUsage', 'Update Language Usage'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const runtimeSessionService = accessor.get(IRuntimeSessionService);
		runtimeSessionService.updateActiveLanguages();
	}
}

registerAction2(DeveloperRefreshLanguageUsage);
// --- End Positron ---

if (isWindows) {
	class DeveloperApplyUpdateAction extends Action2 {
		constructor() {
			super({
				id: '_update.applyupdate',
				title: localize2('applyUpdate', 'Apply Update from File...'),
				category: Categories.Developer,
				f1: true,
				precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Idle)
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const updateService = accessor.get(IUpdateService);
			const fileDialogService = accessor.get(IFileDialogService);

			const updatePath = await fileDialogService.showOpenDialog({
				title: localize('pickUpdate', "Apply Update from File"),
				filters: [{ name: 'Setup', extensions: ['exe'] }],
				canSelectFiles: true,
				openLabel: mnemonicButtonLabel(localize({ key: 'updateButton', comment: ['&& denotes a mnemonic'] }, "&&Update"))
			});

			if (!updatePath || !updatePath[0]) {
				return;
			}

			await updateService._applySpecificUpdate(updatePath[0].fsPath);
		}
	}

	registerAction2(DeveloperApplyUpdateAction);
}

// --- Start Positron ---
class DeveloperSetLastUpdateVersion extends Action2 {
	constructor() {
		super({
			id: 'update.setLastUpdateVersion',
			title: localize2('setLastUpdateVersion', 'Set Last Update Version'),
			category: Categories.Developer,
			f1: true,
			precondition: IsDevelopmentContext
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const productService = accessor.get(IProductService);
		const notificationService = accessor.get(INotificationService);
		const instantiationService = accessor.get(IInstantiationService);

		const version = await quickInputService.input({
			prompt: localize('enterVersion', "Enter version string"),
			placeHolder: productService.positronVersion,
			value: productService.positronVersion
		});

		if (version) {
			instantiationService.invokeFunction((accessor) => {
				storeLastUpdateVersion(accessor, version);
			});
		} else {
			// notify with notification service that a version was not set
			notificationService.warn(localize('noVersionSet', "No version was set"));
		}
	}
}

registerAction2(DeveloperSetLastUpdateVersion);
// --- End Positron ---

registerAction2(class ShowUpdateInfoAction extends Action2 {
	constructor() {
		super({
			id: 'update.showUpdateInfo',
			title: localize2('showUpdateInfo', "Show Update Info"),
			category: Categories.Developer,
			f1: true,
			precondition: IsWebContext.negate(),
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const quickInputService = accessor.get(IQuickInputService);
		const markdown = await quickInputService.input({ prompt: localize('showUpdateInfo.prompt', "Enter markdown to render, or JSON with markdown/buttons (leave empty to load from URL)") });
		if (markdown === undefined) {
			return; // cancelled
		}
		await commandService.executeCommand('_update.showUpdateInfo', markdown || undefined);
	}
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) RHS-IA contributors. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable header/header -- RHS-IA attribution is validated by the repository hygiene checker. */

/// <reference types="vitest/globals" />

import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { upcastPartial } from '../../../../base/test/common/mock.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { localize2 } from '../../../../nls.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { createTestContainer } from '../../../../test/vitest/positronTestContainer.js';
import { IViewContainerModel, IViewDescriptorService, ViewContainer, ViewContainerLocation } from '../../../common/views.js';
import { IActivityService } from '../../../services/activity/common/activity.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { TestStorageService } from '../../../test/common/workbenchTestServices.js';
import { IPaneCompositeBarOptions, PaneCompositeBar } from '../../../browser/parts/paneCompositeBar.js';
import { IPaneCompositePart } from '../../../browser/parts/paneCompositePart.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';

const explorerId = 'workbench.view.explorer';
const hiddenIds = [
	'workbench.view.scm',
	'workbench.view.debug',
	'workbench.view.remote',
	'workbench.view.extensions',
	'workbench.view.extension.test',
	'workbench.viewContainer.positronPackages',
];

describe('RHS-IA Activity Bar defaults', () => {
	const ctx = createTestContainer()
		.stub(IContextMenuService, {})
		.stub(IWorkbenchLayoutService, {})
		.stub(IContextKeyService, { contextMatchesRules: () => true })
		.stub(IConfigurationService, {})
		.stub(IWorkbenchEnvironmentService, {})
		.stub(IActivityService, { onDidChangeActivity: Event.None, getViewContainerActivities: () => [] })
		.stub(IViewsService, { isViewContainerActive: () => true })
		.build();

	let storageService: TestStorageService;
	let extensionsRegistered: DeferredPromise<boolean>;
	let containers: ViewContainer[];
	let onDidChangeViewContainers: Emitter<{
		added: readonly { container: ViewContainer; location: ViewContainerLocation }[];
		removed: readonly { container: ViewContainer; location: ViewContainerLocation }[];
	}>;

	/** Container metadata is enough; the panes themselves are never opened. */
	function container(id: string): ViewContainer {
		return { id, title: localize2('testViewContainer', 'Test View Container'), ctorDescriptor: new SyncDescriptor(ViewPaneContainer) };
	}

	beforeEach(() => {
		storageService = ctx.disposables.add(new TestStorageService());
		extensionsRegistered = new DeferredPromise<boolean>();
		containers = [explorerId, ...hiddenIds].map(container);
		onDidChangeViewContainers = ctx.disposables.add(new Emitter());
		ctx.instantiationService.stub(IStorageService, storageService);
		ctx.instantiationService.stub(IExtensionService, { whenInstalledExtensionsRegistered: () => extensionsRegistered.p });
		ctx.instantiationService.stub(IViewDescriptorService, {
			onDidChangeViewContainers: onDidChangeViewContainers.event,
			onDidChangeContainerLocation: Event.None,
			getViewContainersByLocation: () => containers,
			getViewContainerById: id => containers.find(viewContainer => viewContainer.id === id) ?? null,
			getViewContainerLocation: () => ViewContainerLocation.Sidebar,
			getDefaultViewContainer: () => containers[0],
			getViewContainerModel: viewContainer => upcastPartial<IViewContainerModel>({
				viewContainer,
				title: viewContainer.id,
				allViewDescriptors: [],
				activeViewDescriptors: [],
				onDidChangeContainerInfo: Event.None,
				onDidChangeActiveViewDescriptors: Event.None,
			}),
		});
	});

	/** Exercise real PaneCompositeBar registration and its real CompositeBar model. */
	function createBar(part = Parts.ACTIVITYBAR_PART, hideViewContainersByDefault = true): PaneCompositeBar {
		const options: IPaneCompositeBarOptions = {
			partContainerClass: 'activitybar',
			pinnedViewContainersKey: 'test.activity.pinned',
			placeholderViewContainersKey: 'test.activity.placeholders',
			viewContainersWorkspaceStateKey: 'test.activity.workspace',
			icon: true,
			iconSize: 24,
			recomputeSizes: false,
			orientation: part === Parts.ACTIVITYBAR_PART ? ActionsOrientation.VERTICAL : ActionsOrientation.HORIZONTAL,
			compositeSize: 48,
			overflowActionSize: 48,
			activityHoverOptions: { position: () => HoverPosition.RIGHT },
			fillExtraContextMenuActions: () => { },
			colors: () => ({}),
			hideViewContainersByDefault,
		};
		const paneCompositePart = upcastPartial<IPaneCompositePart>({
			getActivePaneComposite: () => undefined,
			onDidPaneCompositeOpen: Event.None,
			onDidPaneCompositeClose: Event.None,
		});
		return ctx.disposables.add(ctx.instantiationService.createInstance(PaneCompositeBar, ViewContainerLocation.Sidebar, options, part, paneCompositePart));
	}

	it.each([Parts.ACTIVITYBAR_PART, Parts.SIDEBAR_PART])('shows only Explorer with empty profile storage in %s', async part => {
		const bar = createBar(part);
		await extensionsRegistered.complete(true);

		expect({
			pinned: bar.getPinnedPaneCompositeIds(),
			visible: bar.getVisiblePaneCompositeIds(),
			menu: bar.getContextMenuActions().map(action => ({ id: action.id, checked: action.checked })),
		}).toEqual({
			pinned: [explorerId],
			visible: [explorerId],
			menu: [{ id: explorerId, checked: true }, ...hiddenIds.map(id => ({ id, checked: false }))],
		});
	});

	it('hides a bundled container registered later and allows new third-party containers', async () => {
		containers = [container(explorerId)];
		const bar = createBar();
		await extensionsRegistered.complete(true);
		const added = [container(hiddenIds[4]), container('workbench.view.extension.rhs-agent')];
		containers.push(...added);
		onDidChangeViewContainers.fire({ added: added.map(viewContainer => ({ container: viewContainer, location: ViewContainerLocation.Sidebar })), removed: [] });

		expect(bar.getVisiblePaneCompositeIds()).toEqual([explorerId, 'workbench.view.extension.rhs-agent']);
	});

	it('restores saved visibility choices when the toolbar is recreated', async () => {
		const firstBar = createBar();
		await extensionsRegistered.complete(true);
		firstBar.dispose();
		storageService.store('test.activity.pinned', JSON.stringify(containers.map(viewContainer => ({
			id: viewContainer.id,
			pinned: viewContainer.id === hiddenIds[0],
			visible: true,
		}))), StorageScope.PROFILE, StorageTarget.USER);

		const restartedBar = createBar();
		expect(restartedBar.getVisiblePaneCompositeIds()).toEqual([hiddenIds[0]]);
	});

	it('retains upstream defaults when the RHS-IA option is disabled', () => {
		expect(createBar(Parts.ACTIVITYBAR_PART, false).getVisiblePaneCompositeIds()).toEqual([explorerId, ...hiddenIds]);
	});
});

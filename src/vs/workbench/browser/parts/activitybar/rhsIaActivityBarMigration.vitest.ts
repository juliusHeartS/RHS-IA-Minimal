/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference types="vitest/globals" />

import { StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../test/common/workbenchTestServices.js';
import { isRhsIaViewContainerHiddenByDefault } from '../rhsIaWorkbenchLayout.js';
import { applyRhsIaAuxiliaryBarDefaults, hideViewContainersByDefault, migrateRhsIaActivityBarState, migrateRhsIaAuxiliaryBarState, removeRetiredViewContainers } from './rhsIaActivityBarMigration.js';

describe('RHS-IA Activity Bar migration', () => {
	it('removes retired view containers', () => {
		const state = JSON.stringify([
			{ id: 'workbench.view.explorer', pinned: true },
			{ id: 'workbench.panel.chat', pinned: true },
			{ id: 'posit-publisher', pinned: true },
			{ id: 'github-pull-requests', pinned: true },
			{ id: 'github-pull-request', pinned: true },
			{ id: 'workbench.view.extensions', pinned: false },
		]);

		expect(JSON.parse(removeRetiredViewContainers(state))).toEqual([
			{ id: 'workbench.view.explorer', pinned: true },
			{ id: 'workbench.view.extensions', pinned: false },
		]);
	});

	it('preserves malformed cached state', () => {
		expect(removeRetiredViewContainers('{invalid')).toBe('{invalid');
		expect(hideViewContainersByDefault('{invalid')).toBe('{invalid');
	});

	it('marks the requested view containers as unpinned', () => {
		const state = JSON.stringify([
			{ id: 'workbench.view.explorer', pinned: true },
			{ id: 'workbench.view.scm', pinned: true },
			{ id: 'workbench.view.debug', pinned: true },
			{ id: 'workbench.view.remote', pinned: true },
			{ id: 'workbench.view.extensions', pinned: true },
			{ id: 'workbench.view.extension.test', pinned: true },
			{ id: 'workbench.viewContainer.positronPackages', pinned: true },
			{ id: 'workbench.panel.positronConnections', pinned: true },
			{ id: 'workbench.panel.positronHelp', pinned: true },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: true },
			{ id: 'workbench.panel.positronHistory', pinned: true },
			{ id: 'workbench.panel.positronPreview', pinned: true },
		]);

		const migrated = JSON.parse(hideViewContainersByDefault(state)) as { id: string; pinned: boolean }[];
		expect(migrated.find(entry => entry.id === 'workbench.view.explorer')?.pinned).toBe(true);
		expect(migrated.find(entry => entry.id === 'workbench.view.extension.rhs-ia-documentation')?.pinned).toBe(true);
		expect(migrated.filter(entry => entry.id !== 'workbench.view.explorer' && entry.id !== 'workbench.view.extension.rhs-ia-documentation').every(entry => entry.pinned === false)).toBe(true);
		expect(isRhsIaViewContainerHiddenByDefault('workbench.view.scm')).toBe(true);
		expect(isRhsIaViewContainerHiddenByDefault('workbench.view.extension.test')).toBe(true);
		expect(isRhsIaViewContainerHiddenByDefault('workbench.view.testing')).toBe(false);
		expect(isRhsIaViewContainerHiddenByDefault('workbench.view.explorer')).toBe(false);
		expect(isRhsIaViewContainerHiddenByDefault('workbench.view.extension.rhs-ia-documentation')).toBe(false);
	});

	it('pins Documentation near the front while hiding the other auxiliary defaults', () => {
		const state = JSON.stringify([
			{ id: 'workbench.panel.positronSession', pinned: true, order: 1 },
			{ id: 'workbench.panel.positronConnections', pinned: true, order: 2 },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: false, order: 7 },
		]);

		expect(JSON.parse(applyRhsIaAuxiliaryBarDefaults(state))).toEqual([
			{ id: 'workbench.panel.positronSession', pinned: true, order: 1 },
			{ id: 'workbench.panel.positronConnections', pinned: false, order: 2 },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: true, order: 0 },
		]);
	});

	it('migrates pinned and placeholder state whenever stale state reappears', () => {
		const storageService = new TestStorageService();
		const pinnedKey = 'test.pinned';
		const placeholderKey = 'test.placeholders';
		const state = JSON.stringify([{ id: 'workbench.panel.chat' }, { id: 'workbench.view.explorer' }]);
		storageService.store(pinnedKey, state, StorageScope.PROFILE, StorageTarget.USER);
		storageService.store(placeholderKey, state, StorageScope.PROFILE, StorageTarget.MACHINE);

		migrateRhsIaActivityBarState(storageService, pinnedKey, placeholderKey);

		expect(JSON.parse(storageService.get(pinnedKey, StorageScope.PROFILE, '[]'))).toEqual([{ id: 'workbench.view.explorer' }]);
		expect(JSON.parse(storageService.get(placeholderKey, StorageScope.PROFILE, '[]'))).toEqual([{ id: 'workbench.view.explorer' }]);

		storageService.store(pinnedKey, state, StorageScope.PROFILE, StorageTarget.USER);
		migrateRhsIaActivityBarState(storageService, pinnedKey, placeholderKey);
		expect(JSON.parse(storageService.get(pinnedKey, StorageScope.PROFILE, '[]'))).toEqual([{ id: 'workbench.view.explorer' }]);
		storageService.dispose();
	});

	it('applies auxiliary bar defaults once and preserves later user choices', () => {
		const storageService = new TestStorageService();
		const pinnedKey = 'test.auxiliary.pinned';
		storageService.store(pinnedKey, JSON.stringify([
			{ id: 'workbench.panel.positronHelp', pinned: true },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: false, order: 7 },
		]), StorageScope.PROFILE, StorageTarget.USER);

		migrateRhsIaAuxiliaryBarState(storageService, pinnedKey);
		expect(JSON.parse(storageService.get(pinnedKey, StorageScope.PROFILE, '[]'))).toEqual([
			{ id: 'workbench.panel.positronHelp', pinned: false },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: true, order: 0 },
		]);

		storageService.store(pinnedKey, JSON.stringify([
			{ id: 'workbench.panel.positronHelp', pinned: true },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: false, order: 9 },
		]), StorageScope.PROFILE, StorageTarget.USER);
		migrateRhsIaAuxiliaryBarState(storageService, pinnedKey);
		expect(JSON.parse(storageService.get(pinnedKey, StorageScope.PROFILE, '[]'))).toEqual([
			{ id: 'workbench.panel.positronHelp', pinned: true },
			{ id: 'workbench.view.extension.rhs-ia-documentation', pinned: false, order: 9 },
		]);
		storageService.dispose();
	});
});

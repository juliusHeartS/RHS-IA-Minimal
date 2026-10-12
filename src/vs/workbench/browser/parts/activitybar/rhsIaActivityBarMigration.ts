/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isRhsIaViewContainerHiddenByDefault } from '../rhsIaWorkbenchLayout.js';

const retiredViewContainerIds = new Set([
	'github-pull-request',
	'github-pull-requests',
	'posit-publisher',
	'workbench.panel.chat'
]);

const activityBarDefaultsMigrationKey = 'rhs-ia.workbench.activityBarDefaults.v2';
const auxiliaryBarDefaultsMigrationKey = 'rhs-ia.workbench.auxiliaryBarDefaults.v2';
const accountsVisibilityPreferenceKey = 'workbench.activity.showAccounts';
const rhsIaDocumentationViewContainerId = 'workbench.view.extension.rhs-ia-documentation';

interface IStoredViewContainer {
	readonly id?: string;
	readonly pinned?: boolean;
}

export function removeRetiredViewContainers(serializedState: string): string {
	try {
		const state = JSON.parse(serializedState) as unknown;
		if (!Array.isArray(state)) {
			return serializedState;
		}

		const filteredState = state.filter((entry: unknown) => {
			return typeof entry !== 'object' || entry === null || !retiredViewContainerIds.has((entry as IStoredViewContainer).id ?? '');
		});
		return filteredState.length === state.length ? serializedState : JSON.stringify(filteredState);
	} catch {
		return serializedState;
	}
}

export function hideViewContainersByDefault(serializedState: string): string {
	try {
		const state = JSON.parse(serializedState) as unknown;
		if (!Array.isArray(state)) {
			return serializedState;
		}

		let changed = false;
		const migratedState = state.map((entry: unknown) => {
			if (typeof entry !== 'object' || entry === null || !isRhsIaViewContainerHiddenByDefault((entry as IStoredViewContainer).id ?? '') || (entry as IStoredViewContainer).pinned === false) {
				return entry;
			}

			changed = true;
			return { ...entry, pinned: false };
		});
		return changed ? JSON.stringify(migratedState) : serializedState;
	} catch {
		return serializedState;
	}
}

export function applyRhsIaAuxiliaryBarDefaults(serializedState: string): string {
	try {
		const state = JSON.parse(serializedState) as unknown;
		if (!Array.isArray(state)) {
			return serializedState;
		}

		let changed = false;
		const migratedState = state.map((entry: unknown) => {
			if (typeof entry !== 'object' || entry === null) {
				return entry;
			}

			const viewContainer = entry as IStoredViewContainer & { readonly order?: number };
			if (viewContainer.id === rhsIaDocumentationViewContainerId && (viewContainer.pinned !== true || viewContainer.order !== 0)) {
				changed = true;
				return { ...viewContainer, pinned: true, order: 0 };
			}

			if (isRhsIaViewContainerHiddenByDefault(viewContainer.id ?? '') && viewContainer.pinned !== false) {
				changed = true;
				return { ...viewContainer, pinned: false };
			}

			return entry;
		});

		return changed ? JSON.stringify(migratedState) : serializedState;
	} catch {
		return serializedState;
	}
}

function migrateDefaultHiddenViewContainers(
	storageService: IStorageService,
	pinnedViewContainersKey: string,
	migrationKey: string,
): void {
	if (storageService.getBoolean(migrationKey, StorageScope.PROFILE, false)) {
		return;
	}

	const currentState = storageService.get(pinnedViewContainersKey, StorageScope.PROFILE);
	if (currentState !== undefined) {
		const migratedState = hideViewContainersByDefault(currentState);
		if (migratedState !== currentState) {
			storageService.store(pinnedViewContainersKey, migratedState, StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	storageService.store(migrationKey, true, StorageScope.PROFILE, StorageTarget.USER);
}

export function migrateRhsIaActivityBarState(
	storageService: IStorageService,
	pinnedViewContainersKey: string,
	placeholderViewContainersKey: string,
): void {
	for (const [key, target] of [
		[pinnedViewContainersKey, StorageTarget.USER],
		[placeholderViewContainersKey, StorageTarget.MACHINE],
	] as const) {
		const currentState = storageService.get(key, StorageScope.PROFILE);
		if (currentState === undefined) {
			continue;
		}

		const migratedState = removeRetiredViewContainers(currentState);
		if (migratedState !== currentState) {
			storageService.store(key, migratedState, StorageScope.PROFILE, target);
		}
	}

	migrateDefaultHiddenViewContainers(storageService, pinnedViewContainersKey, activityBarDefaultsMigrationKey);
	if (!storageService.getBoolean(`${activityBarDefaultsMigrationKey}.accounts`, StorageScope.PROFILE, false)) {
		storageService.store(accountsVisibilityPreferenceKey, false, StorageScope.PROFILE, StorageTarget.USER);
		storageService.store(`${activityBarDefaultsMigrationKey}.accounts`, true, StorageScope.PROFILE, StorageTarget.USER);
	}
}

export function migrateRhsIaAuxiliaryBarState(
	storageService: IStorageService,
	pinnedViewContainersKey: string,
): void {
	if (storageService.getBoolean(auxiliaryBarDefaultsMigrationKey, StorageScope.PROFILE, false)) {
		return;
	}

	const currentState = storageService.get(pinnedViewContainersKey, StorageScope.PROFILE);
	if (currentState !== undefined) {
		const migratedState = applyRhsIaAuxiliaryBarDefaults(currentState);
		if (migratedState !== currentState) {
			storageService.store(pinnedViewContainersKey, migratedState, StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	storageService.store(auxiliaryBarDefaultsMigrationKey, true, StorageScope.PROFILE, StorageTarget.USER);
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2025 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { Project } from './types';

/**
 * List of projects to include in the SBOM.
 * Paths are relative to the repository root.
 *
 * Note: extensions/positron-r/ark is a git submodule and must be initialized
 * before SBOM generation.
 */
export const PROJECTS: Project[] = [
	{
		name: 'Positron Core',
		path: '.',
		type: 'npm'
	},
	{
		name: 'Positron CLI',
		path: './cli',
		type: 'rust'
	},
	{
		name: 'Ark (R Kernel)',
		path: './extensions/positron-r/ark/crates/ark',
		type: 'rust'
	}
];

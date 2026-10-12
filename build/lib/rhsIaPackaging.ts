/*---------------------------------------------------------------------------------------------
 *  Copyright (c) RHS-IA contributors. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/** Require the actual release maintainer instead of attributing RHS-IA packages to upstream. */
export function getLinuxPackageMaintainer(value: string | undefined): string {
	const maintainer = value?.trim();
	if (!value || !maintainer || value.includes('%') || [...value].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || !/^[^<>]+ <[^<>\s@]+@[^<>\s@]+>$/.test(maintainer)) {
		throw new Error('Set RHS_IA_LINUX_MAINTAINER to the approved release maintainer in the form Name <email> before packaging RHS-IA for Linux.');
	}
	return maintainer;
}

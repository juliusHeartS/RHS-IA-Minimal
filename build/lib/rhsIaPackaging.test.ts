/*---------------------------------------------------------------------------------------------
 *  Copyright (c) RHS-IA contributors. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getLinuxPackageMaintainer } from './rhsIaPackaging.ts';

test('requires an explicit maintainer and rejects package metadata injection', () => {
	for (const value of [undefined, '', 'RHS-IA', 'Team <invalid>', 'Team <a@example.org>\nVendor: Other', 'Team <a@example.org>\r', 'Team %{lua:print(1)} <a@example.org>']) {
		assert.throws(() => getLinuxPackageMaintainer(value), /RHS_IA_LINUX_MAINTAINER/);
	}
	assert.equal(getLinuxPackageMaintainer('  Release Team <release@example.org>  '), 'Release Team <release@example.org>');
});

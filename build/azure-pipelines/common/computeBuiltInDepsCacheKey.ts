/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { IExtensionDefinition } from '../../lib/builtInExtensions.ts';
import { mergeBundledExtensionDefinitions, validateRhsIaLanguagePack } from '../../lib/bundledExtensions.ts';

const root = path.join(import.meta.dirname, '../../..');
const productjson = JSON.parse(fs.readFileSync(path.join(root, 'product.json'), 'utf8'));
validateRhsIaLanguagePack(productjson, root);
const shasum = crypto.createHash('sha256');

const extensions = mergeBundledExtensionDefinitions(productjson.builtInExtensions as IExtensionDefinition[] || [], root);
for (const extension of extensions) {
	shasum.update(`${extension.name}@${extension.version}:${extension.sha256}`);
}

process.stdout.write(shasum.digest('hex'));

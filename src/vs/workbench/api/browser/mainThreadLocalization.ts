/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadLocalizationShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILanguagePackService } from '../../../platform/languagePacks/common/languagePacks.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';

@extHostNamedCustomer(MainContext.MainThreadLocalization)
export class MainThreadLocalization extends Disposable implements MainThreadLocalizationShape {

	constructor(
		extHostContext: IExtHostContext,
		@IFileService private readonly fileService: IFileService,
		@ILanguagePackService private readonly languagePackService: ILanguagePackService,
		@IExtensionService private readonly extensionService: IExtensionService
	) {
		super();
	}

	async $fetchBuiltInBundleUri(id: string, language: string): Promise<URI | undefined> {
		try {
			const uri = await this.languagePackService.getBuiltInExtensionTranslationsUri(id, language);
			return uri;
		} catch (e) {
			return undefined;
		}
	}

	async $fetchBuiltInExtensionBundleUri(id: string, language: string): Promise<URI | undefined> {
		try {
			const extension = await this.extensionService.getExtension(id);
			if (!extension?.isBuiltin) {
				return undefined;
			}

			// Napo may ship a local bundle for a built-in extension even when the
			// inherited manifest does not declare `l10n`. Resolve the conventional
			// location only after checking that the file is actually packaged.
			const l10nPath = extension.l10n ?? './l10n';
			const bundleUri = URI.joinPath(extension.extensionLocation, l10nPath, `bundle.l10n.${language}.json`);
			return await this.fileService.exists(bundleUri) ? bundleUri : undefined;
		} catch (e) {
			return undefined;
		}
	}

	async $fetchBundleContents(uriComponents: UriComponents): Promise<string> {
		const contents = await this.fileService.readFile(URI.revive(uriComponents));
		return contents.value.toString();
	}
}

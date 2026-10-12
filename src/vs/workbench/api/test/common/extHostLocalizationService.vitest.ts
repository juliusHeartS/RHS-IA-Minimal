/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference types="vitest/globals" />

import { URI, UriComponents } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ExtHostLocalizationService } from '../../common/extHostLocalizationService.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { MainThreadLocalizationShape } from '../../common/extHost.protocol.js';
import { IEnvironment } from '../../../services/extensions/common/extensionHostProtocol.js';
import { SingleProxyRPCProtocol } from './testRPCProtocol.js';

const extensionLocation = URI.file('/builtin/positron-python');

const builtinExtension: IExtensionDescription = {
	identifier: new ExtensionIdentifier('ms-python.python'),
	targetPlatform: 'undefined' as IExtensionDescription['targetPlatform'],
	isBuiltin: true,
	isUserBuiltin: false,
	isUnderDevelopment: false,
	name: 'python',
	publisher: 'ms-python',
	version: '1.0.0',
	engines: { vscode: '*' },
	extensionLocation,
	l10n: './l10n',
	preRelease: false
};

function createService(languagePackUri: URI | undefined, bundleContents: object) {
	let fetchedBundleUri: URI | undefined;
	const shape = new class extends mock<MainThreadLocalizationShape>() {
		override $fetchBuiltInBundleUri(): Promise<URI | undefined> {
			return Promise.resolve(languagePackUri);
		}

		override $fetchBundleContents(uri: UriComponents): Promise<string> {
			fetchedBundleUri = URI.revive(uri);
			return Promise.resolve(JSON.stringify(bundleContents));
		}
	};
	const initData = new class extends mock<IExtHostInitDataService>() {
		override readonly environment = new class extends mock<IEnvironment>() {
			override readonly appLanguage = 'es';
		};
	};

	return {
		service: new ExtHostLocalizationService(initData, SingleProxyRPCProtocol(shape), new NullLogService()),
		getFetchedBundleUri: () => fetchedBundleUri
	};
}

describe('ExtHostLocalizationService', () => {
	it('loads an extension-local bundle when a built-in extension is absent from the language pack', async () => {
		const { service, getFetchedBundleUri } = createService(undefined, {
			'Create Python Environment': 'Crear entorno de Python'
		});

		await service.initializeLocalizedMessages(builtinExtension);

		expect({
			bundleUri: getFetchedBundleUri()?.toString(),
			message: service.getMessage(builtinExtension.identifier.value, { message: 'Create Python Environment' })
		}).toEqual({
			bundleUri: URI.joinPath(extensionLocation, 'l10n', 'bundle.l10n.es.json').toString(),
			message: 'Crear entorno de Python'
		});
	});

	it('continues to prefer the language-pack bundle for built-in extensions represented there', async () => {
		const languagePackUri = URI.file('/language-pack/positron-python.i18n.json');
		const { service, getFetchedBundleUri } = createService(languagePackUri, {
			contents: { bundle: { Greeting: 'Desde el paquete de idioma' } }
		});

		await service.initializeLocalizedMessages(builtinExtension);

		expect({
			bundleUri: getFetchedBundleUri()?.toString(),
			message: service.getMessage(builtinExtension.identifier.value, { message: 'Greeting' })
		}).toEqual({
			bundleUri: languagePackUri.toString(),
			message: 'Desde el paquete de idioma'
		});
	});
});

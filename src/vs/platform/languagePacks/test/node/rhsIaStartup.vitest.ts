/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference types="vitest/globals" />

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { parse } from '../../../../base/common/jsonc.js';
import {
	ensureBundledSpanishLanguagePackConfigSync,
	getEffectiveUserLocale,
	getRhsIaDataFolderName,
	getRhsIaStatePaths,
	migrateLegacyPositronStateSync,
	readOrCreateArgvConfigSync
} from '../../node/rhsIaStartup.js';

const temporaryDirectories: string[] = [];

afterEach(() => {
	for (const directory of temporaryDirectories.splice(0)) {
		fs.rmSync(directory, { recursive: true, force: true });
	}
});

describe('RHS-IA startup state', () => {
	it('returns the newly created Spanish argv config on an empty profile', () => {
		const directory = createTemporaryDirectory();
		const argvPath = path.join(directory, 'argv.json');

		const config = readOrCreateArgvConfigSync(argvPath);

		expect(config.locale).toBe('es');
		expect(parse(fs.readFileSync(argvPath, 'utf8'))).toMatchObject({ locale: 'es' });
	});

	it('initializes an existing RHS-IA profile without an explicit locale', () => {
		const directory = createTemporaryDirectory();
		const argvPath = path.join(directory, 'argv.json');
		fs.writeFileSync(argvPath, JSON.stringify({ 'disable-chromium-sandbox': true }));

		const config = readOrCreateArgvConfigSync(argvPath);

		expect(config).toMatchObject({ locale: 'es', 'disable-chromium-sandbox': true });
		expect(JSON.parse(fs.readFileSync(argvPath, 'utf8')).locale).toBe('es');
	});

	it('migrates a legacy profile without copying its extension directory', () => {
		const homeDirectory = createTemporaryDirectory();
		const legacyDirectory = path.join(homeDirectory, '.positron');
		fs.mkdirSync(path.join(legacyDirectory, 'extensions', 'user.extension'), { recursive: true });
		fs.writeFileSync(path.join(legacyDirectory, 'extensions', 'user.extension', 'package.json'), '{}');
		fs.writeFileSync(path.join(legacyDirectory, 'argv.json'), '{\n\t"disable-chromium-sandbox": true\n}\n');
		const legacyArgv = fs.readFileSync(path.join(legacyDirectory, 'argv.json'), 'utf8');

		migrateLegacyPositronStateSync({ homeDirectory, dataFolderName: '.rhs-ia', isPortable: false });

		const paths = getRhsIaStatePaths(homeDirectory, '.rhs-ia');
		const migratedArgv = JSON.parse(fs.readFileSync(paths.argvPath, 'utf8'));
		expect(migratedArgv).toEqual({ 'disable-chromium-sandbox': true, locale: 'es' });
		expect(fs.existsSync(path.join(paths.dataDirectory, 'extensions'))).toBe(false);
		expect(fs.readFileSync(paths.legacyArgvPath, 'utf8')).toBe(legacyArgv);
		expect(JSON.parse(fs.readFileSync(paths.migrationStatePath, 'utf8')).version).toBe(1);
	});

	it.each(['es', 'en'])('preserves an explicit legacy locale: %s', locale => {
		const homeDirectory = createTemporaryDirectory();
		const legacyDirectory = path.join(homeDirectory, '.positron');
		fs.mkdirSync(legacyDirectory, { recursive: true });
		fs.writeFileSync(path.join(legacyDirectory, 'argv.json'), JSON.stringify({ locale }));

		migrateLegacyPositronStateSync({ homeDirectory, dataFolderName: '.rhs-ia', isPortable: false });

		expect(JSON.parse(fs.readFileSync(path.join(homeDirectory, '.rhs-ia', 'argv.json'), 'utf8')).locale).toBe(locale);
	});

	it('is idempotent and preserves a later explicit choice', () => {
		const homeDirectory = createTemporaryDirectory();
		const legacyDirectory = path.join(homeDirectory, '.positron');
		fs.mkdirSync(legacyDirectory, { recursive: true });
		fs.writeFileSync(path.join(legacyDirectory, 'argv.json'), JSON.stringify({ locale: 'es' }));

		migrateLegacyPositronStateSync({ homeDirectory, dataFolderName: '.rhs-ia', isPortable: false });
		const argvPath = path.join(homeDirectory, '.rhs-ia', 'argv.json');
		fs.writeFileSync(argvPath, JSON.stringify({ locale: 'en' }));
		migrateLegacyPositronStateSync({ homeDirectory, dataFolderName: '.rhs-ia', isPortable: false });

		expect(JSON.parse(fs.readFileSync(argvPath, 'utf8')).locale).toBe('en');
	});

	it('gives the command line locale precedence over argv.json', () => {
		expect(getEffectiveUserLocale('en', { locale: 'es' })).toBe('en');
		expect(getEffectiveUserLocale(undefined, { locale: 'es' })).toBe('es');
	});

	it('keeps RHS-IA state isolated from Positron state', () => {
		const homeDirectory = createTemporaryDirectory();
		const paths = getRhsIaStatePaths(homeDirectory, '.rhs-ia');

		expect(paths.dataDirectory).toBe(path.join(homeDirectory, '.rhs-ia'));
		expect(paths.legacyDataDirectory).toBe(path.join(homeDirectory, '.positron'));
		expect(paths.dataDirectory).not.toBe(paths.legacyDataDirectory);
		expect(getRhsIaDataFolderName('.rhs-ia', true)).toBe('.rhs-ia-dev');
	});

	it('packages a distinct product identity with the Spanish pack', () => {
		const productPath = path.resolve(import.meta.dirname, '../../../../../../product.json');
		const product = JSON.parse(fs.readFileSync(productPath, 'utf8')) as {
			nameShort: string;
			applicationName: string;
			dataFolderName: string;
			serverApplicationName: string;
			serverDataFolderName: string;
			darwinBundleIdentifier: string;
			linuxIconName: string;
			urlProtocol: string;
			rhsIaUseMockKeychain: boolean;
			nativeChatSetupEnabled: boolean;
			builtInExtensionsEnabledWithAutoUpdates: string[];
			defaultChatAgent?: {
				extensionId: string;
				chatExtensionId: string;
				providerExtensionId: string;
				providerScopes: string[];
				provider: Record<string, { id: string; name: string }>;
			};
			builtInExtensions: { name: string; version: string; vsix?: string; sha256: string }[];
		};
		const spanishPack = product.builtInExtensions.find(extension => extension.name === 'ms-ceintl.vscode-language-pack-es');

		expect(product.nameShort).toBe('RHS-IA');
		expect(product.applicationName).toBe('rhs-ia');
		expect(product.dataFolderName).toBe('.rhs-ia');
		expect(product.serverApplicationName).toBe('rhs-ia-server');
		expect(product.serverDataFolderName).toBe('.rhs-ia-server');
		expect(product.darwinBundleIdentifier).toBe('co.posit.positron');
		expect(product.linuxIconName).toBe('org.paho.rhsia');
		expect(product.urlProtocol).toBe('rhs-ia');
		expect(product.rhsIaUseMockKeychain).toBe(true);
		expect(product.nativeChatSetupEnabled).toBe(false);
		expect(product.builtInExtensionsEnabledWithAutoUpdates).toEqual([]);
		expect(product.defaultChatAgent?.extensionId).toBe('');
		expect(product.defaultChatAgent?.chatExtensionId).toBe('');
		expect(product.defaultChatAgent?.providerExtensionId).toBe('');
		expect(product.defaultChatAgent?.providerScopes).toEqual([]);
		expect(product.defaultChatAgent?.provider).toEqual({
			default: { id: '', name: '' },
			enterprise: { id: '', name: '' },
			google: { id: '', name: '' },
			apple: { id: '', name: '' }
		});
		expect(spanishPack).toMatchObject({ name: 'ms-ceintl.vscode-language-pack-es', version: '1.111.0' });
		expect(spanishPack?.vsix).toBe('language-packs/vscode-language-pack-es-1.111.0.vsix');
	});
});

describe('bundled Spanish language-pack registration', () => {
	it('repairs moved and stale bundled paths without removing unrelated entries', () => {
		const root = createTemporaryDirectory();
		const userDataPath = path.join(root, 'user-data');
		const oldPackPath = createLanguagePack(root, 'old-pack', '1.0.0');

		expect(ensureBundledSpanishLanguagePackConfigSync('es', userDataPath, oldPackPath)).toBe(true);
		const languagePacksPath = path.join(userDataPath, 'languagepacks.json');
		const oldConfiguration = JSON.parse(fs.readFileSync(languagePacksPath, 'utf8'));
		oldConfiguration.fr = { hash: 'fr', extensions: [], translations: {} };
		oldConfiguration.es.extensions.push({ extensionIdentifier: { id: 'user.translation' }, version: '1.0.0' });
		oldConfiguration.es.translations['user.translation'] = path.join(root, 'user-translation.json');
		fs.writeFileSync(oldConfiguration.es.translations['user.translation'], '{}');
		fs.writeFileSync(languagePacksPath, JSON.stringify(oldConfiguration));

		const newPackPath = createLanguagePack(root, 'new-pack', '2.0.0');
		expect(ensureBundledSpanishLanguagePackConfigSync('es', userDataPath, newPackPath)).toBe(true);

		const repaired = JSON.parse(fs.readFileSync(languagePacksPath, 'utf8'));
		expect(repaired.fr).toEqual(oldConfiguration.fr);
		expect(repaired.es.extensions.some((extension: { extensionIdentifier: { id: string } }) => extension.extensionIdentifier.id === 'user.translation')).toBe(true);
		expect(repaired.es.extensions.find((extension: { extensionIdentifier: { id: string } }) => extension.extensionIdentifier.id === 'ms-ceintl.vscode-language-pack-es').version).toBe('2.0.0');
		expect(repaired.es.translations.vscode).toBe(path.join(newPackPath, 'translations', 'main.i18n.json'));
	});

	it('does not register the bundled pack when English is explicitly selected', () => {
		const root = createTemporaryDirectory();
		const userDataPath = path.join(root, 'user-data');
		const packPath = createLanguagePack(root, 'pack', '1.0.0');

		expect(ensureBundledSpanishLanguagePackConfigSync('en', userDataPath, packPath)).toBe(false);
		expect(fs.existsSync(path.join(userDataPath, 'languagepacks.json'))).toBe(false);
	});
});

function createTemporaryDirectory(): string {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'rhs-ia-startup-'));
	temporaryDirectories.push(directory);
	return directory;
}

function createLanguagePack(root: string, directoryName: string, version: string): string {
	const extensionPath = path.join(root, directoryName);
	const translationsPath = path.join(extensionPath, 'translations');
	fs.mkdirSync(translationsPath, { recursive: true });
	fs.writeFileSync(path.join(translationsPath, 'main.i18n.json'), '{}');
	fs.writeFileSync(path.join(extensionPath, 'package.json'), JSON.stringify({
		name: 'vscode-language-pack-es',
		publisher: 'ms-ceintl',
		version,
		__metadata: { id: 'test-language-pack' },
		contributes: {
			localizations: [{
				languageId: 'es',
				localizedLanguageName: 'español',
				translations: [{ id: 'vscode', path: './translations/main.i18n.json' }]
			}]
		}
	}));
	return extensionPath;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { parse } from '../../../base/common/jsonc.js';

export const RHS_IA_DEFAULT_LOCALE = 'es';
export const RHS_IA_LEGACY_DATA_FOLDER = '.positron';
export const RHS_IA_LANGUAGE_PACK_EXTENSION_ID = 'ms-ceintl.vscode-language-pack-es';
export const RHS_IA_MIGRATION_VERSION = 1;

export interface IArgvConfig {
	[key: string]: string | string[] | boolean | undefined;
	locale?: string;
	readonly 'disable-lcd-text'?: boolean;
	readonly 'proxy-bypass-list'?: string;
	readonly 'disable-hardware-acceleration'?: boolean;
	readonly 'force-color-profile'?: string;
	readonly 'enable-crash-reporter'?: boolean;
	readonly 'crash-reporter-id'?: string;
	readonly 'enable-proposed-api'?: string[];
	readonly 'log-level'?: string | string[];
	readonly 'disable-chromium-sandbox'?: boolean;
	readonly 'use-inmemory-secretstorage'?: boolean;
	readonly 'enable-rdp-display-tracking'?: boolean;
	readonly 'remote-debugging-port'?: string;
	readonly 'js-flags'?: string;
}

export interface IRhsIaStatePaths {
	readonly dataDirectory: string;
	readonly argvPath: string;
	readonly migrationStatePath: string;
	readonly legacyDataDirectory: string;
	readonly legacyArgvPath: string;
}

export interface ILanguagePackExtensionManifest {
	readonly name: string;
	readonly publisher: string;
	readonly version: string;
	readonly __metadata?: {
		readonly id?: string;
	};
	readonly contributes?: {
		readonly localizations?: readonly {
			readonly languageId?: string;
			readonly languageName?: string;
			readonly localizedLanguageName?: string;
			readonly translations?: readonly {
				readonly id?: string;
				readonly path?: string;
			}[];
		}[];
	};
}

export interface ILanguagePackExtensionReference {
	readonly extensionIdentifier: {
		readonly id: string;
		readonly uuid?: string;
	};
	readonly version: string;
}

export interface ILanguagePackConfiguration {
	hash: string;
	label?: string;
	extensions: ILanguagePackExtensionReference[];
	translations: Record<string, string>;
}

export type ILanguagePacks = Record<string, ILanguagePackConfiguration>;

interface IRhsIaMigrationState {
	readonly version: number;
	readonly legacyDataFolderName: string;
	readonly argvMigrated: boolean;
}

/**
 * Returns the data-folder name used by the application and its source checkout.
 */
export function getRhsIaDataFolderName(dataFolderName: string, isDevelopment: boolean): string {
	return isDevelopment && !dataFolderName.endsWith('-dev') ? `${dataFolderName}-dev` : dataFolderName;
}

export function getRhsIaStatePaths(homeDirectory: string, dataFolderName: string, legacyDataFolderName = RHS_IA_LEGACY_DATA_FOLDER): IRhsIaStatePaths {
	const dataDirectory = path.join(homeDirectory, dataFolderName);
	const legacyDataDirectory = path.join(homeDirectory, legacyDataFolderName);
	return {
		dataDirectory,
		argvPath: path.join(dataDirectory, 'argv.json'),
		migrationStatePath: path.join(dataDirectory, 'migration.json'),
		legacyDataDirectory,
		legacyArgvPath: path.join(legacyDataDirectory, 'argv.json')
	};
}

/**
 * Migrates only the legacy runtime configuration. Extensions, caches, and other
 * shared Positron state remain in place and are intentionally not copied.
 */
export function migrateLegacyPositronStateSync(options: {
	readonly homeDirectory: string;
	readonly dataFolderName: string;
	readonly legacyDataFolderName?: string;
	readonly isPortable: boolean;
}): void {
	if (options.isPortable) {
		return;
	}

	const paths = getRhsIaStatePaths(options.homeDirectory, options.dataFolderName, options.legacyDataFolderName);
	const migrationState = readMigrationStateSync(paths.migrationStatePath);
	if (migrationState?.version === RHS_IA_MIGRATION_VERSION && migrationState.legacyDataFolderName === (options.legacyDataFolderName ?? RHS_IA_LEGACY_DATA_FOLDER)) {
		return;
	}

	try {
		fs.mkdirSync(paths.dataDirectory, { recursive: true });
		let argvMigrated = false;
		if (!fs.existsSync(paths.argvPath)) {
			const legacyArgvConfig = readArgvConfigFileSync(paths.legacyArgvPath);
			if (legacyArgvConfig) {
				if (typeof legacyArgvConfig.locale !== 'string' || legacyArgvConfig.locale.length === 0) {
					legacyArgvConfig.locale = RHS_IA_DEFAULT_LOCALE;
				}
				writeJsonAtomicallySync(paths.argvPath, legacyArgvConfig);
				argvMigrated = true;
			}
		} else {
			const currentArgvConfig = readArgvConfigFileSync(paths.argvPath);
			if (currentArgvConfig && (typeof currentArgvConfig.locale !== 'string' || currentArgvConfig.locale.length === 0)) {
				currentArgvConfig.locale = RHS_IA_DEFAULT_LOCALE;
				writeJsonAtomicallySync(paths.argvPath, currentArgvConfig);
			}
			argvMigrated = true;
		}

		writeJsonAtomicallySync(paths.migrationStatePath, {
			version: RHS_IA_MIGRATION_VERSION,
			legacyDataFolderName: options.legacyDataFolderName ?? RHS_IA_LEGACY_DATA_FOLDER,
			argvMigrated
		});
	} catch (error) {
		console.warn(`Unable to migrate legacy Positron state: ${error}`);
	}
}

export function readOrCreateArgvConfigSync(argvPath: string): IArgvConfig {
	try {
		const argvConfig = parse(fs.readFileSync(argvPath, 'utf8')) as IArgvConfig;
		if (typeof argvConfig.locale !== 'string' || argvConfig.locale.length === 0) {
			argvConfig.locale = RHS_IA_DEFAULT_LOCALE;
			try {
				writeJsonAtomicallySync(argvPath, argvConfig);
			} catch (error) {
				console.warn(`Unable to persist the RHS-IA default locale in ${argvPath} (${error})`);
			}
		}
		return argvConfig;
	} catch (error) {
		if (isFileNotFoundError(error)) {
			return createDefaultArgvConfigSync(argvPath);
		}
		console.warn(`Unable to read argv.json configuration file in ${argvPath}, falling back to the RHS-IA default locale (${error})`);
		return { locale: RHS_IA_DEFAULT_LOCALE };
	}
}

export function createDefaultArgvConfigSync(argvPath: string): IArgvConfig {
	const defaultArgvConfig: IArgvConfig = {
		locale: RHS_IA_DEFAULT_LOCALE,
		'disable-hardware-acceleration': false
	};
	try {
		fs.mkdirSync(path.dirname(argvPath), { recursive: true });
		const defaultArgvConfigContent = [
			'// This configuration file allows you to pass permanent command line arguments to VS Code.',
			'// Only a subset of arguments is currently supported to reduce the likelihood of breaking',
			'// the installation.',
			'//',
			'// PLEASE DO NOT CHANGE WITHOUT UNDERSTANDING THE IMPACT',
			'//',
			'// NOTE: Changing this file requires a restart of VS Code.',
			'{',
			'\t// Use Spanish as the default display language for RHS-IA.',
			'\t"locale": "es",',
			'',
			'\t// Use software rendering instead of hardware accelerated rendering.',
			'\t// This can help in cases where you see rendering issues in VS Code.',
			'\t"disable-hardware-acceleration": false',
			'}'
		];
		fs.writeFileSync(argvPath, defaultArgvConfigContent.join('\n'));
	} catch (error) {
		console.error(`Unable to create argv.json configuration file in ${argvPath}, falling back to defaults (${error})`);
	}
	return defaultArgvConfig;
}

export function getEffectiveUserLocale(cliLocale: string | undefined, argvConfig: IArgvConfig): string | undefined {
	if (cliLocale) {
		return cliLocale.toLowerCase();
	}
	return typeof argvConfig.locale === 'string' ? argvConfig.locale.toLowerCase() : undefined;
}

export function findBundledSpanishLanguagePackExtensionPathSync(candidateDirectories: readonly string[]): string | undefined {
	for (const candidate of candidateDirectories) {
		if (fs.existsSync(path.join(candidate, 'package.json'))) {
			return candidate;
		}
	}
	return undefined;
}

/**
 * Registers or repairs only the bundled Spanish extension inside languagepacks.json.
 * Other languages and extensions in the same file are retained.
 */
export function ensureBundledSpanishLanguagePackConfigSync(userLocale: string, userDataPath: string, extensionPath: string | undefined): boolean {
	if (userLocale !== RHS_IA_DEFAULT_LOCALE && !userLocale.startsWith(`${RHS_IA_DEFAULT_LOCALE}-`)) {
		return false;
	}
	if (!extensionPath) {
		return false;
	}

	const languagePacksPath = path.join(userDataPath, 'languagepacks.json');
	const languagePacks = readLanguagePacksSync(languagePacksPath);
	if (!languagePacks) {
		return false;
	}

	let bundledLanguagePack: ILanguagePackConfiguration;
	try {
		bundledLanguagePack = createBundledSpanishLanguagePackSync(extensionPath);
	} catch (error) {
		console.warn(`Unable to read bundled Spanish language pack: ${error}`);
		return false;
	}

	if (isBundledSpanishLanguagePackValid(languagePacks.es, bundledLanguagePack)) {
		return false;
	}

	const existing = languagePacks.es;
	if (existing?.extensions !== undefined && (!Array.isArray(existing.extensions) || !existing.extensions.every(isExtensionReference))) {
		console.warn(`Unable to repair malformed Spanish language pack configuration in ${languagePacksPath}; preserving it.`);
		return false;
	}
	const extensions = Array.isArray(existing?.extensions) ? existing.extensions.filter(extension => !sameExtension(extension, bundledLanguagePack.extensions[0])) : [];
	extensions.push(bundledLanguagePack.extensions[0]);
	const translations = isStringRecord(existing?.translations) ? { ...existing.translations } : {};
	Object.assign(translations, bundledLanguagePack.translations);
	languagePacks.es = {
		hash: '',
		label: existing?.label ?? bundledLanguagePack.label,
		extensions,
		translations
	};
	languagePacks.es.hash = calculateLanguagePackHash(extensions);

	try {
		fs.mkdirSync(userDataPath, { recursive: true });
		writeJsonAtomicallySync(languagePacksPath, languagePacks);
		return true;
	} catch (error) {
		console.warn(`Unable to write bundled Spanish language pack configuration: ${error}`);
		return false;
	}
}

function createBundledSpanishLanguagePackSync(extensionPath: string): ILanguagePackConfiguration {
	const manifest = JSON.parse(fs.readFileSync(path.join(extensionPath, 'package.json'), 'utf8')) as ILanguagePackExtensionManifest;
	const localization = manifest.contributes?.localizations?.find(candidate => candidate.languageId === RHS_IA_DEFAULT_LOCALE);
	if (!localization?.translations?.length) {
		throw new Error('The bundled extension does not define Spanish translations.');
	}

	const extensionIdentifier = {
		id: `${manifest.publisher}.${manifest.name}`,
		uuid: manifest.__metadata?.id
	};
	const translations: Record<string, string> = {};
	for (const translation of localization.translations) {
		if (!translation.id || !translation.path) {
			continue;
		}
		const translationPath = path.resolve(extensionPath, translation.path);
		if (!fs.existsSync(translationPath)) {
			throw new Error(`Missing Spanish translation file '${translationPath}'.`);
		}
		translations[translation.id] = translationPath;
	}
	if (!translations.vscode) {
		throw new Error('The bundled extension does not define the core vscode translation.');
	}

	const extensionReference = { extensionIdentifier, version: manifest.version };
	return {
		hash: calculateLanguagePackHash([extensionReference]),
		label: localization.localizedLanguageName ?? localization.languageName,
		extensions: [extensionReference],
		translations
	};
}

function isBundledSpanishLanguagePackValid(current: ILanguagePackConfiguration | undefined, bundled: ILanguagePackConfiguration): boolean {
	if (!current || !Array.isArray(current.extensions) || !current.extensions.every(isExtensionReference) || !isStringRecord(current.translations)) {
		return false;
	}
	const bundledExtension = bundled.extensions[0];
	const currentExtension = current.extensions.find(extension => sameExtension(extension, bundledExtension));
	if (!currentExtension || currentExtension.version !== bundledExtension.version) {
		return false;
	}
	for (const [id, translationPath] of Object.entries(bundled.translations)) {
		if (current.translations[id] !== translationPath || !fs.existsSync(translationPath)) {
			return false;
		}
	}
	return current.hash === calculateLanguagePackHash(current.extensions);
}

function sameExtension(left: ILanguagePackExtensionReference, right: ILanguagePackExtensionReference): boolean {
	return left.extensionIdentifier?.id === right.extensionIdentifier.id || Boolean(left.extensionIdentifier?.uuid && right.extensionIdentifier.uuid && left.extensionIdentifier.uuid === right.extensionIdentifier.uuid);
}

function calculateLanguagePackHash(extensions: readonly ILanguagePackExtensionReference[]): string {
	const md5 = createHash('md5');
	for (const extension of extensions) {
		md5.update(extension.extensionIdentifier.uuid || extension.extensionIdentifier.id).update(extension.version);
	}
	return md5.digest('hex');
}

function readArgvConfigFileSync(filePath: string): IArgvConfig | undefined {
	try {
		return parse(fs.readFileSync(filePath, 'utf8')) as IArgvConfig;
	} catch {
		return undefined;
	}
}

function readMigrationStateSync(filePath: string): IRhsIaMigrationState | undefined {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8')) as IRhsIaMigrationState;
	} catch {
		return undefined;
	}
}

function readLanguagePacksSync(filePath: string): ILanguagePacks | undefined {
	try {
		const value: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		return isRecord(value) && !Array.isArray(value) ? value as ILanguagePacks : undefined;
	} catch (error) {
		if (!isFileNotFoundError(error)) {
			console.warn(`Unable to read language pack configuration in ${filePath}: ${error}`);
		}
		return isFileNotFoundError(error) ? {} : undefined;
	}
}

function writeJsonAtomicallySync(filePath: string, value: object): void {
	const temporaryPath = `${filePath}.${process.pid}.tmp`;
	fs.writeFileSync(temporaryPath, `${JSON.stringify(value)}\n`);
	fs.renameSync(temporaryPath, filePath);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isExtensionReference(value: unknown): value is ILanguagePackExtensionReference {
	if (!isRecord(value) || !isRecord(value.extensionIdentifier)) {
		return false;
	}
	return typeof value.extensionIdentifier.id === 'string' && typeof value.version === 'string';
}

function isStringRecord(value: unknown): value is Record<string, string> {
	return isRecord(value) && Object.values(value).every(candidate => typeof candidate === 'string');
}

function isFileNotFoundError(error: unknown): boolean {
	return isRecord(error) && error.code === 'ENOENT';
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import type { IExtensionDefinition } from './builtInExtensions.ts';

const endOfCentralDirectorySignature = 0x06054b50;
const centralDirectorySignature = 0x02014b50;
const localFileSignature = 0x04034b50;
const maximumEndOfCentralDirectorySize = 65_557;
const bundledExtensionsDirectoryName = 'bundled-extensions';
const extensionPackageJsonPath = 'extension/package.json';
const extensionManifestPath = 'extension.vsixmanifest';

interface IExtensionPackageJson {
	name?: string;
	publisher?: string;
	version?: string;
	repository?: string | { url?: string };
}

interface IDiscoveredVsix {
	absolutePath: string;
	relativePath: string;
	platform?: NodeJS.Platform;
}

interface ICachedExtensionDefinition {
	mtimeMs: number;
	size: number;
	definition: IExtensionDefinition;
}

const extensionDefinitionCache = new Map<string, ICachedExtensionDefinition>();

function getPlatformDirectory(platform: NodeJS.Platform): string | undefined {
	switch (platform) {
		case 'darwin':
			return 'mac';
		case 'win32':
			return 'windows';
		default:
			return undefined;
	}
}

function readExactly(fileDescriptor: number, length: number, position: number): Buffer {
	const buffer = Buffer.allocUnsafe(length);
	const bytesRead = fs.readSync(fileDescriptor, buffer, 0, length, position);
	if (bytesRead !== length) {
		throw new Error(`Unexpected end of VSIX while reading ${length} bytes at offset ${position}.`);
	}
	return buffer;
}

function findEndOfCentralDirectory(buffer: Buffer): number {
	for (let offset = buffer.length - 22; offset >= 0; offset--) {
		if (buffer.readUInt32LE(offset) === endOfCentralDirectorySignature) {
			return offset;
		}
	}
	return -1;
}

function readZipEntry(vsixPath: string, entryName: string): Buffer | undefined {
	const fileDescriptor = fs.openSync(vsixPath, 'r');
	try {
		const fileSize = fs.fstatSync(fileDescriptor).size;
		const tailSize = Math.min(fileSize, maximumEndOfCentralDirectorySize);
		const tail = readExactly(fileDescriptor, tailSize, fileSize - tailSize);
		const endOffset = findEndOfCentralDirectory(tail);
		if (endOffset === -1) {
			throw new Error(`'${vsixPath}' is not a valid VSIX archive. If it is stored with Git LFS, run 'git lfs pull'.`);
		}

		const entryCount = tail.readUInt16LE(endOffset + 10);
		const centralDirectoryOffset = tail.readUInt32LE(endOffset + 16);
		let offset = centralDirectoryOffset;

		for (let index = 0; index < entryCount; index++) {
			const header = readExactly(fileDescriptor, 46, offset);
			if (header.readUInt32LE(0) !== centralDirectorySignature) {
				throw new Error(`Invalid central directory in '${vsixPath}'.`);
			}

			const compressionMethod = header.readUInt16LE(10);
			const compressedSize = header.readUInt32LE(20);
			const fileNameLength = header.readUInt16LE(28);
			const extraFieldLength = header.readUInt16LE(30);
			const commentLength = header.readUInt16LE(32);
			const localHeaderOffset = header.readUInt32LE(42);
			const fileName = readExactly(fileDescriptor, fileNameLength, offset + 46).toString('utf8');

			if (fileName === entryName) {
				const localHeader = readExactly(fileDescriptor, 30, localHeaderOffset);
				if (localHeader.readUInt32LE(0) !== localFileSignature) {
					throw new Error(`Invalid local file header for '${entryName}' in '${vsixPath}'.`);
				}
				const localFileNameLength = localHeader.readUInt16LE(26);
				const localExtraFieldLength = localHeader.readUInt16LE(28);
				const dataOffset = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;
				const compressedContents = readExactly(fileDescriptor, compressedSize, dataOffset);

				switch (compressionMethod) {
					case 0:
						return compressedContents;
					case 8:
						return zlib.inflateRawSync(compressedContents);
					default:
						throw new Error(`Unsupported ZIP compression method ${compressionMethod} for '${entryName}' in '${vsixPath}'.`);
				}
			}

			offset += 46 + fileNameLength + extraFieldLength + commentLength;
		}

		return undefined;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}

function calculateSha256(filePath: string): string {
	const hash = crypto.createHash('sha256');
	const fileDescriptor = fs.openSync(filePath, 'r');
	const buffer = Buffer.allocUnsafe(1024 * 1024);
	try {
		let position = 0;
		let bytesRead: number;
		do {
			bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, position);
			if (bytesRead > 0) {
				hash.update(buffer.subarray(0, bytesRead));
				position += bytesRead;
			}
		} while (bytesRead > 0);
	} finally {
		fs.closeSync(fileDescriptor);
	}
	return hash.digest('hex');
}

export function validateRhsIaLanguagePack(product: {
	readonly nameShort?: string;
	readonly defaultLocale?: string;
	readonly builtInExtensions?: readonly {
		readonly name: string;
		readonly version?: string;
		readonly vsix?: string;
		readonly sha256?: string;
	}[];
}, root: string): void {
	if (product.nameShort !== 'RHS-IA' && product.defaultLocale !== 'es') {
		return;
	}

	const languagePack = product.builtInExtensions?.find(extension => extension.name === 'ms-ceintl.vscode-language-pack-es');
	if (!languagePack?.vsix || !languagePack.sha256 || !languagePack.version) {
		throw new Error('RHS-IA must configure the bundled Spanish language pack with a VSIX path, version, and SHA-256 checksum.');
	}

	const vsixPath = path.join(root, languagePack.vsix);
	if (!fs.existsSync(vsixPath)) {
		throw new Error(`The bundled Spanish language pack VSIX does not exist at '${languagePack.vsix}'.`);
	}

	const actualSha256 = calculateSha256(vsixPath);
	if (actualSha256 !== languagePack.sha256) {
		throw new Error(`The bundled Spanish language pack checksum is ${actualSha256}, but product.json declares ${languagePack.sha256}.`);
	}

	const packageJsonContents = readZipEntry(vsixPath, extensionPackageJsonPath);
	if (!packageJsonContents) {
		throw new Error(`The bundled Spanish language pack VSIX does not contain '${extensionPackageJsonPath}'.`);
	}
	const packageJson = JSON.parse(packageJsonContents.toString('utf8')) as IExtensionPackageJson;
	if (packageJson.version !== languagePack.version) {
		throw new Error(`The bundled Spanish language pack version is ${packageJson.version}, but product.json declares ${languagePack.version}.`);
	}
}

function getRepositoryUrl(repository: IExtensionPackageJson['repository']): string {
	if (typeof repository === 'string') {
		return repository;
	}
	return repository?.url ?? '';
}

function getDeclaredTargetPlatform(vsixPath: string): string | undefined {
	const manifest = readZipEntry(vsixPath, extensionManifestPath)?.toString('utf8');
	return manifest?.match(/\bTargetPlatform=["']([^"']+)["']/)?.[1];
}

function validateTargetPlatform(vsix: IDiscoveredVsix, targetPlatform: string | undefined): void {
	if (!targetPlatform) {
		return;
	}

	if (!vsix.platform) {
		throw new Error(`Platform-specific VSIX '${vsix.relativePath}' declares target '${targetPlatform}' but is stored in the universal folder.`);
	}

	const expectedPrefix = vsix.platform === 'darwin' ? 'darwin-' : 'win32-';
	if (!targetPlatform.startsWith(expectedPrefix)) {
		throw new Error(`VSIX '${vsix.relativePath}' declares target '${targetPlatform}', which does not match its platform folder.`);
	}
}

function createExtensionDefinition(vsix: IDiscoveredVsix): IExtensionDefinition {
	const stat = fs.statSync(vsix.absolutePath);
	const cached = extensionDefinitionCache.get(vsix.absolutePath);
	if (cached?.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
		return cached.definition;
	}

	const packageJsonContents = readZipEntry(vsix.absolutePath, extensionPackageJsonPath);
	if (!packageJsonContents) {
		throw new Error(`VSIX '${vsix.relativePath}' does not contain '${extensionPackageJsonPath}'.`);
	}

	let packageJson: IExtensionPackageJson;
	try {
		packageJson = JSON.parse(packageJsonContents.toString('utf8')) as IExtensionPackageJson;
	} catch (error) {
		throw new Error(`VSIX '${vsix.relativePath}' contains an invalid extension package.json: ${error.message}`);
	}

	if (!packageJson.publisher || !packageJson.name || !packageJson.version) {
		throw new Error(`VSIX '${vsix.relativePath}' must declare publisher, name, and version.`);
	}

	validateTargetPlatform(vsix, getDeclaredTargetPlatform(vsix.absolutePath));

	const definition: IExtensionDefinition = {
		name: `${packageJson.publisher}.${packageJson.name}`,
		version: packageJson.version,
		sha256: calculateSha256(vsix.absolutePath),
		repo: getRepositoryUrl(packageJson.repository),
		vsix: vsix.relativePath,
		platforms: vsix.platform ? [vsix.platform] : undefined,
		isBundled: true,
		metadata: {
			publisherDisplayName: packageJson.publisher
		}
	};

	extensionDefinitionCache.set(vsix.absolutePath, { mtimeMs: stat.mtimeMs, size: stat.size, definition });
	return definition;
}

function getVsixFiles(directory: string, root: string, platform?: NodeJS.Platform): IDiscoveredVsix[] {
	if (!fs.existsSync(directory)) {
		return [];
	}

	return fs.readdirSync(directory, { withFileTypes: true })
		.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.vsix'))
		.sort((left, right) => left.name.localeCompare(right.name))
		.map(entry => {
			const absolutePath = path.join(directory, entry.name);
			return {
				absolutePath,
				relativePath: path.relative(root, absolutePath).split(path.sep).join('/'),
				platform
			};
		});
}

export function getBundledExtensionDefinitions(root: string, platform: NodeJS.Platform = process.platform): IExtensionDefinition[] {
	const bundledRoot = path.join(root, bundledExtensionsDirectoryName);
	const vsixFiles = getVsixFiles(bundledRoot, root);
	const platformDirectory = getPlatformDirectory(platform);
	if (platformDirectory) {
		vsixFiles.push(...getVsixFiles(path.join(bundledRoot, platformDirectory), root, platform));
	}

	const definitions = vsixFiles.map(createExtensionDefinition);
	const names = new Map<string, string>();
	for (const definition of definitions) {
		const normalizedName = definition.name.toLowerCase();
		const previousPath = names.get(normalizedName);
		if (previousPath) {
			throw new Error(`Duplicate bundled extension '${definition.name}' in '${previousPath}' and '${definition.vsix}'.`);
		}
		names.set(normalizedName, definition.vsix!);
	}
	return definitions;
}

export function mergeBundledExtensionDefinitions(productExtensions: IExtensionDefinition[], root: string, platform: NodeJS.Platform = process.platform): IExtensionDefinition[] {
	const bundledExtensions = getBundledExtensionDefinitions(root, platform);
	const configuredNames = new Set(productExtensions.map(extension => extension.name.toLowerCase()));
	for (const extension of bundledExtensions) {
		if (configuredNames.has(extension.name.toLowerCase())) {
			throw new Error(`Bundled extension '${extension.name}' is also configured in product.json.`);
		}
	}
	return [...productExtensions, ...bundledExtensions];
}

if (import.meta.main) {
	const root = path.dirname(path.dirname(import.meta.dirname));
	const productJson = JSON.parse(fs.readFileSync(path.join(root, 'product.json'), 'utf8')) as { nameShort?: string; defaultLocale?: string; builtInExtensions?: IExtensionDefinition[] };
	validateRhsIaLanguagePack(productJson, root);
	const platformArgumentIndex = process.argv.indexOf('--platform');
	const platform = platformArgumentIndex === -1 ? process.platform : process.argv[platformArgumentIndex + 1] as NodeJS.Platform | undefined;
	if (!platform) {
		throw new Error(`Missing value for '--platform'.`);
	}
	const definitions = getBundledExtensionDefinitions(root, platform);
	if (definitions.length === 0) {
		console.log(`No bundled extensions apply to platform '${platform}'.`);
	} else {
		for (const definition of definitions) {
			console.log(`${definition.name}@${definition.version}  ${definition.sha256}  ${definition.vsix}`);
		}
	}
}

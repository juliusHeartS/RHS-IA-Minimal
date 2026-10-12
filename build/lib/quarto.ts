/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2024-2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import fancyLog from 'fancy-log';
import { fetchUrl } from './fetch.ts';
import es from 'event-stream';
import { Stream } from 'stream';
import { gulp, gunzip, rename, unzip } from './gulp/facade.ts';
import * as util from './util.ts';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const version = '1.10.18';
const extractionLayoutVersion = 'single-arch-v1';
const releaseBaseUrl = `https://github.com/quarto-dev/quarto-cli/releases/download/v${version}/`;
const defaultCacheDirectory = path.join(path.dirname(path.dirname(import.meta.dirname)), '.build', 'quarto-cache');

interface IQuartoArchive {
	fileName: string;
	sha256: string;
}

const archiveChecksums: Record<string, string> = {
	[`quarto-${version}-win.zip`]: '4e824652ff0da3f646868277582ed59c0872d1456e35350b7d7cdc4243ee18c2',
	[`quarto-${version}-macos.tar.gz`]: 'ddd6a71a9e0448ab15fb655bc589e11cb6589a248ec35ccd7f7f44137531688e',
	[`quarto-${version}-linux-amd64.tar.gz`]: 'afad071b5bd22c02f2d300695743189d3650e0537a53073e654b630cff2b0c73',
	[`quarto-${version}-linux-arm64.tar.gz`]: 'f6a07df68e25330b5df34f65d3df66bca605acce3b830c593a58e91884d4cf6c'
};

const preparedArchives = new Map<string, Promise<void>>();

function getQuartoArchive(platform: string, arch: string): IQuartoArchive {
	let fileName: string;
	if (platform === 'win32') {
		fileName = `quarto-${version}-win.zip`;
	} else if (platform === 'darwin') {
		fileName = `quarto-${version}-macos.tar.gz`;
	} else {
		fileName = `quarto-${version}-linux-${arch === 'x64' ? 'amd64' : 'arm64'}.tar.gz`;
	}

	return { fileName, sha256: archiveChecksums[fileName] };
}

function calculateSha256(filePath: string): string {
	const hash = crypto.createHash('sha256');
	const fileDescriptor = fs.openSync(filePath, 'r');
	const buffer = Buffer.allocUnsafe(1024 * 1024);
	try {
		let bytesRead: number;
		do {
			bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, null);
			if (bytesRead > 0) {
				hash.update(buffer.subarray(0, bytesRead));
			}
		} while (bytesRead > 0);
	} finally {
		fs.closeSync(fileDescriptor);
	}
	return hash.digest('hex');
}

function validateArchive(filePath: string, archive: IQuartoArchive, removeInvalid: boolean = false): boolean {
	if (!fs.existsSync(filePath)) {
		return false;
	}

	const actualSha256 = calculateSha256(filePath);
	if (actualSha256 === archive.sha256) {
		return true;
	}

	if (removeInvalid) {
		fancyLog(`Cached Quarto archive checksum mismatch; removing ${filePath}`);
		fs.rmSync(filePath, { force: true });
	}
	return false;
}

async function downloadQuartoArchive(filePath: string, archive: IQuartoArchive): Promise<void> {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	const temporaryPath = `${filePath}.tmp-${process.pid}`;
	try {
		const file = await fetchUrl(`${releaseBaseUrl}${archive.fileName}`, {
			verbose: true,
			timeoutSeconds: 90,
			checksumSha256: archive.sha256
		}, 3);
		fs.writeFileSync(temporaryPath, file.contents as Buffer);
		fs.renameSync(temporaryPath, filePath);
	} finally {
		fs.rmSync(temporaryPath, { force: true });
	}
}

async function prepareQuartoArchive(platform: string, arch: string): Promise<string> {
	const archive = getQuartoArchive(platform, arch);
	const overridePath = process.env['QUARTO_ARCHIVE'];
	if (overridePath) {
		const resolvedOverridePath = path.resolve(overridePath);
		if (!validateArchive(resolvedOverridePath, archive)) {
			throw new Error(`QUARTO_ARCHIVE does not contain the expected Quarto ${version} archive for ${platform}-${arch}.`);
		}
		fancyLog(`Using Quarto ${version} archive from QUARTO_ARCHIVE: ${resolvedOverridePath}`);
		return resolvedOverridePath;
	}

	const cacheDirectory = process.env['QUARTO_CACHE_DIR'] ? path.resolve(process.env['QUARTO_CACHE_DIR']) : defaultCacheDirectory;
	const cachePath = path.join(cacheDirectory, version, archive.fileName);
	if (validateArchive(cachePath, archive, true)) {
		fancyLog(`Using cached Quarto ${version} archive: ${cachePath}`);
		return cachePath;
	}

	fancyLog(`Quarto ${version} archive not found in cache; downloading ${archive.fileName}...`);
	await downloadQuartoArchive(cachePath, archive);
	return cachePath;
}

export function prepareQuarto(platform: string = process.platform, arch: string = process.arch): Promise<void> {
	const key = `${platform}-${arch}`;
	let preparedArchive = preparedArchives.get(key);
	if (!preparedArchive) {
		preparedArchive = prepareQuartoFiles(platform, arch);
		preparedArchives.set(key, preparedArchive);
	}
	return preparedArchive;
}

function getPreparedArchivePath(platform: string, arch: string): string {
	const archive = getQuartoArchive(platform, arch);
	const overridePath = process.env['QUARTO_ARCHIVE'];
	if (overridePath) {
		return path.resolve(overridePath);
	}
	const cacheDirectory = process.env['QUARTO_CACHE_DIR'] ? path.resolve(process.env['QUARTO_CACHE_DIR']) : defaultCacheDirectory;
	const cachePath = path.join(cacheDirectory, version, archive.fileName);
	if (!fs.existsSync(cachePath)) {
		throw new Error(`Quarto archive is not prepared. Run the prepareQuarto task before packaging.`);
	}
	return cachePath;
}

function getPreparedQuartoPaths(platform: string, arch: string): { extractionPath: string; markerPath: string } {
	const cacheDirectory = process.env['QUARTO_CACHE_DIR'] ? path.resolve(process.env['QUARTO_CACHE_DIR']) : defaultCacheDirectory;
	const versionDirectory = path.join(cacheDirectory, version);
	const target = `${platform}-${arch}`;
	return {
		extractionPath: path.join(versionDirectory, 'extracted', target),
		markerPath: path.join(versionDirectory, `.extracted-${target}.sha256`)
	};
}

function getQuartoStream(platform: string, arch: string): Stream {
	const archivePath = getPreparedArchivePath(platform, arch);
	const archiveStream = gulp.src(archivePath);
	if (platform === 'win32') {
		return archiveStream.pipe(unzip({ keepEmpty: true }));
	}

	let stream: Stream = archiveStream
		.pipe(gunzip())
		.pipe(util.untar());
	if (platform !== 'darwin') {
		stream = stream.pipe(rename(file => {
			if (file.dirname?.startsWith(`quarto-${version}`)) {
				file.dirname = file.dirname.replace(/^quarto-[^/]+\/?/, '');
			}
		}));
	}
	return stream;
}

function getQuartoArchiveContents(platform: string, arch: string): Stream {
	return getQuartoStream(platform, arch)
		// Move the Quarto binaries into a `quarto` subdirectory
		.pipe(rename(f => { f.dirname = path.join('quarto', f.dirname || ''); }))

		// Skip generated files that start with '._'
		.pipe(es.mapSync((f: any) => {
			if (!f.basename.startsWith('._')) {
				return f;
			}
		}))

		// On macOS, filter out the opposite-arch tools directory.
		.pipe(es.mapSync((f: any) => {
			if (platform !== 'darwin') {
				return f;
			}
			const excludedArch = arch === 'arm64' ? 'x86_64' : 'aarch64';
			const normalizedDirectory = f.dirname?.replaceAll('\\', '/');
			if (normalizedDirectory && new RegExp(`(^|/)bin/tools/${excludedArch}(/|$)`).test(normalizedDirectory)) {
				return;
			}
			return f;
		}))

		// Restore the executable bit on the Quarto binaries. (It's very
		// unfortunate that gulp doesn't preserve the executable bit when
		// copying files.)
		.pipe(util.setExecutableBit([
			'**/dart',
			'**/deno',
			'**/esbuild',
			'**/pandoc',
			'**/quarto',
			'**/sass',
			'**/typst'
		]));
}

async function prepareQuartoFiles(platform: string, arch: string): Promise<void> {
	await prepareQuartoArchive(platform, arch);
	const archive = getQuartoArchive(platform, arch);
	const { extractionPath, markerPath } = getPreparedQuartoPaths(platform, arch);
	const marker = fs.existsSync(markerPath) ? fs.readFileSync(markerPath, 'utf8').trim() : undefined;
	const expectedMarker = `${archive.sha256}:${extractionLayoutVersion}:${platform}-${arch}`;
	const oppositeArch = arch === 'arm64' ? 'x86_64' : 'aarch64';
	const containsOppositeDarwinArch = platform === 'darwin' && fs.existsSync(path.join(extractionPath, 'quarto', 'bin', 'tools', oppositeArch));
	if (marker === expectedMarker && fs.existsSync(path.join(extractionPath, 'quarto')) && !containsOppositeDarwinArch) {
		fancyLog(`Using cached Quarto ${version} files for ${platform}-${arch}: ${extractionPath}`);
		return;
	}

	fancyLog(`Extracting Quarto ${version} for ${platform}-${arch} into the local cache...`);
	fs.rmSync(extractionPath, { recursive: true, force: true });
	fs.rmSync(markerPath, { force: true });
	fs.mkdirSync(extractionPath, { recursive: true });
	const stream = getQuartoArchiveContents(platform, arch).pipe(gulp.dest(extractionPath));
	await util.streamToPromise(es.merge([stream]));
	fs.writeFileSync(markerPath, `${expectedMarker}\n`);
}

/**
 * Standalone helper for downloading and unpacking quarto; downloads quarto to
 * the `.build` folder for testing.
 *
 * @returns A promise that resolves when quarto is downloaded and unpacked
 */
export function getQuarto(): Promise<void> {
	return prepareQuarto().then(() => {
		const { extractionPath } = getPreparedQuartoPaths(process.platform, process.arch);
		const quartoPath = path.join(extractionPath, 'quarto');
		const outputPath = path.join('.build', 'quarto');
		fs.rmSync(outputPath, { recursive: true, force: true });
		const stream = gulp.src(['**'], { cwd: quartoPath, base: quartoPath, dot: true })
			.pipe(gulp.dest(outputPath));
		return util.streamToPromise(es.merge([stream]));
	});
}

/**
 * Helper to package the quarto binaries into a `quarto` subdirectory with
 * the executable bit set.
 *
 * @returns A stream that provides the quarto binaries
 */
export function getQuartoBinaries(platform: string = process.platform, arch: string = process.arch): Stream {
	const { extractionPath, markerPath } = getPreparedQuartoPaths(platform, arch);
	if (!fs.existsSync(markerPath) || !fs.existsSync(path.join(extractionPath, 'quarto'))) {
		throw new Error(`Quarto files are not prepared. Run the prepareQuarto task before packaging.`);
	}
	return gulp.src(['**'], { cwd: extractionPath, base: extractionPath, dot: true });
}

if (import.meta.main) {
	getQuarto().then(() => process.exit(0)).catch(err => {
		console.error(err);
		process.exit(1);
	});
}

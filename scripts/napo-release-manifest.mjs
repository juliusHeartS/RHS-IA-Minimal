#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function usage() {
	console.error(`Usage:
  node scripts/napo-release-manifest.mjs --package PATH --out PATH
  node scripts/napo-release-manifest.mjs --package PATH --verify PATH`);
}

function parseArgs(argv) {
	const args = {};
	for (let i = 2; i < argv.length; i++) {
		const value = argv[i];
		if (!value.startsWith('--')) {
			throw new Error(`Unexpected argument: ${value}`);
		}
		const key = value.slice(2);
		const next = argv[i + 1];
		if (!next || next.startsWith('--')) {
			throw new Error(`Missing value for --${key}`);
		}
		args[key] = next;
		i++;
	}
	return args;
}

async function readProduct(packageRoot) {
	const appRoot = path.basename(packageRoot) === 'RHS-IA.app'
		? path.join(packageRoot, 'Contents', 'Resources', 'app')
		: packageRoot;
	const productPath = path.join(appRoot, 'product.json');
	const product = JSON.parse(await fs.readFile(productPath, 'utf8'));
	return { appRoot, product };
}

async function walkFiles(root, current = root, result = []) {
	const entries = await fs.readdir(current, { withFileTypes: true });
	entries.sort((a, b) => a.name.localeCompare(b.name));
	for (const entry of entries) {
		// Capibara's bundled Python runtime may create bytecode caches when the
		// packaged app is opened. They are volatile runtime artifacts, not release
		// inputs, and must not make an otherwise identical package unverifiable.
		if (entry.name === '__pycache__' || (entry.isFile() && entry.name.endsWith('.pyc'))) {
			continue;
		}
		const absolute = path.join(current, entry.name);
		if (entry.isSymbolicLink()) {
			const stat = await fs.lstat(absolute);
			result.push({
				absolute,
				relative: path.relative(root, absolute).split(path.sep).join('/'),
				mode: stat.mode & 0o777,
				size: 0,
				type: 'symlink',
				target: await fs.readlink(absolute),
			});
			continue;
		}
		if (entry.isDirectory()) {
			await walkFiles(root, absolute, result);
			continue;
		}
		if (!entry.isFile()) {
			continue;
		}
		const stat = await fs.stat(absolute);
		const digest = createHash('sha256');
		digest.update(await fs.readFile(absolute));
		result.push({
			absolute,
			relative: path.relative(root, absolute).split(path.sep).join('/'),
			mode: stat.mode & 0o777,
			size: stat.size,
			type: 'file',
			sha256: digest.digest('hex'),
		});
	}
	return result;
}

function treeDigest(entries) {
	const digest = createHash('sha256');
	for (const entry of entries.sort((a, b) => a.relative.localeCompare(b.relative))) {
		digest.update(JSON.stringify({
			mode: entry.mode,
			relative: entry.relative,
			sha256: entry.sha256,
			size: entry.size,
			target: entry.target,
			type: entry.type,
		}) + '\n');
	}
	return digest.digest('hex');
}

async function createManifest(packagePath) {
	const packageRoot = path.resolve(packagePath);
	const { appRoot, product } = await readProduct(packageRoot);
	const entries = await walkFiles(appRoot);
	const files = entries.map(({ absolute, ...entry }) => entry);
	return {
		schemaVersion: 1,
		purpose: 'manual-verifiable-napo-release',
		packageRoot,
		product: {
			applicationName: product.applicationName,
			nameShort: product.nameShort,
			version: product.version,
			commit: product.commit,
			date: product.date,
		},
		fileCount: files.length,
		totalBytes: files.reduce((total, file) => total + file.size, 0),
		treeSha256: treeDigest(files),
		files,
	};
}

async function main() {
	let args;
	try {
		args = parseArgs(process.argv);
	} catch (error) {
		usage();
		throw error;
	}
	if (!args.package || (!args.out && !args.verify) || (args.out && args.verify)) {
		usage();
		process.exitCode = 2;
		return;
	}

	const manifest = await createManifest(args.package);
	if (args.verify) {
		const expected = JSON.parse(await fs.readFile(path.resolve(args.verify), 'utf8'));
		const fields = ['schemaVersion', 'fileCount', 'totalBytes', 'treeSha256'];
		const mismatch = fields.find(field => expected[field] !== manifest[field]);
		if (mismatch) {
			throw new Error(`Napo release manifest mismatch in ${mismatch}: expected ${expected[mismatch]}, got ${manifest[mismatch]}`);
		}
		if (expected.product?.applicationName !== manifest.product.applicationName
			|| expected.product?.nameShort !== manifest.product.nameShort
			|| expected.product?.version !== manifest.product.version
			|| expected.product?.commit !== manifest.product.commit) {
			throw new Error('Napo release manifest product identity or source commit does not match');
		}
		console.log(`OK Napo release manifest verified: ${manifest.treeSha256}`);
		return;
	}

	const output = path.resolve(args.out);
	await fs.mkdir(path.dirname(output), { recursive: true });
	await fs.writeFile(output, JSON.stringify(manifest, null, 2) + '\n');
	console.log(`Napo release manifest written: ${output}`);
	console.log(`Tree SHA-256: ${manifest.treeSha256}`);
}

main().catch(error => {
	console.error(`ERROR ${error instanceof Error ? error.message : String(error)}`);
	process.exitCode = 1;
});

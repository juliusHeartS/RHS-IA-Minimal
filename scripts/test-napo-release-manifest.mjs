#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestScript = join(root, 'scripts', 'napo-release-manifest.mjs');
const testRoot = mkdtempSync(join(tmpdir(), 'napo-release-manifest-'));
	const appRoot = join(testRoot, 'RHS-IA.app', 'Contents', 'Resources', 'app');
const nestedCache = join(appRoot, 'extensions', 'rhs-agent4', 'dist', 'runtime', '__pycache__');
const manifestPath = join(testRoot, 'manifest.json');

function run(args) {
	const result = spawnSync(process.execPath, [manifestScript, ...args], {
		cwd: root,
		encoding: 'utf8',
	});
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(`${result.stdout}${result.stderr}`.trim());
	}
}

try {
	mkdirSync(nestedCache, { recursive: true });
	writeFileSync(join(appRoot, 'product.json'), JSON.stringify({
		applicationName: 'napo',
		nameShort: 'RHS-IA',
		version: 'test',
		commit: 'test',
		date: 'test',
	}) + '\n');
	writeFileSync(join(appRoot, 'stable.txt'), 'release input\n');
	writeFileSync(join(appRoot, 'generated.pyc'), 'volatile root cache\n');
	writeFileSync(join(nestedCache, 'generated.cpython-311.pyc'), 'volatile nested cache\n');

	run(['--package', join(testRoot, 'RHS-IA.app'), '--out', manifestPath]);
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	const paths = new Set(manifest.files.map(file => file.relative));
	if (paths.has('generated.pyc') || paths.has('extensions/rhs-agent4/dist/runtime/__pycache__/generated.cpython-311.pyc')) {
		throw new Error('El manifiesto incluyó un caché Python volátil.');
	}
	if (!paths.has('stable.txt') || !paths.has('product.json')) {
		throw new Error('El manifiesto omitió una entrada estable.');
	}

	// Leave the generated caches in place and verify against the original
	// manifest: a normal runtime write must not invalidate the release proof.
	run(['--package', join(testRoot, 'RHS-IA.app'), '--verify', manifestPath]);
	console.log('OK manifiesto Napo ignora __pycache__ y .pyc volátiles sin omitir entradas estables');
} finally {
	rmSync(testRoot, { recursive: true, force: true });
}

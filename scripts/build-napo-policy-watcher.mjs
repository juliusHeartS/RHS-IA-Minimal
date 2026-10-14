#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const root = join(scriptDirectory, '..');
const moduleDirectory = join(root, 'node_modules', '@vscode', 'policy-watcher');
const nodeGyp = join(root, 'node_modules', 'node-gyp', 'bin', 'node-gyp.js');
const nativeBinary = join(moduleDirectory, 'build', 'Release', 'vscode-policy-watcher.node');

function argumentValue(name, fallback) {
	const index = process.argv.indexOf(name);
	return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const targetPlatform = argumentValue('--platform', process.platform);
const targetArch = argumentValue('--arch', process.arch);
const checkOnly = process.argv.includes('--check');
const quiet = process.argv.includes('--quiet');

function log(message) {
	if (!quiet) {
		console.log(`[Napo] ${message}`);
	}
}

if (targetPlatform !== 'darwin' || targetArch !== 'arm64') {
	log(`policy-watcher nativo omitido para ${targetPlatform}-${targetArch}`);
	process.exit(0);
}

if (checkOnly) {
	if (!existsSync(nativeBinary)) {
		console.error(`[Napo] Falta el binario nativo de policy-watcher: ${nativeBinary}`);
		process.exit(1);
	}
	log('policy-watcher nativo presente');
	process.exit(0);
}

if (!existsSync(moduleDirectory)) {
	console.error(`[Napo] No se encontró @vscode/policy-watcher: ${moduleDirectory}`);
	process.exit(1);
}

if (existsSync(nativeBinary) && process.env.NAPO_FORCE_POLICY_WATCHER_BUILD !== '1') {
	log('policy-watcher nativo ya compilado; se conserva el binario existente');
	process.exit(0);
}

if (!existsSync(nodeGyp)) {
	console.error('[Napo] No se encontró node-gyp. Instala las dependencias de desarrollo antes de empaquetar.');
	process.exit(1);
}

log('compilando policy-watcher nativo para macOS arm64');
const result = spawnSync(process.execPath, [
	nodeGyp,
	'rebuild',
	'--release',
	'--directory',
	moduleDirectory,
], {
	cwd: root,
	stdio: 'inherit',
	env: {
		...process.env,
		npm_config_arch: 'arm64',
	},
});

if (result.error) {
	console.error(`[Napo] No se pudo ejecutar node-gyp: ${result.error.message}`);
	process.exit(1);
}

if (result.status !== 0 || !existsSync(nativeBinary)) {
	console.error('[Napo] La compilación de policy-watcher no produjo el binario esperado.');
	process.exit(result.status || 1);
}

log('policy-watcher nativo compilado correctamente');

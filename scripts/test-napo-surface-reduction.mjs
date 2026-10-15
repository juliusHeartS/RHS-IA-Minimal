#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(process.cwd());
function optionValue(flag) {
	const index = process.argv.indexOf(flag);
	return index === -1 ? null : process.argv[index + 1];
}

const packagePath = path.resolve(optionValue('--package') || path.join(root, 'dist', 'RHS-IA.app'));
const extensionArgumentIndex = process.argv.indexOf('--extensions');
const requested = extensionArgumentIndex === -1
	? []
	: (process.argv[extensionArgumentIndex + 1] || '').split(',').map(value => value.trim()).filter(Boolean);
const reportPath = path.resolve(optionValue('--report') || path.join(root, 'reports', `napo-reduction-test-${requested.join('-') || 'none'}.json`));

function fail(message) {
	console.error(`ERROR: ${message}`);
	process.exitCode = 1;
}

if (requested.length === 0) {
	fail('use --extensions folder[,folder...] para seleccionar una reducción explícita');
	process.exit();
}

const extensionsRoot = path.join(packagePath, 'Contents', 'Resources', 'app', 'extensions');
if (!fs.existsSync(extensionsRoot)) {
	fail(`no existe un paquete macOS válido: ${extensionsRoot}`);
	process.exit();
}

for (const folder of requested) {
	if (!/^[a-zA-Z0-9._-]+$/.test(folder)) {
		fail(`nombre de extensión no permitido: ${folder}`);
		process.exit();
	}
	if (!fs.existsSync(path.join(extensionsRoot, folder))) {
		fail(`la extensión no existe en el paquete: ${folder}`);
		process.exit();
	}
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'napo-reduction-'));
const reducedPackage = path.join(tempRoot, 'RHS-IA.app');
const copy = spawnSync('cp', ['-al', packagePath, reducedPackage], { encoding: 'utf8' });
if (copy.status !== 0) {
	fail(`no se pudo crear el clon por enlaces duros: ${copy.stderr || copy.stdout}`);
	process.exit();
}

const removedRoot = path.join(tempRoot, 'removed-extensions');
fs.mkdirSync(removedRoot);
for (const folder of requested) {
	fs.renameSync(
		path.join(reducedPackage, 'Contents', 'Resources', 'app', 'extensions', folder),
		path.join(removedRoot, folder),
	);
}

function run(command, args) {
	const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
	return {
		command: [command, ...args].join(' '),
		exitCode: result.status,
		signal: result.signal,
		lastOutput: `${result.stdout || ''}${result.stderr || ''}`.split('\n').filter(Boolean).slice(-12),
	};
}

const validation = run(process.execPath, ['scripts/validate-napo.mjs', '--require-runtime', '--package', reducedPackage]);
const smoke = run(process.execPath, ['scripts/smoke-napo-runtime.mjs', '--package', reducedPackage]);
const report = {
	schemaVersion: 1,
	packageUnderTest: packagePath,
	temporaryClone: reducedPackage,
	removedExtensions: requested,
	reversibleArchive: removedRoot,
	validation,
	smoke,
	passed: validation.exitCode === 0 && smoke.exitCode === 0,
	limitations: [
		'La clonación usa enlaces duros y la prueba no demuestra ausencia de contratos dinámicos del host.',
		'La prueba no sustituye una sesión UI completa ni la revisión de licencias.',
		'El clon temporal se conserva para inspección y recuperación; no se modifica el paquete original.',
	],
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Reducción temporal: ${reducedPackage}`);
console.log(`Extensiones retiradas del clon: ${requested.join(', ')}`);
console.log(`Validador: ${validation.exitCode === 0 ? 'PASS' : 'FAIL'}`);
console.log(`Smoke: ${smoke.exitCode === 0 ? 'PASS' : 'FAIL'}`);
console.log(`Reporte: ${path.relative(root, reportPath)}`);
if (!report.passed) process.exitCode = 1;

#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argumentValue(name, required = true) {
	const index = process.argv.indexOf(name);
	const value = index >= 0 ? process.argv[index + 1] : undefined;
	if (required && (!value || value.startsWith('--'))) throw new Error(`Falta el valor de ${name}.`);
	return value;
}

function readProduct(appPath) {
	return JSON.parse(readFileSync(join(appPath, 'Contents', 'Resources', 'app', 'product.json'), 'utf8'));
}

function parseVersion(value) {
	const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(value || '');
	if (!match) throw new Error(`versión Napo no comparable: ${value}`);
	return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), pre: match[4] || null };
}

function compareVersions(left, right) {
	const a = parseVersion(left);
	const b = parseVersion(right);
	for (const key of ['major', 'minor', 'patch']) {
		if (a[key] !== b[key]) return a[key] - b[key];
	}
	if (a.pre === b.pre) return 0;
	if (a.pre === null) return 1;
	if (b.pre === null) return -1;
	return a.pre.localeCompare(b.pre);
}

function run(command, args) {
	const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
	return { ok: result.status === 0 && !result.error, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

const candidatePath = resolve(argumentValue('--candidate'));
const currentPath = argumentValue('--current', false) ? resolve(argumentValue('--current', false)) : undefined;
const manifestPath = resolve(argumentValue('--manifest'));
const outputPath = argumentValue('--out', false) ? resolve(argumentValue('--out', false)) : undefined;
const requireDistribution = process.argv.includes('--require-distribution');
const manifestScript = join(root, 'scripts', 'napo-release-manifest.mjs');
const signatureScript = join(root, 'scripts', 'audit-napo-macos-signature.mjs');

if (!existsSync(candidatePath)) throw new Error(`No existe el candidato: ${candidatePath}`);
if (!existsSync(manifestPath)) throw new Error(`No existe el manifiesto: ${manifestPath}`);

const candidate = readProduct(candidatePath);
const expectedManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const checks = [];
function check(name, ok, detail) {
	checks.push({ name, status: ok ? 'pass' : 'fail', detail });
}

check('identidad', candidate.applicationName === 'napo' && candidate.nameShort === 'Napo', 'applicationName/nameShort deben ser napo/Napo');
check('telemetría', candidate.enableTelemetry === false, 'enableTelemetry debe ser false');
check('endpoints automáticos', !candidate.updateUrl && !candidate.downloadUrl && candidate.positronLlmsDocsUrl === '', 'updateUrl, downloadUrl y positronLlmsDocsUrl deben estar vacíos');

const candidateAppRoot = join(candidatePath, 'Contents', 'Resources', 'app');
const candidateCapibaraManifestPath = join(candidateAppRoot, 'extensions', 'rhs-agent4', 'package.json');
const candidateCapibaraRuntimePath = join(candidateAppRoot, 'extensions', 'rhs-agent4', 'dist', 'extension.js');
const candidateQuartoPath = join(candidateAppRoot, 'quarto', 'bin', 'quarto');
let candidateCapibara;
if (existsSync(candidateCapibaraManifestPath)) {
	try { candidateCapibara = JSON.parse(readFileSync(candidateCapibaraManifestPath, 'utf8')); } catch { /* structural check below reports the failure */ }
}
check(
	'Capibara completa en candidato',
	candidateCapibara?.name === 'rhs-agent4'
		&& candidateCapibara.version === '4.0.0'
		&& candidateCapibara.main === './dist/extension.js'
		&& existsSync(candidateCapibaraRuntimePath),
	'el candidato debe contener rhs-agent4 4.0.0, su entrypoint y el runtime de Capibara',
);
check('Quarto incluido en candidato', existsSync(candidateQuartoPath), 'el candidato debe incluir quarto/bin/quarto');

let current;
if (currentPath) {
	current = readProduct(currentPath);
	let newer = false;
	try { newer = compareVersions(candidate.version, current.version) > 0; } catch (error) { checks.push({ name: 'versión', status: 'fail', detail: error.message }); }
	check('versión posterior', newer, `${candidate.version} debe ser posterior a ${current.version}`);
}

const manifestCheck = run(process.execPath, [manifestScript, '--package', candidatePath, '--verify', manifestPath]);
check('manifiesto y digest', manifestCheck.ok, manifestCheck.ok ? 'el manifiesto coincide con el árbol del candidato' : manifestCheck.output.trim());
if (manifestCheck.ok) {
	check('identidad del manifiesto', expectedManifest.product?.applicationName === 'napo' && expectedManifest.product?.nameShort === 'Napo', 'el manifiesto debe identificar Napo');
	check('versión del manifiesto', expectedManifest.product?.version === candidate.version, 'la versión del manifiesto debe coincidir con product.json');
	check('árbol verificable', expectedManifest.fileCount > 0 && Boolean(expectedManifest.treeSha256), 'el manifiesto debe contener archivos y digest');
}

if (requireDistribution) {
	const signatureCheck = run(process.execPath, [signatureScript, '--package', candidatePath, '--require-distribution']);
	check('firma de distribución', signatureCheck.ok, signatureCheck.ok ? 'codesign/spctl pasan' : signatureCheck.output.trim());
}

const failures = checks.filter(item => item.status === 'fail');
const report = {
	schemaVersion: 1,
	format: 'napo-update-candidate-verification/v1',
	candidate: candidatePath,
	current: currentPath ?? null,
	manifest: manifestPath,
	requireDistribution,
	status: failures.length === 0 ? 'pass' : 'fail',
	checks,
	policy: 'offline, manual, explícita, verificable y reversible; no descarga ni instala',
	limitations: [
		'La herramienta verifica el candidato y no realiza la instalación ni reemplaza el paquete activo.',
		'La publicación requiere además revisión legal, firma/notarización y un canal operado explícitamente.',
	],
};
if (outputPath) writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Candidato Napo: ${report.status}`);
for (const item of checks) console.log(`${item.status === 'pass' ? 'OK' : 'FAIL'} ${item.name}: ${item.detail}`);
if (outputPath) console.log(`Reporte: ${outputPath}`);
if (failures.length > 0) process.exitCode = 1;

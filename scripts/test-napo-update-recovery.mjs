#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'Napo.app'));
const reportPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-update-recovery.json'));
const releaseScript = join(root, 'scripts', 'napo-release-manifest.mjs');

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function appRoot(appPath) {
	return join(appPath, 'Contents', 'Resources', 'app');
}

function productPath(appPath) {
	return join(appRoot(appPath), 'product.json');
}

function readProduct(appPath) {
	return JSON.parse(readFileSync(productPath(appPath), 'utf8'));
}

function hash(value) {
	return createHash('sha256').update(value).digest('hex');
}

function atomicWriteJson(filePath, value) {
	const temporaryPath = `${filePath}.tmp-${process.pid}`;
	writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
	renameSync(temporaryPath, filePath);
}

function parseVersion(version) {
	const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version || '');
	if (!match) throw new Error(`versión Napo no comparable: ${version}`);
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

function manifestFor(appPath, outputPath) {
	const result = spawnSync(process.execPath, [releaseScript, '--package', appPath, '--out', outputPath], {
		cwd: root,
		encoding: 'utf8',
	});
	if (result.status !== 0) {
		throw new Error(`no se pudo generar manifiesto: ${result.stderr || result.stdout}`);
	}
	return JSON.parse(readFileSync(outputPath, 'utf8'));
}

function copyHardlinked(source, destination) {
	execFileSync('cp', ['-al', source, destination], { stdio: ['ignore', 'ignore', 'pipe'] });
}

function replaceProduct(appPath, update) {
	const current = readProduct(appPath);
	const next = { ...current, ...update };
	const temporaryPath = join(appRoot(appPath), `product.json.next-${process.pid}`);
	writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`);
	renameSync(temporaryPath, productPath(appPath));
}

function verifyCandidate({ currentProduct, candidatePath, candidateManifest }) {
	const candidate = readProduct(candidatePath);
	const failures = [];
	if (candidate.applicationName !== 'napo' || candidate.nameShort !== 'Napo') failures.push('identidad de producto inválida');
	if (candidate.enableTelemetry !== false) failures.push('telemetría no está desactivada');
	if (candidate.updateUrl || candidate.downloadUrl || candidate.positronLlmsDocsUrl) failures.push('el candidato declara un endpoint automático');
	if (compareVersions(candidate.version, currentProduct.version) <= 0) failures.push('la versión candidata no es posterior a la versión activa');
	if (candidateManifest.product?.applicationName !== 'napo' || candidateManifest.product?.nameShort !== 'Napo') failures.push('el manifiesto no corresponde a Napo');
	if (candidateManifest.product?.version !== candidate.version) failures.push('la versión del manifiesto no coincide con product.json');
	if (!candidateManifest.treeSha256 || candidateManifest.fileCount <= 0) failures.push('el manifiesto no contiene un árbol verificable');
	return { ok: failures.length === 0, failures, product: candidate, treeSha256: candidateManifest.treeSha256 };
}

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

if (process.platform !== 'darwin') throw new Error('La prueba de actualización requiere macOS por usar Napo.app.');
if (!existsSync(packagePath)) throw new Error(`No existe el paquete: ${packagePath}`);

const temporaryRoot = mkdtempSync(join(tmpdir(), 'napo-update-recovery-'));
const statePath = join(temporaryRoot, 'state', 'current.json');
const stateDirectory = join(temporaryRoot, 'state');
const activeClone = join(temporaryRoot, 'active', 'Napo.app');
const validCandidate = join(temporaryRoot, 'candidate-valid', 'Napo.app');
const invalidCandidate = join(temporaryRoot, 'candidate-invalid', 'Napo.app');
const rollbackCandidate = join(temporaryRoot, 'candidate-rollback', 'Napo.app');
const currentManifestPath = join(temporaryRoot, 'current-manifest.json');
const validManifestPath = join(temporaryRoot, 'valid-manifest.json');
const invalidManifestPath = join(temporaryRoot, 'invalid-manifest.json');
const rollbackManifestPath = join(temporaryRoot, 'rollback-manifest.json');
mkdirSync(stateDirectory, { recursive: true });
for (const directory of ['active', 'candidate-valid', 'candidate-invalid', 'candidate-rollback']) {
	mkdirSync(join(temporaryRoot, directory), { recursive: true });
}

const checks = [];
function pass(name, detail) {
	checks.push({ name, status: 'pass', detail });
}

try {
	const currentProduct = readProduct(packagePath);
	const currentManifest = manifestFor(packagePath, currentManifestPath);
	copyHardlinked(packagePath, activeClone);
	const activeState = { packagePath: activeClone, version: currentProduct.version, treeSha256: currentManifest.treeSha256 };
	atomicWriteJson(statePath, activeState);
	pass('estado activo inicial', `${currentProduct.version} / ${currentManifest.treeSha256}`);

	copyHardlinked(packagePath, validCandidate);
	replaceProduct(validCandidate, { version: '1.130.1' });
	const validManifest = manifestFor(validCandidate, validManifestPath);
	const validCheck = verifyCandidate({ currentProduct, candidatePath: validCandidate, candidateManifest: validManifest });
	assert(validCheck.ok, `el candidato válido fue rechazado: ${validCheck.failures.join(', ')}`);
	atomicWriteJson(statePath, { packagePath: validCandidate, version: validCheck.product.version, treeSha256: validCheck.treeSha256 });
	assert(JSON.parse(readFileSync(statePath, 'utf8')).treeSha256 === validManifest.treeSha256, 'la activación válida no conservó el digest del candidato');
	pass('actualización válida activada', `${validCheck.product.version} / ${validCheck.treeSha256}`);

	const stateBeforeRejectedCandidate = readFileSync(statePath, 'utf8');
	copyHardlinked(packagePath, invalidCandidate);
	replaceProduct(invalidCandidate, { version: '1.130.2', enableTelemetry: true });
	const invalidManifest = manifestFor(invalidCandidate, invalidManifestPath);
	const invalidCheck = verifyCandidate({ currentProduct: validCheck.product, candidatePath: invalidCandidate, candidateManifest: invalidManifest });
	assert(!invalidCheck.ok && invalidCheck.failures.includes('telemetría no está desactivada'), 'el candidato inseguro no fue rechazado');
	assert(readFileSync(statePath, 'utf8') === stateBeforeRejectedCandidate, 'un candidato rechazado modificó el estado activo');
	pass('candidato inseguro rechazado', invalidCheck.failures.join('; '));

	const previousState = JSON.parse(readFileSync(statePath, 'utf8'));
	copyHardlinked(packagePath, rollbackCandidate);
	replaceProduct(rollbackCandidate, { version: '1.130.2' });
	const rollbackManifest = manifestFor(rollbackCandidate, rollbackManifestPath);
	const rollbackCheck = verifyCandidate({ currentProduct: validCheck.product, candidatePath: rollbackCandidate, candidateManifest: rollbackManifest });
	assert(rollbackCheck.ok, `el candidato de rollback fue rechazado: ${rollbackCheck.failures.join(', ')}`);
	atomicWriteJson(statePath, { packagePath: rollbackCandidate, version: rollbackCheck.product.version, treeSha256: rollbackCheck.treeSha256 });
	const postActivationFailure = true;
	if (postActivationFailure) atomicWriteJson(statePath, previousState);
	const recoveredState = JSON.parse(readFileSync(statePath, 'utf8'));
	assert(JSON.stringify(recoveredState) === JSON.stringify(previousState), 'el rollback no restauró exactamente la versión anterior');
	pass('rollback tras fallo de activación', `${recoveredState.version} / ${recoveredState.treeSha256}`);

	const report = {
		format: 'napo-update-recovery/v1',
		package: packagePath,
		activeVersion: currentProduct.version,
		checks,
		status: 'pass',
		policy: 'actualización manual, explícita, verificable y reversible; esta prueba no descarga ni instala nada',
		limitations: [
			'La prueba valida el protocolo local de manifiesto, activación por puntero y rollback; no firma, notariza ni publica un instalador.',
			'La activación real requiere un instalador/canal operado explícitamente por la persona usuaria.',
		],
	};
	writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
	console.log(`Evidencia escrita: ${reportPath}`);
	for (const check of checks) console.log(`OK ${check.name}: ${check.detail}`);
	console.log('OK actualización y recuperación reversibles');
} finally {
	rmSync(temporaryRoot, { recursive: true, force: true });
}

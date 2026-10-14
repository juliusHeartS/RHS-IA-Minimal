#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifestScript = join(root, 'scripts', 'napo-release-manifest.mjs');
const verifierScript = join(root, 'scripts', 'verify-napo-update-candidate.mjs');
const testRoot = mkdtempSync(join(tmpdir(), 'napo-update-candidate-'));

function appPath(name) { return join(testRoot, name, 'Napo.app'); }
function writeProduct(app, product) {
	const appRoot = join(app, 'Contents', 'Resources', 'app');
	mkdirSync(appRoot, { recursive: true });
	writeFileSync(join(appRoot, 'product.json'), `${JSON.stringify(product, null, 2)}\n`);
	writeFileSync(join(appRoot, 'stable.txt'), 'candidate release input\n');
	const capibaraRoot = join(appRoot, 'extensions', 'rhs-agent4', 'dist');
	mkdirSync(capibaraRoot, { recursive: true });
	writeFileSync(join(capibaraRoot, '..', 'package.json'), `${JSON.stringify({ name: 'rhs-agent4', version: '4.0.0', main: './dist/extension.js' })}\n`);
	writeFileSync(join(capibaraRoot, 'extension.js'), 'capibara candidate runtime\n');
	const quartoRoot = join(appRoot, 'quarto', 'bin');
	mkdirSync(quartoRoot, { recursive: true });
	writeFileSync(join(quartoRoot, 'quarto'), 'quarto candidate runtime\n');
}
function run(command, args) {
	return spawnSync(process.execPath, [command, ...args], { cwd: root, encoding: 'utf8' });
}
function assert(condition, message) { if (!condition) throw new Error(message); }

try {
	const current = appPath('current');
	const candidate = appPath('candidate');
	const insecure = appPath('insecure');
	const currentProduct = { applicationName: 'napo', nameShort: 'Napo', version: '1.0.0', commit: 'current', date: 'test', enableTelemetry: false, updateUrl: '', downloadUrl: '', positronLlmsDocsUrl: '' };
	const candidateProduct = { ...currentProduct, version: '1.1.0', commit: 'candidate' };
	writeProduct(current, currentProduct);
	writeProduct(candidate, candidateProduct);
	const candidateManifest = join(testRoot, 'candidate.json');
	let result = run(manifestScript, ['--package', candidate, '--out', candidateManifest]);
	assert(result.status === 0, result.stderr || result.stdout);
	const validReport = join(testRoot, 'valid-report.json');
	result = run(verifierScript, ['--current', current, '--candidate', candidate, '--manifest', candidateManifest, '--out', validReport]);
	assert(result.status === 0, result.stderr || result.stdout);
	assert(JSON.parse(readFileSync(validReport, 'utf8')).status === 'pass', 'el candidato válido no pasó');

	writeProduct(insecure, { ...candidateProduct, version: '1.2.0', enableTelemetry: true });
	const insecureManifest = join(testRoot, 'insecure.json');
	result = run(manifestScript, ['--package', insecure, '--out', insecureManifest]);
	assert(result.status === 0, result.stderr || result.stdout);
	const insecureReport = join(testRoot, 'insecure-report.json');
	result = run(verifierScript, ['--current', candidate, '--candidate', insecure, '--manifest', insecureManifest, '--out', insecureReport]);
	assert(result.status !== 0, 'el candidato con telemetría fue aceptado');
	const report = JSON.parse(readFileSync(insecureReport, 'utf8'));
	assert(report.status === 'fail' && report.checks.some(check => check.name === 'telemetría' && check.status === 'fail'), 'no quedó documentado el rechazo por telemetría');

	const incomplete = appPath('incomplete');
	writeProduct(incomplete, { ...candidateProduct, version: '1.3.0' });
	rmSync(join(incomplete, 'Contents', 'Resources', 'app', 'extensions'), { recursive: true, force: true });
	rmSync(join(incomplete, 'Contents', 'Resources', 'app', 'quarto'), { recursive: true, force: true });
	const incompleteManifest = join(testRoot, 'incomplete.json');
	result = run(manifestScript, ['--package', incomplete, '--out', incompleteManifest]);
	assert(result.status === 0, result.stderr || result.stdout);
	const incompleteReport = join(testRoot, 'incomplete-report.json');
	result = run(verifierScript, ['--current', candidate, '--candidate', incomplete, '--manifest', incompleteManifest, '--out', incompleteReport]);
	assert(result.status !== 0, 'el candidato sin Capibara/Quarto fue aceptado');
	const incompleteVerification = JSON.parse(readFileSync(incompleteReport, 'utf8'));
	assert(incompleteVerification.checks.some(check => check.name === 'Capibara completa en candidato' && check.status === 'fail'), 'no quedó documentada la ausencia de Capibara');

	console.log('OK verificador offline de candidato: acepta válido y rechaza telemetría y estructura incompleta');
} finally {
	rmSync(testRoot, { recursive: true, force: true });
}

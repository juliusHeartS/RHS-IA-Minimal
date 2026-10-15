#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	if (index < 0) return undefined;
	const value = process.argv[index + 1];
	if (!value || value.startsWith('--')) throw new Error(`Falta el valor de ${name}.`);
	return value;
}

function run(script, args) {
	const result = spawnSync(process.execPath, [join(root, 'scripts', script), ...args], {
		cwd: root,
		encoding: 'utf8',
	});
	return { status: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function writeJson(path, value) {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'RHS-IA.app'));
const inventoryPath = join(root, 'reports', 'napo-license-inventory-package.json');
const releasePath = join(root, 'reports', 'napo-release-manifest.json');
const release = JSON.parse(readFileSync(releasePath, 'utf8'));
const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
const temporaryRoot = mkdtempSync(join(tmpdir(), 'napo-license-decisions-'));
const decisionsPath = join(temporaryRoot, 'decisions.json');
const packetPath = join(temporaryRoot, 'packet.json');
const inventoryOutputPath = join(temporaryRoot, 'inventory.json');

try {
	const cases = inventory.unresolved.map((item) => ({
		caseId: `${inventory.root}:${item.path}`,
		path: item.path,
	}));
	const registry = {
		schemaVersion: 1,
		format: 'napo-license-decisions/v1',
		product: 'RHS-IA',
		release: { version: release.product.version, treeSha256: release.treeSha256 },
		decisions: {},
	};

	writeJson(decisionsPath, registry);
	let result = run('audit-napo-license-review-packet.mjs', [
		'--package', packagePath, '--inventory', inventoryPath, '--release', releasePath,
		'--decisions', decisionsPath, '--out', packetPath,
	]);
	assert(result.status === 0, `el registro vacío no fue aceptado:\n${result.output}`);
	let packet = JSON.parse(readFileSync(packetPath, 'utf8'));
	assert(packet.summary.pendingCases === cases.length && packet.summary.approvedCases === 0, 'el registro vacío no conservó los pendientes');
	console.log(`OK registro vacío conserva ${cases.length} casos pendientes`);

	const oneCase = cases[0];
	registry.decisions[oneCase.caseId] = {
		decision: 'approved',
		reviewer: 'fixture-reviewer',
		reviewedAt: '2026-10-13T00:00:00Z',
		basis: 'fixture de prueba; no es una aprobación legal real',
		notes: 'prueba aislada',
	};
	writeJson(decisionsPath, registry);
	result = run('audit-napo-license-review-packet.mjs', [
		'--package', packagePath, '--inventory', inventoryPath, '--release', releasePath,
		'--decisions', decisionsPath, '--out', packetPath,
	]);
	assert(result.status === 0, `la revisión parcial no fue aceptada:\n${result.output}`);
	packet = JSON.parse(readFileSync(packetPath, 'utf8'));
	assert(packet.summary.pendingCases === cases.length - 1 && packet.summary.approvedCases === 1, 'la revisión parcial no se conservó');
	console.log('OK revisión parcial conserva la decisión lateral y el digest');

	result = run('audit-napo-license-review-packet.mjs', [
		'--package', packagePath, '--inventory', inventoryPath, '--release', releasePath,
		'--decisions', decisionsPath, '--out', packetPath, '--require-approved',
	]);
	assert(result.status !== 0, 'la distribución incompleta fue aceptada por error');
	console.log('OK distribución incompleta rechazada');

	for (const item of cases) {
		registry.decisions[item.caseId] = {
			decision: 'approved',
			reviewer: 'fixture-reviewer',
			reviewedAt: '2026-10-13T00:00:00Z',
			basis: 'fixture de prueba; no es una aprobación legal real',
			notes: 'prueba aislada',
		};
	}
	writeJson(decisionsPath, registry);
	result = run('audit-napo-license-inventory.mjs', [
		'--package', packagePath, '--out', inventoryOutputPath, '--decisions', decisionsPath,
		'--release', releasePath, '--require-human-review',
	]);
	assert(result.status === 0, `el inventario completamente revisado no fue aceptado:\n${result.output}`);
	result = run('audit-napo-license-review-packet.mjs', [
		'--package', packagePath, '--inventory', inventoryPath, '--release', releasePath,
		'--decisions', decisionsPath, '--out', packetPath, '--require-approved',
	]);
	assert(result.status === 0, `el expediente completamente revisado no fue aceptado:\n${result.output}`);
	console.log('OK revisión completa aceptada solo con decisiones explícitas');

	registry.release.treeSha256 = 'stale-release-for-test';
	writeJson(decisionsPath, registry);
	result = run('audit-napo-license-review-packet.mjs', [
		'--package', packagePath, '--inventory', inventoryPath, '--release', releasePath,
		'--decisions', decisionsPath, '--out', packetPath,
	]);
	assert(result.status !== 0, 'el registro de otro release fue aceptado por error');
	console.log('OK registro ligado a otro digest rechazado');
} finally {
	rmSync(temporaryRoot, { recursive: true, force: true });
}


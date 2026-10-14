#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const defaultBaseline = resolve(root, 'reports', 'napo-source-readonly-baseline.json');
const baselinePath = resolve(argumentValue('--baseline') || defaultBaseline);
const mode = process.argv.includes('--record') ? 'record' : 'verify';

const sources = [
	['RHS-IA', resolve(root, '..', 'RHS-IA')],
	['positron', resolve(root, '..', 'positron')],
	['rhs-agent3', resolve(root, '..', 'rhs-agent3')],
	['rhs-agent4', resolve(root, '..', 'rhs-agent4')],
	['vscode', resolve(root, '..', 'vscode')],
];

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function git(sourcePath, args) {
	try {
		return execFileSync('git', ['-C', sourcePath, ...args], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe'],
		});
	} catch (error) {
		const detail = error?.stderr?.toString().trim() || error?.message || 'git command failed';
		return `ERROR: ${detail}`;
	}
}

function digest(value) {
	return createHash('sha256').update(value).digest('hex');
}

function snapshot([name, sourcePath]) {
	if (!existsSync(sourcePath)) {
		throw new Error(`${name}: no existe la fuente ${sourcePath}`);
	}

	const head = git(sourcePath, ['rev-parse', '--verify', 'HEAD']).trim();
	const status = git(sourcePath, ['status', '--porcelain=v1', '--untracked-files=normal']);
	const trackedDiff = git(sourcePath, ['diff', '--name-status', '--no-ext-diff']);
	return {
		name,
		path: sourcePath,
		head: head.startsWith('ERROR:') ? null : head,
		statusDigest: digest(status),
		statusLineCount: status ? status.split('\n').filter(Boolean).length : 0,
		trackedDiffDigest: digest(trackedDiff),
		trackedDiffLineCount: trackedDiff ? trackedDiff.split('\n').filter(Boolean).length : 0,
		status,
	};
}

const current = sources.map(snapshot);
const report = {
	schemaVersion: 1,
	purpose: 'napo-source-readonly-guard',
	generatedAt: 'deterministic',
	mode,
	policy: 'las fuentes se leen y no se escriben; el baseline conserva cambios preexistentes documentados',
	sources: current.map(({ status, ...source }) => source),
};

if (mode === 'record') {
	report.sources = current;
	mkdirSync(dirname(baselinePath), { recursive: true });
	writeFileSync(baselinePath, `${JSON.stringify(report, null, 2)}\n`);
	console.log(`Baseline de solo lectura escrito: ${baselinePath}`);
	for (const source of current) {
		console.log(`OK ${source.name}: HEAD=${source.head || 'no resoluble'}, estado=${source.statusLineCount} líneas, digest=${source.statusDigest}`);
	}
	process.exit(0);
}

if (!existsSync(baselinePath)) {
	throw new Error(`No existe el baseline de solo lectura: ${baselinePath}. Ejecute --record después de revisar el estado de las fuentes.`);
}

const expected = JSON.parse(readFileSync(baselinePath, 'utf8'));
const expectedByName = new Map((expected.sources || []).map(source => [source.name, source]));
let failed = false;
for (const source of current) {
	const baseline = expectedByName.get(source.name);
	const mismatch = !baseline
		|| baseline.path !== source.path
		|| baseline.head !== source.head
		|| baseline.statusDigest !== source.statusDigest
		|| baseline.trackedDiffDigest !== source.trackedDiffDigest;
	if (mismatch) {
		failed = true;
		console.error(`FAIL ${source.name}: el estado de solo lectura difiere del baseline ${baselinePath}`);
		console.error(`  esperado: HEAD=${baseline?.head || 'ausente'}, status=${baseline?.statusDigest || 'ausente'}, diff=${baseline?.trackedDiffDigest || 'ausente'}`);
		console.error(`  actual:    HEAD=${source.head || 'ausente'}, status=${source.statusDigest}, diff=${source.trackedDiffDigest}`);
	} else {
		console.log(`OK ${source.name}: estado de fuente sin cambios desde el baseline`);
	}
}

if (expected.sources?.length !== current.length) {
	failed = true;
	console.error(`FAIL el baseline registra ${expected.sources?.length || 0} fuentes y el inventario actual ${current.length}`);
}

if (failed) {
	console.error('La puerta de solo lectura falló; no se actualizará el baseline automáticamente.');
	process.exit(1);
}

console.log('OK repositorios fuente conservan exactamente el estado observado en el baseline');

#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
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

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'Napo.app'));
const auditScript = join(root, 'scripts', 'audit-napo-macos-signature.mjs');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'napo-signature-test-'));
const reportPath = join(temporaryRoot, 'signature.json');

try {
	const result = spawnSync(process.execPath, [auditScript, '--package', packagePath, '--out', reportPath], {
		cwd: root,
		encoding: 'utf8',
	});
	if (result.error) throw result.error;
	if (result.status !== 0) throw new Error(`${result.stdout ?? ''}${result.stderr ?? ''}`.trim());

	const report = JSON.parse(readFileSync(reportPath, 'utf8'));
	if (!['development-only', 'distribution-ready'].includes(report.status)) {
		throw new Error(`estado de firma inesperado: ${report.status}`);
	}
	const manualUnsigned = report.status === 'development-only' && report.unsigned === true && report.signature === 'unsigned';
	if (!manualUnsigned && (report.signature === 'unknown' || report.teamIdentifier === 'unknown')) {
		throw new Error('la auditoría no identificó la firma o el TeamIdentifier');
	}

	console.log(`OK auditoría de firma conserva evidencia precisa: ${report.signature} / ${report.teamIdentifier}`);
} finally {
	rmSync(temporaryRoot, { recursive: true, force: true });
}


#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputPath = resolve(process.argv.includes('--out')
	? process.argv[process.argv.indexOf('--out') + 1]
	: join(root, 'reports', 'napo-positron-typecheck.json'));
const tscPath = join(root, 'node_modules', '.bin', 'tsc');

if (!existsSync(tscPath)) {
	throw new Error(`No existe el compilador TypeScript del destino: ${tscPath}`);
}

const result = spawnSync(tscPath, [
	'--noEmit',
	'-p',
	'vitest.tsconfig.json',
	'--skipLibCheck',
	'--pretty',
	'false',
], {
	cwd: root,
	encoding: 'utf8',
});

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const diagnostics = [];
const diagnosticPattern = /^(.*)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
for (const line of output.split(/\r?\n/)) {
	const match = line.match(diagnosticPattern);
	if (!match) {
		continue;
	}
	const file = isAbsolute(match[1]) ? relative(root, match[1]) : match[1];
	diagnostics.push({
		file: file.split('\\').join('/'),
		line: Number(match[2]),
		column: Number(match[3]),
		code: match[4],
		message: match[5],
	});
}

function gitFiles(args) {
	const gitResult = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
	if (gitResult.status !== 0) {
		throw new Error(`No se pudo obtener el conjunto de cambios del destino: ${gitResult.stderr ?? ''}`);
	}
	return gitResult.stdout.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

const changedFiles = new Set([
	...gitFiles(['diff', '--name-only']),
	...gitFiles(['diff', '--cached', '--name-only']),
	...gitFiles(['ls-files', '--others', '--exclude-standard']),
]);
const diagnosticFiles = [...new Set(diagnostics.map(item => item.file))];
const changedFileOverlap = diagnosticFiles.filter(file => changedFiles.has(file));
const status = result.error
	? 'environment-failure'
	: diagnostics.length === 0
		? 'pass'
		: changedFileOverlap.length === 0
			? 'upstream-debt'
			: 'fail';

const diagnosticsByCode = {};
for (const diagnostic of diagnostics) {
	diagnosticsByCode[diagnostic.code] = (diagnosticsByCode[diagnostic.code] ?? 0) + 1;
}

const report = {
	schemaVersion: 1,
	format: 'napo-positron-typecheck/v1',
	generatedAt: new Date().toISOString(),
	status,
	command: 'tsc --noEmit -p vitest.tsconfig.json --skipLibCheck --pretty false',
	exitCode: result.status,
	diagnosticCount: diagnostics.length,
	diagnosticFileCount: diagnosticFiles.length,
	changedFileOverlap,
	diagnosticsByCode,
	diagnostics,
	interpretation: status === 'pass'
		? 'El tipado de los tests no produjo diagnósticos.'
		: status === 'upstream-debt'
			? 'Los diagnósticos están confinados a archivos no modificados por Napo; no se deben ocultar ni usar para declarar verde el chequeo.'
			: status === 'fail'
				? 'Existe al menos un diagnóstico en un archivo modificado por Napo.'
				: 'El entorno no permitió ejecutar el compilador.',
};

writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Auditoría TypeScript de Positron escrita: ${outputPath}`);
console.log(`Resultado: ${status}; diagnósticos=${diagnostics.length}; archivos con diagnóstico=${diagnosticFiles.length}; intersección Napo=${changedFileOverlap.length}`);
if (status === 'fail' || status === 'environment-failure') {
	process.exitCode = 1;
}

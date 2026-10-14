#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputIndex = process.argv.indexOf('--out');
const outputPath = resolve(outputIndex >= 0 ? process.argv[outputIndex + 1] : join(root, 'reports', 'napo-destination-tests.json'));

function runNpm(script) {
	const result = spawnSync('npm', ['run', script], {
		cwd: root,
		encoding: 'utf8',
		maxBuffer: 50 * 1024 * 1024,
	});
	return {
		script,
		exitCode: result.status,
		ok: result.status === 0 && !result.error,
		output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
		error: result.error ? String(result.error) : undefined,
	};
}

function parseTestSuite(output) {
	const files = output.match(/Test Files\s+(\d+) passed\s*\|\s*(\d+) skipped\s*\((\d+)\)/);
	const tests = output.match(/Tests\s+(\d+) passed\s*\|\s*(\d+) expected fail\s*\|\s*(\d+) skipped\s*\((\d+)\)/);
	return {
		fileCount: files ? Number(files[1]) + Number(files[2]) : undefined,
		filesPassed: files ? Number(files[1]) : undefined,
		filesSkipped: files ? Number(files[2]) : undefined,
		totalFiles: files ? Number(files[3]) : undefined,
		testsPassed: tests ? Number(tests[1]) : undefined,
		expectedFailures: tests ? Number(tests[2]) : undefined,
		testsSkipped: tests ? Number(tests[3]) : undefined,
		totalTests: tests ? Number(tests[4]) : undefined,
	};
}

const typecheck = runNpm('typecheck-client');
const suite = runNpm('test:positron');
const parsedSuite = parseTestSuite(suite.output);
const knownWarnings = [];
if (suite.output.includes('Failed to load source map') && suite.output.includes('dompurify')) {
	knownWarnings.push('missing-DOMPurify-source-map');
}
if (suite.output.includes('DEP0060') || suite.output.includes('util._extend')) {
	knownWarnings.push('node-util-extend-deprecation');
}
const suiteSummaryComplete = parsedSuite.testsPassed !== undefined
	&& parsedSuite.expectedFailures !== undefined
	&& parsedSuite.testsSkipped !== undefined
	&& parsedSuite.filesPassed !== undefined;
const status = typecheck.ok && suite.ok && suiteSummaryComplete ? 'pass' : 'fail';
const report = {
	schemaVersion: 1,
	format: 'napo-destination-tests/v1',
	product: 'Napo',
	generatedAt: new Date().toISOString(),
	status,
	typecheckClient: {
		command: 'npm run typecheck-client',
		exitCode: typecheck.exitCode,
		status: typecheck.ok ? 'pass' : 'fail',
		error: typecheck.error,
	},
	positronSuite: {
		command: 'npm run test:positron',
		exitCode: suite.exitCode,
		status: suite.ok && suiteSummaryComplete ? 'pass' : 'fail',
		...parsedSuite,
		error: suite.error,
	},
	knownWarnings,
	interpretation: status === 'pass'
		? 'El cliente y la suite ejecutable del destino pasan; los fallos esperados y avisos conocidos permanecen explícitos.'
		: 'El cliente o la suite ejecutable del destino no produjo evidencia completa y debe investigarse antes del cierre.',
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia de pruebas del destino escrita: ${outputPath}`);
console.log(`Resultado: ${status}; typecheck=${report.typecheckClient.status}; archivos=${parsedSuite.filesPassed ?? 'desconocido'}; pruebas=${parsedSuite.testsPassed ?? 'desconocido'}; expected-fail=${parsedSuite.expectedFailures ?? 'desconocido'}; omitidas=${parsedSuite.testsSkipped ?? 'desconocido'}`);
if (status !== 'pass') process.exitCode = 1;

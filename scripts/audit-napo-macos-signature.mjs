#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	if (index < 0) {
		return undefined;
	}
	const value = process.argv[index + 1];
	if (!value || value.startsWith('--')) {
		throw new Error(`Falta el valor de ${name}.`);
	}
	return value;
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'RHS-IA.app'));
const reportPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-macos-signature.json'));
const requireDistribution = process.argv.includes('--require-distribution');
const executable = join(packagePath, 'Contents', 'MacOS', 'RHS-IA');

if (process.platform !== 'darwin') {
	throw new Error('La auditoría de firma de Napo requiere macOS.');
}
if (!existsSync(executable)) {
	throw new Error(`No existe el ejecutable empaquetado: ${executable}`);
}

function run(command, args) {
	const result = spawnSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
	return {
		exitCode: result.status ?? 1,
		output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
	};
}

const display = run('codesign', ['--display', '--verbose=4', packagePath]);
const verify = run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', packagePath]);
const assessment = run('spctl', ['--assess', '--type', 'execute', '--verbose=4', packagePath]);
const displayText = display.output;
const unsigned = /code object is not signed at all/i.test(displayText);
const signature = unsigned ? 'unsigned' : /Signature=([^\n]+)/.exec(displayText)?.[1]?.trim() ?? 'unknown';
const teamIdentifier = unsigned ? 'not set' : /TeamIdentifier=([^\n]+)/.exec(displayText)?.[1]?.trim() ?? 'unknown';
const authorities = [...displayText.matchAll(/Authority=([^\n]+)/g)].map(match => match[1].trim());
const distributionSigned = signature !== 'adhoc'
	&& teamIdentifier !== 'not set'
	&& display.exitCode === 0
	&& verify.exitCode === 0
	&& assessment.exitCode === 0;

const report = {
	format: 'napo-macos-signature/v1',
	package: packagePath,
	status: distributionSigned ? 'distribution-ready' : 'development-only',
	unsigned,
	requireDistribution,
	signature,
	teamIdentifier,
	authorities,
	codesignDisplayExitCode: display.exitCode,
	codesignVerifyExitCode: verify.exitCode,
	spctlExitCode: assessment.exitCode,
	codesignVerifyOutput: verify.output.trim(),
	spctlOutput: assessment.output.trim(),
};

mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia escrita: ${reportPath}`);
console.log(`Estado de firma: ${report.status}`);

if (requireDistribution && !distributionSigned) {
	console.error('FALLA: el paquete no tiene una firma macOS de distribución verificable.');
	process.exit(1);
}

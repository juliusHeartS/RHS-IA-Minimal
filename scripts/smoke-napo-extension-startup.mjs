#!/usr/bin/env node

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'Napo.app'));
const reportPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-extension-startup.json'));
const waitMs = Number(argumentValue('--wait-ms') || 12000);

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function processTable() {
	const output = execFileSync('ps', ['-axo', 'pid=,ppid=,command='], { encoding: 'utf8' });
	return output.split('\n').flatMap(line => {
		const match = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
		return match ? [{ pid: Number(match[1]), ppid: Number(match[2]), command: match[3] }] : [];
	});
}

function descendants(rootPid) {
	const processes = processTable();
	const result = new Set([rootPid]);
	let changed = true;
	while (changed) {
		changed = false;
		for (const process of processes) {
			if (result.has(process.ppid) && !result.has(process.pid)) {
				result.add(process.pid);
				changed = true;
			}
		}
	}
	return [...result];
}

function collectTextFiles(directory, result = []) {
	if (!existsSync(directory)) return result;
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const current = join(directory, entry.name);
		if (entry.isDirectory()) collectTextFiles(current, result);
		else if (entry.isFile() && /\.(log|txt|json|jsonl)$/i.test(entry.name)) result.push(current);
	}
	return result;
}

function removeGeneratedPythonCaches(appRoot) {
	const cacheDirectories = [];
	function visit(directory) {
		if (!existsSync(directory)) return;
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const current = join(directory, entry.name);
			if (entry.isDirectory() && entry.name === '__pycache__') {
				cacheDirectories.push(current);
				continue;
			}
			if (entry.isDirectory()) visit(current);
		}
	}
	visit(appRoot);
	for (const directory of cacheDirectories) rmSync(directory, { recursive: true, force: true });
	return cacheDirectories;
}

async function stopProcessTree(handle) {
	if (!handle?.pid) return;
	const exited = new Promise(resolveWait => {
		if (handle.exitCode !== null || handle.signalCode !== null) resolveWait();
		else handle.once('exit', resolveWait);
	});
	try { process.kill(-handle.pid, 'SIGTERM'); } catch { try { handle.kill('SIGTERM'); } catch { /* already stopped */ } }
	await Promise.race([exited, new Promise(resolveWait => setTimeout(resolveWait, 2000))]);
	if (handle.exitCode === null && handle.signalCode === null) {
		try { process.kill(-handle.pid, 'SIGKILL'); } catch { /* group already stopped */ }
		await Promise.race([exited, new Promise(resolveWait => setTimeout(resolveWait, 1000))]);
	}
}

if (process.platform !== 'darwin') throw new Error('El smoke de extensiones requiere macOS.');
const executable = join(packagePath, 'Contents', 'MacOS', 'Napo');
if (!existsSync(executable)) throw new Error(`No existe el ejecutable: ${executable}`);
if (!Number.isFinite(waitMs) || waitMs < 3000) throw new Error('--wait-ms debe ser mayor o igual a 3000');

const surfacePath = join(root, 'reports', 'napo-extension-surface-package.json');
const surface = JSON.parse(readFileSync(surfacePath, 'utf8'));
const packageExtensionsRoot = join(packagePath, 'Contents', 'Resources', 'app', 'extensions');
// The surface report can describe a previous package while the consolidated gate
// is refreshing reports. Audit only review candidates that physically exist in
// the package under test; this prevents stale evidence from claiming activation
// for an extension deliberately removed from the artifact.
const reviewExtensions = surface.extensions.filter(extension =>
	extension.recommendation === 'revisar'
	&& existsSync(join(packageExtensionsRoot, extension.folder, 'package.json'))
);
const runRoot = mkdtempSync(join(tmpdir(), 'napo-extension-startup-'));
const profile = join(runRoot, 'profile');
const logsPath = join(runRoot, 'logs');
const workspace = join(runRoot, 'workspace');
mkdirSync(workspace, { recursive: true });
writeFileSync(join(workspace, 'startup-smoke.txt'), 'NAPO_EXTENSION_STARTUP_SMOKE\n');

let child;
let stdout = '';
let stderr = '';
let cleanedRuntimeArtifacts = [];
try {
	child = spawn(executable, [
		'--user-data-dir', profile,
		'--logsPath', logsPath,
		'--log', 'trace',
		'--disable-gpu',
		'--skip-welcome',
		workspace,
	], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
	child.stdout.on('data', data => { stdout += data.toString(); });
	child.stderr.on('data', data => { stderr += data.toString(); });
	await new Promise(resolveWait => setTimeout(resolveWait, waitMs));
} finally {
	await stopProcessTree(child);
	const appRoot = join(packagePath, 'Contents', 'Resources', 'app');
	cleanedRuntimeArtifacts = removeGeneratedPythonCaches(appRoot).map(directory => relative(appRoot, directory).split('/').join('/'));
}

const logFiles = collectTextFiles(logsPath);
const logText = [stdout, stderr, ...logFiles.map(file => readFileSync(file, 'utf8'))].join('\n');
const allLines = logText.split('\n').filter(Boolean);
const activationErrorPattern = /(error while activating extension|failed to activate extension|cannot find module|extension host terminated|activation failed)/i;
const startupErrors = allLines.filter(line => activationErrorPattern.test(line) && !/ignoring a path for watching/i.test(line));
const checks = reviewExtensions.map(extension => {
	const relatedLines = allLines.filter(line => line.includes(extension.name));
	const errorLines = relatedLines.filter(line => activationErrorPattern.test(line));
	const activationObserved = relatedLines.some(line => /activat|activate|startupfinished|onstartup/i.test(line));
	return {
		name: extension.name,
		folder: extension.folder,
		surfaceRole: extension.surfaceRole,
		staticActivationEvents: extension.activationEvents,
		activationObserved,
		startupErrorLines: errorLines.slice(0, 20),
		status: errorLines.length > 0 ? 'fail' : extension.activationEvents.length === 0 ? 'not-triggered-resource' : activationObserved ? 'startup-observed' : 'not-triggered',
	};
});

const report = {
	format: 'napo-extension-startup/v1',
	package: packagePath,
	waitMs,
	reviewedExtensionCount: reviewExtensions.length,
	checks,
	startupErrors: startupErrors.slice(0, 50),
	logFiles: logFiles.map(file => relative(logsPath, file).split('/').join('/')),
	cleanedRuntimeArtifacts,
	status: startupErrors.length === 0 && checks.every(check => check.startupErrorLines.length === 0) ? 'pass' : 'fail',
	limitations: [
		'El smoke observa el arranque limpio; una extensión sin evento de arranque queda not-triggered y requiere una prueba específica de su función.',
		'La ausencia de error de activación no demuestra equivalencia completa ni cubre comandos, vistas o flujos de usuario.',
		'El smoke no modifica código funcional del paquete, las fuentes ni el perfil persistente; elimina únicamente directorios __pycache__ generados por la propia prueba dentro del árbol de la aplicación para conservar un artefacto verificable.',
	],
	markers: { workspace: 'NAPO_EXTENSION_STARTUP_SMOKE' },
};
mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
rmSync(runRoot, { recursive: true, force: true });
console.log(`Evidencia escrita: ${reportPath}`);
console.log(`Extensiones bajo revisión observadas: ${reviewExtensions.length}`);
console.log(`Errores de arranque: ${startupErrors.length}`);
for (const check of checks) console.log(`${check.status === 'fail' ? 'FAIL' : 'OK'} ${check.name}: ${check.status}`);
if (report.status !== 'pass') process.exit(1);
console.log('OK smoke de activación inicial de extensiones');

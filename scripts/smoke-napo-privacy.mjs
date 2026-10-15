#!/usr/bin/env node

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
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
const executable = join(packagePath, 'Contents', 'MacOS', 'RHS-IA');
const reportPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-privacy-smoke.json'));
const waitMs = Number(argumentValue('--wait-ms') || 12000);

if (!Number.isFinite(waitMs) || waitMs < 1000) {
	throw new Error('--wait-ms debe ser un número mayor o igual a 1000.');
}

if (process.platform !== 'darwin') {
	throw new Error('El smoke de privacidad requiere macOS porque inspecciona RHS-IA.app y lsof.');
}
if (!existsSync(executable)) {
	throw new Error(`No existe el ejecutable empaquetado: ${executable}`);
}

const runRoot = join(tmpdir(), `napo-privacy-smoke-${process.pid}`);
const profile = join(runRoot, 'profile');
const workspace = join(runRoot, 'workspace');
mkdirSync(workspace, { recursive: true });
writeFileSync(join(workspace, 'privacy-smoke.txt'), 'NAPO_PRIVACY_SMOKE_WORKSPACE\n');

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

function connections(pid) {
	try {
		const output = execFileSync('lsof', ['-nP', '-a', '-p', String(pid), '-i'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		return output.split('\n').filter(line => /\b(TCP|UDP)\b/.test(line));
	} catch {
		return [];
	}
}

function isLoopback(line) {
	return line.includes('127.0.0.1') || line.includes('[::1]') || line.includes('localhost') || line.includes('0.0.0.0') || line.includes('[::]:');
}

async function stopProcessTree(processHandle) {
	if (!processHandle?.pid) {
		return;
	}

	const exited = new Promise(resolveWait => {
		if (processHandle.exitCode !== null || processHandle.signalCode !== null) {
			resolveWait();
		} else {
			processHandle.once('exit', resolveWait);
		}
	});

	try {
		process.kill(-processHandle.pid, 'SIGTERM');
	} catch {
		try { processHandle.kill('SIGTERM'); } catch { /* process already exited */ }
	}
	await Promise.race([exited, new Promise(resolveWait => setTimeout(resolveWait, 2000))]);

	if (processHandle.exitCode === null && processHandle.signalCode === null) {
		try { process.kill(-processHandle.pid, 'SIGKILL'); } catch { /* process group already exited */ }
		await Promise.race([exited, new Promise(resolveWait => setTimeout(resolveWait, 1000))]);
	}
}

let child;
let stdout = '';
let stderr = '';
let processIds = [];
let observedConnections = [];
let remoteConnections = [];
try {
	child = spawn(executable, [
		'--user-data-dir', profile,
		'--disable-gpu',
		'--skip-welcome',
		workspace,
	], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
	child.stdout.on('data', data => { stdout += data.toString(); });
	child.stderr.on('data', data => { stderr += data.toString(); });
	await new Promise(resolveWait => setTimeout(resolveWait, waitMs));
	processIds = descendants(child.pid);
	observedConnections = processIds.flatMap(pid => connections(pid).map(line => ({ pid, line })));
	remoteConnections = observedConnections.filter(connection => !isLoopback(connection.line));
} finally {
	await stopProcessTree(child);
	rmSync(runRoot, { recursive: true, force: true });
}

const report = {
	format: 'napo-privacy-smoke/v1',
	package: packagePath,
	waitMs,
	processIds,
	observedConnections,
	remoteConnections,
	status: remoteConnections.length === 0 ? 'pass' : 'fail',
	markers: {
		workspace: 'NAPO_PRIVACY_SMOKE_WORKSPACE',
		telemetryInvariant: 'enableTelemetry=false and no non-loopback connection observed during startup',
	},
	stdoutTail: stdout.slice(-4000),
	stderrTail: stderr.slice(-4000),
};

mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia escrita: ${reportPath}`);
for (const connection of observedConnections) {
	console.log(`${connection.pid}: ${connection.line}`);
}
if (remoteConnections.length > 0) {
	throw new Error(`Se observaron ${remoteConnections.length} conexiones no locales durante el arranque de Napo.`);
}
console.log('OK no se observaron conexiones no locales durante el arranque de Napo');

#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index === -1 ? undefined : process.argv[index + 1];
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'Napo.app'));
const evidencePath = resolve(argumentValue('--evidence') || join(root, 'reports', 'napo-extension-ui-evidence.json'));
const releasePath = resolve(argumentValue('--manifest') || join(root, 'reports', 'napo-release-manifest.json'));

function readJson(file) {
	return JSON.parse(readFileSync(file, 'utf8'));
}

if (!existsSync(packagePath)) throw new Error(`No existe el paquete: ${packagePath}`);
const evidence = readJson(evidencePath);
const release = readJson(releasePath);
const evidencePackage = typeof evidence.package === 'string' && !evidence.package.startsWith('/')
	? resolve(root, evidence.package)
	: evidence.package;
if (evidencePackage !== packagePath) throw new Error(`La evidencia apunta a otro paquete: ${evidence.package}`);
if (evidence.packageTreeSha256 !== release.treeSha256) throw new Error('El digest de la evidencia UI no coincide con el manifiesto de release vigente.');
if (evidence.status !== 'pass') throw new Error('La evidencia UI no está marcada como pass.');
const required = new Set([
	'paho.rhs-ia-documentation',
	'vscode.simple-browser',
	'vscode.media-preview',
	'vscode.json',
	'vscode.make',
	'vscode.markdown',
	'vscode.yaml',
	'vscode.html',
	'vscode.javascript',
	'vscode.diff',
	'vscode.prompt',
	'ms-ceintl.vscode-language-pack-es',
	'vscode.mermaid-markdown-features',
	'vscode.debug-auto-launch',
	'vscode.merge-conflict',
]);
const passed = new Set(evidence.observations.filter(observation => observation.status === 'pass').map(observation => observation.extension));
for (const extension of required) if (!passed.has(extension)) throw new Error(`Falta evidencia UI pass para ${extension}.`);
if (!Array.isArray(evidence.limitations) || evidence.limitations.length === 0) throw new Error('La evidencia UI debe declarar sus limitaciones.');
console.log(`OK evidencia UI manual ligada al digest ${release.treeSha256}`);
console.log(`Flujos pass: ${passed.size}; limitaciones declaradas: ${evidence.limitations.length}`);

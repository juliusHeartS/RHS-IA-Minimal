#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = mkdtempSync(join(tmpdir(), 'napo-knowledge-materialization-'));
const knowledgeRoot = join(root, 'source');
const workspace = join(root, 'workspace');
const pendingKnowledgeRoot = join(root, 'pending-source');
const pendingWorkspace = join(root, 'pending-workspace');
const reportPath = join(root, 'report.json');
mkdirSync(join(knowledgeRoot, 'institution'), { recursive: true });
mkdirSync(workspace, { recursive: true });
mkdirSync(pendingKnowledgeRoot, { recursive: true });
mkdirSync(pendingWorkspace, { recursive: true });
process.on('exit', () => rmSync(root, { recursive: true, force: true }));

const sourcePath = join(knowledgeRoot, 'institution', 'policy.md');
const manifestPath = join(knowledgeRoot, 'institution', 'policy.source.json');
const content = '# Approved local policy\n\nCapacity target: 120.\n';
writeFileSync(sourcePath, content);
writeFileSync(manifestPath, `${JSON.stringify({
	schemaVersion: 1,
	id: 'TEST-MATERIALIZATION',
	version: '2026.01',
	jurisdiction: 'Ecuador',
	authority: 'test-fixture-only',
	effectiveDate: '2026-01-15',
	sourceUri: 'https://example.invalid/never-fetch',
	contentPath: 'institution/policy.md',
	contentSha256: createHash('sha256').update(content).digest('hex'),
	reviewStatus: 'approved',
	reviewedBy: 'test-reviewer',
	reviewedAt: '2026-10-13T00:00:00Z',
	licenseRef: 'test-fixture-only',
}, null, 2)}\n`);

const script = fileURLToPath(new URL('./prepare-napo-knowledge-bundle.mjs', import.meta.url));
function run(args) {
	return spawnSync(process.execPath, [script, '--root', knowledgeRoot, '--workspace', workspace, '--require-approved', '--out', reportPath, ...args], { encoding: 'utf8' });
}
function runPending() {
	return spawnSync(process.execPath, [script, '--root', pendingKnowledgeRoot, '--workspace', pendingWorkspace, '--require-approved', '--out', reportPath, '--apply'], { encoding: 'utf8' });
}
function expect(condition, message) {
	if (!condition) throw new Error(message);
}

let result = run([]);
expect(result.status === 0, `el modo dry-run falló: ${result.stderr}`);
expect(JSON.parse(readFileSync(reportPath)).status === 'ready', 'el dry-run no produjo estado ready');
expect(!existsSync(join(workspace, 'Docs')), 'el dry-run escribió en el workspace');

result = run(['--apply']);
expect(result.status === 0, `la aplicación falló: ${result.stderr}`);
const appliedReport = JSON.parse(readFileSync(reportPath));
const receiptReport = JSON.parse(readFileSync(join(workspace, '.napo', 'knowledge', 'materialization.json')));
expect(appliedReport.status === 'applied', 'el reporte no esperó a completar la aplicación');
expect(receiptReport.status === 'applied', 'el recibo no confirmó la aplicación completada');
expect(appliedReport.sources[0].authority === 'test-fixture-only', 'el reporte perdió la autoridad de procedencia');
expect(appliedReport.sources[0].reviewStatus === 'approved', 'el reporte perdió el estado de revisión');
expect(readFileSync(join(workspace, 'Docs', 'institution', 'policy.md'), 'utf8') === content, 'el contenido aprobado no llegó a Docs');
expect(existsSync(join(workspace, 'Docs', 'institution', 'policy.source.json')), 'el manifiesto lateral no llegó a Docs');
expect(existsSync(join(workspace, '.napo', 'knowledge', 'materialization.json')), 'no se escribió el recibo de procedencia');

result = run(['--apply']);
expect(result.status === 0, `la segunda aplicación no fue idempotente: ${result.stderr}`);
expect(JSON.parse(readFileSync(reportPath)).status === 'applied', 'la segunda aplicación no produjo estado applied');

writeFileSync(join(workspace, 'Docs', 'institution', 'policy.md'), '# conflicting local content\n');
result = run(['--apply']);
expect(result.status === 1, 'se sobrescribió una colisión de contenido');
expect(readFileSync(join(workspace, 'Docs', 'institution', 'policy.md'), 'utf8').startsWith('# conflicting'), 'la colisión modificó el archivo existente');

const pendingContentPath = join(pendingKnowledgeRoot, 'pending.md');
writeFileSync(pendingContentPath, 'Pending source\n');
writeFileSync(join(pendingKnowledgeRoot, 'pending.source.json'), `${JSON.stringify({
	schemaVersion: 1,
	id: 'TEST-PENDING',
	version: '2026.01',
	jurisdiction: 'Ecuador',
	authority: 'test-fixture-only',
	effectiveDate: '2026-01-15',
	sourceUri: 'local://pending',
	contentPath: 'pending.md',
	contentSha256: createHash('sha256').update('Pending source\n').digest('hex'),
	reviewStatus: 'pending-human-review',
	licenseRef: 'test-fixture-only',
}, null, 2)}\n`);
result = runPending();
expect(result.status === 1 && !existsSync(join(pendingWorkspace, 'Docs')), 'se materializó una fuente pendiente');

const symlinkWorkspace = join(root, 'symlink-workspace');
const outsideDestination = join(root, 'outside-destination');
mkdirSync(symlinkWorkspace, { recursive: true });
mkdirSync(outsideDestination, { recursive: true });
symlinkSync(outsideDestination, join(symlinkWorkspace, 'Docs'), 'dir');
const symlinkResult = spawnSync(process.execPath, [script, '--root', knowledgeRoot, '--workspace', symlinkWorkspace, '--require-approved', '--out', reportPath, '--apply'], { encoding: 'utf8' });
expect(symlinkResult.status === 1, 'se permitió una ruta de destino que escapa mediante symlink');

console.log('OK dry-run no escribe');
console.log('OK materialización aprobada conserva contenido y manifiesto lateral');
console.log('OK aplicación repetida es idempotente');
console.log('OK colisión rechazada sin sobrescritura');
console.log('OK fuente pendiente rechazada');
console.log('OK destino symlink rechazado');
console.log('OK materialización de conocimiento de Napo');

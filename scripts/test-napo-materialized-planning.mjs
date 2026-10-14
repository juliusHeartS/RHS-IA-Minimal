#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = mkdtempSync(join(tmpdir(), 'napo-materialized-planning-'));
const sourceRoot = join(root, 'approved-source');
const workspace = join(root, 'workspace');
const materializationReport = join(root, 'materialization.json');
const evidencePath = join(process.cwd(), 'reports', 'napo-materialized-planning.json');
mkdirSync(sourceRoot, { recursive: true });
mkdirSync(workspace, { recursive: true });
process.on('exit', () => rmSync(root, { recursive: true, force: true }));

const content = [
	'baseline_capacity: 100',
	'target_capacity: 120',
	'policy_id: TEST-MATERIALIZED-PLANNING',
	'policy_version: 2026.01',
	'jurisdiction: Ecuador',
].join('\n') + '\n';
const contentPath = join(sourceRoot, 'planning-policy.md');
const manifestPath = join(sourceRoot, 'planning-policy.source.json');
writeFileSync(contentPath, content);
writeFileSync(manifestPath, `${JSON.stringify({
	schemaVersion: 1,
	id: 'TEST-MATERIALIZED-PLANNING',
	version: '2026.01',
	jurisdiction: 'Ecuador',
	authority: 'test-fixture-only',
	effectiveDate: '2026-01-15',
	sourceUri: 'local://test-fixture-only/planning-policy.md',
	contentPath: 'planning-policy.md',
	contentSha256: createHash('sha256').update(content).digest('hex'),
	reviewStatus: 'approved',
	reviewedBy: 'test-reviewer',
	reviewedAt: '2026-10-13T00:00:00Z',
	licenseRef: 'test-fixture-only',
}, null, 2)}\n`);

const prepareScript = fileURLToPath(new URL('./prepare-napo-knowledge-bundle.mjs', import.meta.url));
const materialized = spawnSync(process.execPath, [
	prepareScript,
	'--root', sourceRoot,
	'--workspace', workspace,
	'--require-approved',
	'--apply',
	'--out', materializationReport,
], { encoding: 'utf8' });
if (materialized.status !== 0) throw new Error(`materialización falló: ${materialized.stderr || materialized.stdout}`);

const rCode = [
	'policy <- readLines("Docs/planning-policy.md", warn = FALSE)',
	'baseline <- as.numeric(sub("baseline_capacity: ", "", policy[startsWith(policy, "baseline_capacity:")]))',
	'target <- as.numeric(sub("target_capacity: ", "", policy[startsWith(policy, "target_capacity:")]))',
	'gap <- target - baseline',
	'stopifnot(baseline == 100, target == 120, gap == 20)',
	'cat("NAPO_MATERIALIZED_PLANNING_OK\\n")',
].join('; ');
const rResult = spawnSync('Rscript', ['-e', rCode], { cwd: workspace, encoding: 'utf8' });
if (rResult.status !== 0 || !`${rResult.stdout}${rResult.stderr}`.includes('NAPO_MATERIALIZED_PLANNING_OK')) {
	throw new Error(`la sesión R no pudo leer el bundle materializado: ${rResult.stderr || rResult.stdout}`);
}

const receipt = join(workspace, '.napo', 'knowledge', 'materialization.json');
if (!existsSync(receipt) || !JSON.parse(readFileSync(receipt, 'utf8')).sources?.length) {
	throw new Error('falta el recibo de procedencia del bundle materializado');
}

mkdirSync(join(process.cwd(), 'reports'), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify({
	format: 'napo-materialized-planning/v1',
	status: 'pass',
	fixture: 'test-fixture-only',
	materialization: JSON.parse(readFileSync(materializationReport, 'utf8')).status,
	source: { id: 'TEST-MATERIALIZED-PLANNING', version: '2026.01', jurisdiction: 'Ecuador' },
	runtime: 'Rscript',
	marker: 'NAPO_MATERIALIZED_PLANNING_OK',
	limitations: [
		'La fuente es un fixture local y no tiene autoridad legal.',
		'La prueba demuestra transferencia y lectura reproducible en R; no sustituye la ruta UI Capibara ni la revisión institucional.',
		'No se sigue sourceUri ni se realiza tráfico de red.',
	],
}, null, 2)}\n`);
console.log('OK bundle aprobado materializado en Docs');
console.log('OK recibo de procedencia conservado');
console.log('OK sesión R leyó la fuente materializada: NAPO_MATERIALIZED_PLANNING_OK');
console.log(`Evidencia escrita: ${evidencePath}`);

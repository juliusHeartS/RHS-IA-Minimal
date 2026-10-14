#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { validateKnowledgeManifest, sha256 } from './validate-napo-knowledge-source.mjs';
import { auditKnowledgeRoot } from './audit-napo-knowledge-bundle.mjs';

const root = mkdtempSync(join(tmpdir(), 'napo-knowledge-governance-'));
const outsideRoot = mkdtempSync(join(tmpdir(), 'napo-knowledge-outside-'));
process.on('exit', () => {
	rmSync(root, { recursive: true, force: true });
	rmSync(outsideRoot, { recursive: true, force: true });
});
const contentPath = join(root, 'planning-policy.md');
const manifestPath = join(root, 'planning-policy.source.json');
const content = 'Example planning input for Napo governance tests.\n';
writeFileSync(contentPath, content);

function writeManifest(overrides = {}) {
	const manifest = {
		schemaVersion: 1,
		id: 'TEST-PLANNING-SOURCE',
		version: '2026.01',
		jurisdiction: 'Ecuador',
		authority: 'test-fixture-only',
		effectiveDate: '2026-01-15',
		sourceUri: 'local://test-fixture/planning-policy.md',
		contentPath: 'planning-policy.md',
		contentSha256: sha256(contentPath),
		reviewStatus: 'pending-human-review',
		licenseRef: 'test-fixture-only',
		...overrides,
	};
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

const checks = [];
function pass(name, detail) {
	checks.push({ name, status: 'pass', detail });
}
function expect(condition, message) {
	if (!condition) throw new Error(message);
}

writeManifest();
let result = validateKnowledgeManifest({ manifestPath, root });
expect(result.ok && !result.usableForPlanning, 'una fuente pendiente debe ser trazable pero no utilizable para planificación');
pass('fuente pendiente trazable', 'metadatos y hash correctos; usableForPlanning=false');

writeManifest({ schemaVersion: 2 });
result = validateKnowledgeManifest({ manifestPath, root });
expect(!result.ok && result.errors.some(error => error.includes('schemaVersion')), 'se aceptó una versión de esquema no soportada');
pass('versión de esquema protegida', result.errors.join('; '));

writeManifest();
result = validateKnowledgeManifest({ manifestPath, root, requireApproved: true });
expect(!result.ok && result.errors.some(error => error.includes('revisión humana')), 'require-approved no bloqueó la fuente pendiente');
pass('fuente pendiente bloqueada', result.errors.join('; '));

writeFileSync(contentPath, `${content}cambio no registrado\n`);
result = validateKnowledgeManifest({ manifestPath, root });
expect(!result.ok && result.errors.some(error => error.includes('hash')), 'no se detectó el cambio de contenido');
pass('hash de contenido protegido', result.errors.join('; '));

writeFileSync(contentPath, content);
writeManifest({
	contentSha256: sha256(contentPath),
	reviewStatus: 'approved',
	reviewedBy: 'human-review-fixture',
	reviewedAt: '2026-10-12T00:00:00Z',
});
result = validateKnowledgeManifest({ manifestPath, root, requireApproved: true });
expect(result.ok && result.usableForPlanning, 'una fuente aprobada válida fue rechazada');
pass('fuente aprobada utilizable', `${result.manifest.id}@${result.manifest.version} / ${result.manifest.jurisdiction}`);

writeManifest({ effectiveDate: '2026-02-30' });
result = validateKnowledgeManifest({ manifestPath, root });
expect(!result.ok && result.errors.some(error => error.includes('fecha calendario')), 'se aceptó una fecha calendario inexistente');
pass('fecha efectiva real', result.errors.join('; '));

const outsideContentPath = join(outsideRoot, 'outside.md');
writeFileSync(outsideContentPath, content);
writeManifest({ contentPath: '../napo-knowledge-outside-placeholder/outside.md', contentSha256: sha256(outsideContentPath) });
result = validateKnowledgeManifest({ manifestPath, root });
expect(!result.ok && result.errors.some(error => error.includes('escapar') || error.includes('permanecer')), 'se aceptó una ruta fuera de la raíz');
pass('traversal fuera de raíz rechazado', result.errors.join('; '));

const symlinkPath = join(root, 'linked.md');
symlinkSync(outsideContentPath, symlinkPath);
writeManifest({ contentPath: 'linked.md', contentSha256: sha256(outsideContentPath) });
result = validateKnowledgeManifest({ manifestPath, root });
expect(!result.ok && result.errors.some(error => error.includes('symlink')), 'se aceptó un symlink fuera de la raíz');
pass('symlink fuera de raíz rechazado', result.errors.join('; '));

writeManifest();
const bundle = auditKnowledgeRoot({ knowledgeRoot: root });
expect(bundle.status === 'pass' && bundle.summary.total === 1 && bundle.summary.pendingHumanReview === 1 && bundle.summary.usableForPlanning === 0,
	'el auditor de paquete no distinguió una fuente pendiente trazable de una fuente utilizable');
pass('paquete pendiente trazable', `fuentes=${bundle.summary.total}; aprobadas=${bundle.summary.approved}; utilizables=${bundle.summary.usableForPlanning}`);

const strictBundle = auditKnowledgeRoot({ knowledgeRoot: root, requireApproved: true });
expect(strictBundle.status === 'fail' && strictBundle.summary.pendingHumanReview === 1,
	'el auditor estricto no bloqueó el paquete con revisión humana pendiente');
pass('paquete pendiente bloqueado', `pendientes=${strictBundle.summary.pendingHumanReview}`);

const bundleCli = fileURLToPath(new URL('./audit-napo-knowledge-bundle.mjs', import.meta.url));
const cliReportPath = join(root, 'bundle-audit.json');
const cliResult = spawnSync(process.execPath, [bundleCli, '--root', root, '--out', cliReportPath], { encoding: 'utf8' });
expect(cliResult.status === 0 && readFileSync(cliReportPath, 'utf8').includes('napo-knowledge-bundle-audit/v1'),
	'la interfaz CLI del auditor de paquete no produjo un reporte válido');
pass('CLI de auditoría de paquete', 'modo normal produjo un reporte versionado');

const strictCliReportPath = join(root, 'bundle-audit-strict.json');
const strictCliResult = spawnSync(process.execPath, [bundleCli, '--root', root, '--out', strictCliReportPath, '--require-approved'], { encoding: 'utf8' });
expect(strictCliResult.status === 1 && readFileSync(strictCliReportPath, 'utf8').includes('"status": "fail"'),
	'la interfaz CLI estricta no bloqueó la fuente pendiente');
pass('CLI estricto de auditoría de paquete', 'require-approved bloqueó el reporte pendiente');

const duplicateContentPath = join(root, 'planning-policy-duplicate.md');
const duplicateManifestPath = join(root, 'planning-policy-duplicate.source.json');
writeFileSync(duplicateContentPath, content);
writeFileSync(duplicateManifestPath, `${JSON.stringify({
	schemaVersion: 1,
	id: 'TEST-PLANNING-SOURCE',
	version: '2026.01',
	jurisdiction: 'Ecuador',
	authority: 'test-fixture-only',
	effectiveDate: '2026-01-15',
	sourceUri: 'local://test-fixture/planning-policy-duplicate.md',
	contentPath: 'planning-policy-duplicate.md',
	contentSha256: sha256(duplicateContentPath),
	reviewStatus: 'pending-human-review',
	licenseRef: 'test-fixture-only',
}, null, 2)}\n`);
const duplicateBundle = auditKnowledgeRoot({ knowledgeRoot: root });
expect(duplicateBundle.status === 'fail' && duplicateBundle.summary.duplicateIdentities === 1,
	'el auditor aceptó identidades id/version/jurisdiction duplicadas');
pass('identidad de fuente única', 'la raíz rechaza duplicados de id/version/jurisdiction');

const reportPath = join(process.cwd(), 'reports', 'napo-knowledge-governance.json');
writeFileSync(reportPath, `${JSON.stringify({
	format: 'napo-knowledge-governance/v1',
	status: 'pass',
	checks,
	policy: 'las fuentes pendientes se pueden rastrear, pero no se usan como conocimiento aprobado para planificación',
	limitations: [
		'La validación comprueba metadatos, hash y estado de revisión; no determina la verdad jurídica ni la autoridad real de una fuente.',
		'La aprobación requiere revisión humana fuera de este script.',
	],
}, null, 2)}\n`);
console.log(`Evidencia escrita: ${reportPath}`);
for (const check of checks) console.log(`OK ${check.name}: ${check.detail}`);
console.log('OK gobernanza de fuentes de conocimiento');

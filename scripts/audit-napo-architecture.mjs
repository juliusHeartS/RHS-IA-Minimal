#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputIndex = process.argv.indexOf('--out');
const outputPath = resolve(outputIndex >= 0 ? process.argv[outputIndex + 1] : join(root, 'reports', 'napo-architecture-audit.json'));

function readText(relativePath) {
	const path = join(root, relativePath);
	return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

function readJson(relativePath) {
	const text = readText(relativePath);
	return text ? JSON.parse(text) : null;
}

const checks = [];
function check(id, ok, detail, evidence) {
	checks.push({ id, status: ok ? 'pass' : 'fail', detail, evidence });
}

const architecture = readText('ARQUITECTURA_NAPO.md');
const hostMatrix = readText('MATRIZ_HOST_CAPIBARA.md');
const transferMatrix = readText('MATRIZ_TRANSFERENCIA_NAPO.md');
const dataIntegrity = readJson('reports/napo-data-extension-integrity.json');
const capabilities = readJson('reports/napo-capability-surface.json');
const sourceBaseline = readJson('reports/napo-source-readonly-baseline.json');

check(
	'architecture-document',
	Boolean(architecture)
		&& architecture.includes('# Arquitectura de Napo')
		&& architecture.includes('Napo será una distribución de escritorio'),
	'La arquitectura base identifica Napo como distribución de escritorio y receptor de las integraciones.',
	'ARQUITECTURA_NAPO.md',
);

const layers = [
	['host', '### Capa A — Host de escritorio'],
	['data', '### Capa B — Análisis de datos'],
	['agent', '### Capa C — Agente integrado'],
	['planning', '### Capa D — Modelación y planificación'],
];
for (const [id, marker] of layers) {
	check(`layer-${id}`, Boolean(architecture?.includes(marker)), `La arquitectura declara ${marker}.`, 'ARQUITECTURA_NAPO.md');
}

const hostContracts = [
	'1. descubrimiento, instalación y activación de la extensión',
	'4. disponibilidad de workspace, archivos, terminal, R, Python y Quarto',
	'7. proveedores visibles y configuración segura de credenciales',
	'8. aprobaciones, cancelación, permisos y aislamiento',
	'9. auditoría, procedencia y recuperación ante errores',
	'10. empaquetado completo de Capibara y sus recursos',
];
for (const [index, contract] of hostContracts.entries()) {
	check(`host-contract-${index + 1}`, Boolean(architecture?.includes(contract)), `Contrato mínimo presente: ${contract}.`, 'ARQUITECTURA_NAPO.md');
}

const matrixTerms = [
	'| Activación |',
	'| Runtime |',
	'| Workspace |',
	'| R/Python |',
	'| Quarto |',
	'| Proveedores |',
	'| Permisos |',
	'| Persistencia |',
	'| Red |',
	'| Empaquetado |',
];
for (const term of matrixTerms) {
	check(`host-matrix-${term.slice(2, -3).toLowerCase().replaceAll('/', '-')}`, Boolean(hostMatrix?.includes(term)), `Matriz del host declara ${term.replaceAll('|', '').trim()}.`, 'MATRIZ_HOST_CAPIBARA.md');
}

check(
	'transfer-matrix',
	Boolean(transferMatrix)
		&& transferMatrix.includes('| Fuente y ruta |')
		&& transferMatrix.includes('| Destino Napo |')
		&& transferMatrix.includes('| Decisión |')
		&& transferMatrix.includes('| Evidencia actual |')
		&& transferMatrix.includes('Capibara completa')
		&& transferMatrix.includes('Quarto'),
	'La matriz de transferencia conserva fuente, destino, decisión, evidencia, Capibara y Quarto.',
	'MATRIZ_TRANSFERENCIA_NAPO.md',
);

check(
	'data-evidence',
	dataIntegrity?.status === 'pass' && dataIntegrity.codeMismatches?.length === 0,
	'La evidencia de extensiones de datos está aprobada y sin diferencias funcionales.',
	'reports/napo-data-extension-integrity.json',
);
check(
	'capability-evidence',
	capabilities?.status === 'pass' && capabilities.failedCapabilities === 0,
	'La superficie de capacidades analíticas y de planificación está aprobada.',
	'reports/napo-capability-surface.json',
);
check(
	'source-baseline',
	Array.isArray(sourceBaseline?.sources) && sourceBaseline.sources.length >= 5,
	'Existe un baseline explícito para las cinco fuentes de solo lectura.',
	'reports/napo-source-readonly-baseline.json',
);

const failures = checks.filter((item) => item.status === 'fail');
const report = {
	schemaVersion: 1,
	format: 'napo-architecture-audit/v1',
	product: 'Napo',
	status: failures.length === 0 ? 'pass' : 'fail',
	checks,
	interpretation: failures.length === 0
		? 'La arquitectura documental y sus evidencias mínimas están reconciliadas.'
		: 'Falta al menos un contrato arquitectónico o una evidencia vinculada.',
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Auditoría de arquitectura escrita: ${outputPath}`);
console.log(`Resultado: ${report.status}; comprobaciones=${checks.length}; fallos=${failures.length}`);
if (failures.length > 0) process.exitCode = 1;


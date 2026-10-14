#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
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

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'Napo.app'));
const requireDistribution = process.argv.includes('--require-distribution');
const manualRisk = process.argv.includes('--manual-risk');
const releaseManifest = resolve(argumentValue('--manifest') || join(root, 'reports', 'napo-release-manifest.json'));

if (requireDistribution && manualRisk) {
	throw new Error('--manual-risk y --require-distribution son modos incompatibles.');
}

if (!existsSync(packagePath)) {
	throw new Error(`No existe el paquete de Napo: ${packagePath}`);
}

const checks = [
	['repositorios fuente solo lectura', 'scripts/audit-napo-source-readonly.mjs', ['--verify']],
	['arquitectura y contratos de Napo', 'scripts/audit-napo-architecture.mjs', []],
	['tipado de tests Positron (clasificación de deuda)', 'scripts/audit-napo-positron-typecheck.mjs', []],
	['estructura y privacidad', 'scripts/validate-napo.mjs', ['--require-runtime', '--package', packagePath]],
	['raíces de dependencias runtime de extensiones', 'scripts/audit-napo-extension-dependency-roots.mjs', ['--package', packagePath]],
	['contrato estático de privacidad', 'scripts/audit-napo-privacy-contract.mjs', ['--package', packagePath]],
	['integridad de extensiones de datos', 'scripts/audit-napo-data-extension-integrity.mjs', []],
	['superficie de capacidades analíticas y de planificación', 'scripts/audit-napo-capability-surface.mjs', ['--package', packagePath]],
	['runtime analítico', 'scripts/smoke-napo-runtime.mjs', ['--package', packagePath]],
	['modelación, simulación y escenarios', 'scripts/smoke-napo-modeling.mjs', ['--package', packagePath]],
	['privacidad dinámica', 'scripts/smoke-napo-privacy.mjs', ['--package', packagePath]],
	['actualización y recuperación', 'scripts/test-napo-update-recovery.mjs', ['--package', packagePath]],
	['verificador offline de candidato de actualización', 'scripts/test-napo-update-candidate.mjs', []],
	['gobernanza de conocimiento', 'scripts/test-napo-knowledge-governance.mjs', []],
	['materialización segura de conocimiento', 'scripts/test-napo-knowledge-materialization.mjs', []],
	['planificación desde conocimiento materializado', 'scripts/test-napo-materialized-planning.mjs', []],
	['arranque de extensiones bajo revisión', 'scripts/smoke-napo-extension-startup.mjs', ['--package', packagePath]],
	['superficie de extensiones', 'scripts/audit-napo-extension-surface.mjs', ['--package', packagePath]],
	['contratos declarados de extensiones bajo revisión', 'scripts/audit-napo-extension-contracts.mjs', ['--package', packagePath]],
	['evidencia UI manual ligada al paquete', 'scripts/validate-napo-extension-ui-evidence.mjs', ['--package', packagePath]],
	['cobertura funcional de extensiones bajo revisión', 'scripts/audit-napo-extension-functional-coverage.mjs', ['--package', packagePath]],
	['manifiesto resistente a cachés volátiles', 'scripts/test-napo-release-manifest.mjs', []],
	['registro lateral de revisión legal', 'scripts/test-napo-license-review-decisions.mjs', ['--package', packagePath]],
	['inventario legal', 'scripts/audit-napo-license-inventory.mjs', ['--package', packagePath, '--out', join(root, 'reports', 'napo-license-inventory-package.json'), '--decisions', join(root, 'reports', 'napo-license-decisions.json'), '--release', releaseManifest, ...(requireDistribution ? ['--require-human-review'] : [])]],
	['consistencia documental de Napo', 'scripts/audit-napo-document-consistency.mjs', ['--manifest', releaseManifest]],
	['manifiesto de release', 'scripts/napo-release-manifest.mjs', ['--package', packagePath, '--verify', releaseManifest]],
	['expediente de revisión legal', 'scripts/audit-napo-license-review-packet.mjs', ['--package', packagePath, '--inventory', join(root, 'reports', 'napo-license-inventory-package.json'), '--release', releaseManifest, '--decisions', join(root, 'reports', 'napo-license-decisions.json'), ...(requireDistribution ? ['--require-approved'] : [])]],
	['evidencia precisa de firma macOS', 'scripts/test-napo-macos-signature.mjs', ['--package', packagePath]],
	['firma macOS', 'scripts/audit-napo-macos-signature.mjs', ['--package', packagePath, ...(requireDistribution ? ['--require-distribution'] : [])]],
	['auditoría de cierre requisito por requisito', 'scripts/audit-napo-completion.mjs', ['--package', packagePath, ...(manualRisk ? ['--manual-risk'] : [])]],
];

for (const [label, script, args] of checks) {
	console.log(`\n[Napo gate] ${label}`);
	const result = spawnSync(process.execPath, [join(root, script), ...args], {
		cwd: root,
		stdio: 'inherit',
	});
	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		console.error(`[Napo gate] FALLA en ${label} (código ${result.status ?? 'desconocido'})`);
		process.exit(result.status || 1);
	}
}

console.log(`\n[Napo gate] ACEPTADA (${requireDistribution ? 'diagnóstico de ruta Apple opcional' : 'distribución manual libre'})`);

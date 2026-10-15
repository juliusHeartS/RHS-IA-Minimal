#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function loadJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function run(command, args) {
	const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
	return { ok: result.status === 0 && !result.error, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function walkVolatileFiles(directory, result = []) {
	if (!existsSync(directory)) return result;
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const current = join(directory, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === '__pycache__') {
				result.push(relative(directoryRoot, current).split('/').join('/'));
				continue;
			}
			walkVolatileFiles(current, result);
			continue;
		}
		if (entry.isFile() && (/\.(pyc|pyo)$/i.test(entry.name) || entry.name.endsWith('.stats.json'))) {
			result.push(relative(directoryRoot, current).split('/').join('/'));
		}
	}
	return result;
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'RHS-IA.app'));
const outputPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-completion-audit.json'));
const requireComplete = process.argv.includes('--require-complete');
const manualRisk = process.argv.includes('--manual-risk');
const packageAppRoot = join(packagePath, 'Contents', 'Resources', 'app');
const directoryRoot = packageAppRoot;
const releaseManifestPath = join(root, 'reports', 'napo-release-manifest.json');

if (!existsSync(packageAppRoot)) throw new Error(`No existe el contenido de Napo: ${packageAppRoot}`);

const requirements = [];
function add(id, status, detail, evidence) {
	requirements.push({ id, status, detail, evidence });
}

const product = loadJson(join(packageAppRoot, 'product.json'));
const capibara = loadJson(join(packageAppRoot, 'extensions', 'rhs-agent4', 'package.json'));
const dataIntegrity = loadJson(join(root, 'reports', 'napo-data-extension-integrity.json'));
const capabilities = loadJson(join(root, 'reports', 'napo-capability-surface.json'));
const architecture = loadJson(join(root, 'reports', 'napo-architecture-audit.json'));
const privacy = loadJson(join(root, 'reports', 'napo-privacy-smoke.json'));
const dependencies = loadJson(join(root, 'reports', 'napo-extension-dependency-roots.json'));
const functionalCoverage = loadJson(join(root, 'reports', 'napo-extension-functional-coverage.json'));
const legal = loadJson(join(root, 'reports', 'napo-license-review-packet.json'));
const signature = loadJson(join(root, 'reports', 'napo-macos-signature.json'));
const release = loadJson(releaseManifestPath);
const policyText = readFileSync(join(root, 'POLITICA_NAPO.md'), 'utf8');

const documentConsistencyPath = join(root, 'reports', 'napo-document-consistency.json');
const documentConsistencyRun = run(process.execPath, [join(root, 'scripts', 'audit-napo-document-consistency.mjs'), '--manifest', releaseManifestPath, '--out', documentConsistencyPath]);
const documentConsistency = existsSync(documentConsistencyPath) ? loadJson(documentConsistencyPath) : undefined;
const destinationTestsPath = join(root, 'reports', 'napo-destination-tests.json');
const destinationTestsRun = run(process.execPath, [join(root, 'scripts', 'audit-napo-destination-tests.mjs'), '--out', destinationTestsPath]);
const destinationTests = existsSync(destinationTestsPath) ? loadJson(destinationTestsPath) : undefined;

add(
	'identity-and-privacy',
	product.applicationName === 'napo'
		&& product.nameShort === 'RHS-IA'
		&& product.enableTelemetry === false
		&& !product.updateUrl
		&& !product.downloadUrl
		&& product.positronLlmsDocsUrl === ''
		&& !product.extensionsGallery?.serviceUrl
		&& !product.extensionsGallery?.resourceUrlTemplate
		&& !product.extensionsGallery?.extensionUrlTemplate
		? 'pass' : 'fail',
	'Napo, telemetría, actualizaciones automáticas, documentación LLM y Marketplace están gobernados por el producto empaquetado.',
	'Contents/Resources/app/product.json',
);

add(
	'capibara-complete',
	capibara.name === 'rhs-agent4' && capibara.version === '4.0.0' && capibara.main === './dist/extension.js'
		? 'pass' : 'fail',
	'Capibara conserva el manifiesto y el entrypoint completo de rhs-agent4 4.0.0.',
	'Contents/Resources/app/extensions/rhs-agent4/package.json',
);

add(
	'data-extensions-unmodified',
	dataIntegrity.status === 'pass' && dataIntegrity.codeMismatches.length === 0 && dataIntegrity.missingExtensions.length === 0
		? 'pass' : 'fail',
	`${dataIntegrity.extensions.length} extensiones comparadas; diferencias funcionales: ${dataIntegrity.codeMismatches.length}.`,
	'reports/napo-data-extension-integrity.json',
);

add(
	'quarto-and-analytical-capabilities',
	capabilities.status === 'pass'
		&& capabilities.failedCapabilities === 0
		&& capabilities.passedCapabilities === capabilities.requiredCapabilities
		&& existsSync(join(packageAppRoot, 'quarto', 'bin', 'quarto'))
		? 'pass' : 'fail',
	`${capabilities.passedCapabilities}/${capabilities.requiredCapabilities} capacidades aprobadas; Quarto incluido.`,
	'reports/napo-capability-surface.json',
);

add(
	'architecture-and-host-contracts',
	architecture.status === 'pass' && architecture.checks.every((check) => check.status === 'pass')
		? 'pass' : 'fail',
	'Las capas de Napo, los contratos mínimos del host y las matrices de transferencia están reconciliados.',
	'reports/napo-architecture-audit.json; ARQUITECTURA_NAPO.md; MATRIZ_HOST_CAPIBARA.md; MATRIZ_TRANSFERENCIA_NAPO.md',
);

const capibaraE2e = ['napo-capibara-positron-e2e.json', 'napo-capibara-sensitivity-e2e.json', 'napo-capibara-planning-e2e.json']
	.map(file => loadJson(join(root, 'reports', file)));
add(
	'capibara-analytical-coordination',
	capibaraE2e.every(report => String(report.decision ?? '').startsWith('pass-')) ? 'pass' : 'fail',
	'La evidencia disponible cubre coordinación Capibara→Positron→R/Python para análisis, sensibilidad y planificación.',
	'reports/napo-capibara-*-e2e.json',
);

add(
	'analytical-runtime',
	loadJson(join(root, 'reports', 'napo-modeling-smoke.json')).status === 'pass'
		&& loadJson(join(root, 'reports', 'napo-materialized-planning.json')).status === 'pass'
		? 'pass' : 'fail',
	'R, Python, Quarto, modelación, simulación y planificación materializada tienen smoke reproducible.',
	'reports/napo-modeling-smoke.json; reports/napo-materialized-planning.json',
);

const manualUpdateChannel = /### Canal vigente/.test(policyText)
	&& /manual y operado explícitamente/.test(policyText)
	&& /no descubre ese canal, no lo consulta y no descarga/.test(policyText)
	&& /instalación efectiva sigue siendo manual y explícita/.test(policyText);
add(
	'manual-update-channel',
	manualUpdateChannel ? 'pass' : 'fail',
	'El canal de actualización es manual, explícito, localmente verificable y no automático.',
	'POLITICA_NAPO.md; scripts/verify-napo-update-candidate.mjs; scripts/test-napo-update-recovery.mjs',
);

add(
	'privacy-runtime',
	privacy.status === 'pass' && privacy.remoteConnections.length === 0 ? 'pass' : 'fail',
	'El arranque limpio no observó conexiones no locales.',
	'reports/napo-privacy-smoke.json',
);

add(
	'declared-extension-dependencies',
	dependencies.status === 'pass' && dependencies.unexpectedRoots.length === 0 ? 'pass' : 'fail',
	`${dependencies.observedRoots.length} raíces runtime observadas; no declaradas: ${dependencies.unexpectedRoots.length}.`,
	'reports/napo-extension-dependency-roots.json',
);

add(
	'extension-coverage',
	functionalCoverage.status === 'pass' ? 'pass' : 'fail',
	'Las extensiones bajo revisión tienen cobertura UI, contrato y arranque reconciliados.',
	'reports/napo-extension-functional-coverage.json',
);

const sourceReadonly = run(process.execPath, [join(root, 'scripts', 'audit-napo-source-readonly.mjs'), '--verify']);
add(
	'source-repositories-readonly',
	sourceReadonly.ok ? 'pass' : 'fail',
	'RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode conservan exactamente el baseline observado.',
	'scripts/audit-napo-source-readonly.mjs --verify',
);

const releaseVerified = run(process.execPath, [join(root, 'scripts', 'napo-release-manifest.mjs'), '--package', packagePath, '--verify', releaseManifestPath]);
add(
	'reproducible-release-manifest',
	releaseVerified.ok ? 'pass' : 'fail',
	`El manifiesto verifica ${release.fileCount} archivos con digest ${release.treeSha256}.`,
	'reports/napo-release-manifest.json',
);

const volatileFiles = walkVolatileFiles(packageAppRoot);
add(
	'package-hygiene',
	volatileFiles.length === 0 ? 'pass' : 'fail',
	volatileFiles.length === 0 ? 'No hay cachés Python ni reportes stats dentro del paquete.' : `Se encontraron ${volatileFiles.length} artefactos volátiles.`,
	'Contents/Resources/app',
);

add(
	'document-consistency',
	documentConsistencyRun.ok && documentConsistency?.status === 'pass' && documentConsistency.checks.length >= 7
		? 'pass' : 'fail',
	documentConsistency?.status === 'pass'
		? `${documentConsistency.checks.length} documentos canónicos están ligados al manifiesto y distinguen históricos de vigentes.`
		: 'No existe evidencia fresca y completa de consistencia documental.',
	'reports/napo-document-consistency.json',
);

add(
	'destination-tests',
	destinationTestsRun.ok && destinationTests?.status === 'pass'
		? 'pass' : 'fail',
	destinationTests?.status === 'pass'
		? `typecheck-client y test:positron pasan: ${destinationTests.positronSuite.filesPassed} archivos, ${destinationTests.positronSuite.testsPassed} pruebas, ${destinationTests.positronSuite.expectedFailures} expected-fail y ${destinationTests.positronSuite.testsSkipped} omitidas.`
		: 'No existe evidencia fresca y completa de typecheck-client y test:positron.',
	'reports/napo-destination-tests.json',
);

const pendingLegal = Number(legal.summary?.pendingCases ?? 0);
add(
	'legal-human-review',
	pendingLegal === 0 ? 'pass' : 'pending',
	pendingLegal === 0 ? 'No quedan casos pendientes.' : `${pendingLegal} casos requieren revisión humana; el auditor no infiere licencias.`,
	'reports/napo-license-review-packet.json',
);

const manualDistributionPolicy = /### Canal manual de distribución libre/.test(policyText)
	&& /hash SHA-256/.test(policyText)
	&& /Napo no desactiva Gatekeeper/.test(policyText)
	&& /firma Apple no es un requisito/.test(policyText);
const signatureAccepted = signature.status === 'pass'
	|| (manualDistributionPolicy && signature.status === 'development-only');
add(
	'macos-distribution-signature',
	signatureAccepted ? 'pass' : 'pending',
	signature.status === 'pass'
		? 'Firma de distribución verificada.'
		: manualDistributionPolicy && signature.status === 'development-only'
			? 'Distribución manual libre: hash y advertencia de macOS, sin afirmar firma ni notarización de Apple.'
			: `Estado actual: ${signature.status}; la auditoría de distribución manual no puede validar el artefacto.`,
	'reports/napo-macos-signature.json',
);

add(
	'institutional-knowledge-source',
	'pending',
	'La transferencia local está probada, pero todavía se requiere una fuente institucional real con revisión humana y jurisdicción documentada.',
	'NAPO_CONOCIMIENTO.md; reports/napo-materialized-planning.json',
);

const failures = requirements.filter(item => item.status === 'fail');
const pending = requirements.filter(item => item.status === 'pending');
const status = failures.length > 0
	? 'fail'
	: pending.length > 0
		? 'technical-accepted-with-external-gates'
		: 'complete';
const report = {
	schemaVersion: 1,
	format: 'napo-completion-audit/v1',
	generatedAt: new Date().toISOString(),
	package: packagePath,
	packageTreeSha256: release.treeSha256,
	distributionMode: manualRisk ? 'manual-risk' : 'manual',
	status,
	technicalPasses: requirements.filter(item => item.status === 'pass').length,
	pendingGates: pending.length,
	failures: failures.length,
	requirements,
	interpretation: status === 'technical-accepted-with-external-gates'
		? 'La base técnica está aceptada para distribución manual libre; la revisión legal y la fuente institucional siguen siendo puertas externas pendientes.'
		: status === 'complete' ? 'Todos los requisitos auditados están cumplidos.' : 'Existe al menos una contradicción técnica que debe corregirse.',
};

const outputDirectory = resolve(outputPath, '..');
if (!existsSync(outputDirectory)) throw new Error(`No existe el directorio de salida: ${outputDirectory}`);
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Auditoría de cierre escrita: ${outputPath}`);
console.log(`Resultado: ${status}; pases=${report.technicalPasses}; pendientes=${report.pendingGates}; fallos=${report.failures}`);
if (requireComplete && status !== 'complete') process.exitCode = 1;
if (failures.length > 0) process.exitCode = 1;

#!/usr/bin/env node

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argument(name, fallback) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function fail(message) {
	console.error(`FALLA cobertura funcional: ${message}`);
	process.exitCode = 1;
}

const packagePath = resolve(root, argument('--package', 'dist/Napo.app'));
const surfacePath = resolve(root, argument('--surface', 'reports/napo-extension-surface-package.json'));
const uiPath = resolve(root, argument('--ui', 'reports/napo-extension-ui-evidence.json'));
const contractsPath = resolve(root, argument('--contracts', 'reports/napo-extension-contracts-package.json'));
const startupPath = resolve(root, argument('--startup', 'reports/napo-extension-startup.json'));
const releasePath = resolve(root, argument('--release', 'reports/napo-release-manifest.json'));
const outputPath = resolve(root, argument('--out', 'reports/napo-extension-functional-coverage.json'));

for (const path of [surfacePath, uiPath, contractsPath, startupPath, releasePath]) {
	if (!existsSync(path)) throw new Error(`no existe la evidencia requerida: ${path}`);
}

const surface = readJson(surfacePath);
const ui = readJson(uiPath);
const contracts = readJson(contractsPath);
const startup = readJson(startupPath);
const release = readJson(releasePath);
const reviewExtensions = surface.extensions.filter((extension) =>
	extension.classification === 'requiere-prueba' && existsSync(join(packagePath, 'Contents', 'Resources', 'app', 'extensions', extension.folder, 'package.json')),
);
const uiByExtension = new Map(ui.observations.map((observation) => [observation.extension, observation]));
const contractsByExtension = new Map(contracts.checks.map((check) => [check.name, check]));
const startupByExtension = new Map(startup.checks.map((check) => [check.name, check]));
const checks = [];

function check(name, ok, detail) {
	checks.push({ name, status: ok ? 'pass' : 'fail', detail });
	if (!ok) fail(`${name}: ${detail}`);
}

const requiredReviewCount = surface.summary['requiere-prueba'];
check('superficie presente', reviewExtensions.length === requiredReviewCount,
	`${reviewExtensions.length}/${requiredReviewCount} extensiones clasificadas como requiere-prueba tienen manifiesto físico`);
check('evidencia UI ligada al release', ui.packageTreeSha256 === release.treeSha256,
	`UI=${ui.packageTreeSha256 ?? 'ausente'}; release=${release.treeSha256 ?? 'ausente'}`);

const extensions = reviewExtensions.map((extension) => {
	const uiObservation = uiByExtension.get(extension.name);
	const contract = contractsByExtension.get(extension.name);
	const startupCheck = startupByExtension.get(extension.name);
	const uiPass = uiObservation?.status === 'pass';
	const contractPass = contract?.status === 'pass' && contract.issueCount === 0;
	const startupPass = Boolean(startupCheck) && Array.isArray(startupCheck.startupErrorLines) && startupCheck.startupErrorLines.length === 0;
	const result = {
		folder: extension.folder,
		name: extension.name,
		packageManifest: `extensions/${extension.folder}/package.json`,
		ui: uiObservation ? { status: uiObservation.status, action: uiObservation.action, marker: uiObservation.marker ?? null } : null,
		contract: contract ? { status: contract.status, issueCount: contract.issueCount, warningCount: contract.warningCount } : null,
		startup: startupCheck ? { status: startupCheck.status, activationObserved: startupCheck.activationObserved, startupErrorLines: startupCheck.startupErrorLines } : null,
		status: uiPass && contractPass && startupPass ? 'pass' : 'fail',
	};
	check(`${extension.name} UI`, uiPass, uiObservation ? `status=${uiObservation.status}` : 'no existe observación UI');
	check(`${extension.name} contrato`, contractPass, contract ? `status=${contract.status}, issues=${contract.issueCount}` : 'no existe comprobación de contrato');
	check(`${extension.name} arranque`, startupPass, startupCheck ? `status=${startupCheck.status}, errores=${startupCheck.startupErrorLines.length}` : 'no existe comprobación de arranque');
	return result;
});

const report = {
	format: 'napo-extension-functional-coverage/v1',
	product: 'Napo',
	package: packagePath,
	packageTreeSha256: release.treeSha256 ?? null,
	scope: 'extensiones clasificadas como requiere-prueba y presentes en el artefacto',
	policy: 'la evidencia funcional refuerza la aceptación; no autoriza retirar extensiones ni sustituye la revisión legal',
	checks,
	extensions,
	limitations: [
		'La UI proviene de evidencia manual ligada al digest; este informe no pretende convertirla en automatización completa de todos los comandos y vistas.',
	'Las advertencias declaradas por contratos opcionales del host o web quedan conservadas y no se convierten en errores.',
	'La revisión legal, firma, notarización y canal de distribución permanecen fuera de esta compuerta.',
	],
	status: process.exitCode ? 'fail' : 'pass',
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia de cobertura funcional escrita: ${outputPath}`);
console.log(`Extensiones cubiertas: ${extensions.length}; fallos: ${extensions.filter((extension) => extension.status !== 'pass').length}`);
if (!process.exitCode) console.log('OK cobertura funcional de extensiones bajo revisión');

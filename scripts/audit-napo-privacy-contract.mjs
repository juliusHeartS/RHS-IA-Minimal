#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'RHS-IA.app'));
const appRoot = join(packagePath, 'Contents', 'Resources', 'app');
const productPath = join(appRoot, 'product.json');
const outputPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-privacy-contract-package.json'));

if (!existsSync(productPath)) {
	throw new Error(`No existe el producto empaquetado: ${productPath}`);
}

const product = JSON.parse(readFileSync(productPath, 'utf8'));
const checks = [];
const findings = [];

function check(name, ok, detail) {
	checks.push({ name, ok, detail });
	if (!ok) findings.push({ severity: 'fail', name, detail });
}

check('telemetría del producto', product.enableTelemetry === false, 'product.json debe fijar enableTelemetry=false');
check('actualización automática', !product.updateUrl && !product.downloadUrl, 'Napo no debe declarar URLs de actualización o descarga automática');
check('documentación LLM automática', product.positronLlmsDocsUrl === '', 'Napo no debe descargar documentación LLM al arrancar');
check('Marketplace', !product.extensionsGallery?.serviceUrl && !product.extensionsGallery?.resourceUrlTemplate && !product.extensionsGallery?.extensionUrlTemplate, 'Napo no debe declarar una galería ni endpoints de instalación');

const extensionsRoot = join(appRoot, 'extensions');
const manifests = existsSync(extensionsRoot)
	? readdirSync(extensionsRoot, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => join(extensionsRoot, entry.name, 'package.json'))
		.filter(existsSync)
		.sort()
	: [];

for (const manifestPath of manifests) {
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	const label = manifest.name || manifestPath;
	check(`${label}: sin instrumentation key`, !Object.hasOwn(manifest, 'aiKey'), 'el manifiesto empaquetado no debe transportar aiKey');
	check(`${label}: telemetría declarativa apagada`, manifest.enableTelemetry !== true, 'el manifiesto empaquetado no puede declarar enableTelemetry=true');
}

// These URLs are retained only as explicit, user-triggered capabilities (for
// example opening a license page or configuring remote development). They are
// recorded so a future build cannot mistake them for mandatory startup
// services. They are not contacted by Napo's startup path.
const explicitUserTriggeredUrls = [
	['licencia', product.licenseUrl],
	['reporte de problemas', product.reportIssueUrl],
	['repositorio Node.js', product.nodejsRepository],
	['webview externo declarado', product.webviewContentExternalBaseUrlTemplate],
	['descarga de servidor remoto declarada', product.serverDownloadUrlTemplate],
].filter(([, value]) => typeof value === 'string' && value.length > 0);

const report = {
	format: 'napo-privacy-contract/v1',
	package: packagePath,
	status: findings.length === 0 ? 'pass' : 'fail',
	checks,
	findings,
	explicitUserTriggeredUrls,
	interpretation: {
		telemetry: 'host-disabled-and-no-packaged-instrumentation-keys',
		externalServices: 'no-mandatory-startup-service; listed URLs are retained only for explicit user actions or desktop/web compatibility',
		staticScope: 'package product manifest and extension manifests',
	},
};

mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia escrita: ${outputPath}`);
console.log(`OK contrato de privacidad: ${manifests.length} manifiestos inspeccionados`);
if (findings.length > 0) {
	for (const finding of findings) console.error(`FAIL ${finding.name}: ${finding.detail}`);
	process.exitCode = 1;
}

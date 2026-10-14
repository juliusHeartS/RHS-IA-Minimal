#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

function argumentValue(name, fallback) {
	const index = process.argv.indexOf(name);
	if (index < 0) {
		return fallback;
	}
	const value = process.argv[index + 1];
	if (!value || value.startsWith('--')) {
		throw new Error(`Falta el valor de ${name}.`);
	}
	return value;
}

const packagePath = resolve(argumentValue('--package', join(root, 'dist', 'Napo.app')));
const packageSkills = join(packagePath, 'Contents', 'Resources', 'app', 'extensions', 'rhs-agent4', 'assets', 'skills');
const integratedSkills = join(root, 'extensions', 'rhs-agent4', 'assets', 'skills');
const outputPath = resolve(argumentValue('--out', join(root, 'reports', 'napo-capability-surface.json')));

const requiredCapabilities = [
	{
		name: 'analytical-programming-r-python',
		purpose: 'programación analítica, transformaciones, visualización y simulaciones con R/Python',
		markers: ['simulación', 'reproducción', 'R o Python'],
	},
	{
		name: 'predictive-modeling-r',
		purpose: 'modelado predictivo reproducible con R',
		markers: ['tidymodels', 'Dividir entrenamiento y test', 'semillas'],
	},
	{
		name: 'quarto-authoring',
		purpose: 'documentos y resultados reproducibles con Quarto',
		markers: ['.qmd', 'salida reproducible', 'Renderizar'],
	},
	{
		name: 'report',
		purpose: 'informes y notebooks reproducibles',
		markers: ['.qmd', '.ipynb', 'sesión limpia'],
	},
	{
		name: 'grounded-citations',
		purpose: 'afirmaciones sustentadas para política y planificación',
		markers: ['policy', 'planning', 'evidence'],
	},
	{
		name: 'capibara-rag-query',
		purpose: 'recuperación trazable desde conocimiento institucional y local',
		markers: ['RAG', 'fuentes', 'chunks-only'],
	},
	{
		name: 'build-okf',
		purpose: 'conocimiento local y RAG gobernados',
		markers: ['CORE', 'LOCAL', 'rhs-okf verify'],
	},
	{
		name: 'national-health-workforce-accounts',
		purpose: 'modelos y planificación con datos institucionales CNPS/NHWA',
		markers: ['paho_nhwa', 'cnps_ops', 'planificadores'],
	},
];

function listFiles(directory) {
	if (!existsSync(directory)) {
		return [];
	}
	const files = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...listFiles(entryPath));
		} else if (entry.isFile()) {
			files.push(entryPath);
		}
	}
	return files.sort();
}

function sha256(filePath) {
	return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function digestTree(directory) {
	const files = listFiles(directory).map(filePath => ({
		relative: relative(directory, filePath),
		sha256: sha256(filePath),
		size: statSync(filePath).size,
	}));
	const treeSha256 = createHash('sha256').update(JSON.stringify(files)).digest('hex');
	return { files, treeSha256 };
}

function inspectCapability(capability) {
	const integratedDirectory = join(integratedSkills, capability.name);
	const packageDirectory = join(packageSkills, capability.name);
	const integrated = digestTree(integratedDirectory);
	const packaged = digestTree(packageDirectory);
	const sourceSkill = join(integratedDirectory, 'SKILL.md');
	const packageSkill = join(packageDirectory, 'SKILL.md');
	const sourceText = existsSync(sourceSkill) ? readFileSync(sourceSkill, 'utf8') : '';
	const packageText = existsSync(packageSkill) ? readFileSync(packageSkill, 'utf8') : '';
	const sourceMarkers = capability.markers.filter(marker => sourceText.includes(marker));
	const packageMarkers = capability.markers.filter(marker => packageText.includes(marker));
	const sameFiles = JSON.stringify(integrated.files) === JSON.stringify(packaged.files);
	const sameDigest = integrated.treeSha256 === packaged.treeSha256;
	const markersPresent = sourceMarkers.length === capability.markers.length && packageMarkers.length === capability.markers.length;
	return {
		name: capability.name,
		purpose: capability.purpose,
		status: sameFiles && sameDigest && markersPresent ? 'pass' : 'fail',
		integrated: {
			exists: existsSync(integratedDirectory),
			fileCount: integrated.files.length,
			treeSha256: integrated.treeSha256,
			markers: sourceMarkers,
		},
		packaged: {
			exists: existsSync(packageDirectory),
			fileCount: packaged.files.length,
			treeSha256: packaged.treeSha256,
			markers: packageMarkers,
		},
		filesMatch: sameFiles,
		digestMatch: sameDigest,
		markersMatch: markersPresent,
	};
}

if (!existsSync(packagePath)) {
	throw new Error(`No existe el paquete de Napo: ${packagePath}`);
}

const capabilities = requiredCapabilities.map(inspectCapability);
const failures = capabilities.filter(capability => capability.status !== 'pass');
const report = {
	format: 'napo-capability-surface/v1',
	generatedAt: 'deterministic',
	product: 'Napo',
	package: packagePath,
	sourceRoot: integratedSkills,
	packageRoot: packageSkills,
	policy: 'las capacidades se transfieren desde Capibara; esta auditoría no modifica su código',
	requiredCapabilities: capabilities.length,
	passedCapabilities: capabilities.length - failures.length,
	failedCapabilities: failures.length,
	status: failures.length === 0 ? 'pass' : 'fail',
	capabilities,
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

for (const capability of capabilities) {
	console.log(`${capability.status === 'pass' ? 'OK' : 'FAIL'} ${capability.name}: ${capability.purpose}`);
}
console.log(`Capacidades comprobadas: ${capabilities.length}`);
console.log(`Capacidades aprobadas: ${report.passedCapabilities}`);
console.log(`Reporte: ${outputPath}`);

if (failures.length > 0) {
	process.exitCode = 1;
}

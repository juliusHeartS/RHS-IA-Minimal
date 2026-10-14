#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = resolve(root, '..', 'RHS-IA');
const destinationRoot = root;

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

const reportPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-data-extension-integrity.json'));

const extensions = [
	'positron-python',
	'positron-r',
	'positron-connections',
	'positron-data-driver-duckdb',
	'positron-data-driver-pins',
	'positron-data-driver-postgresql',
	'positron-data-driver-redshift',
	'positron-data-driver-sqlite',
	'positron-duckdb',
	'positron-environment',
	'positron-environment-modules',
	'positron-notebooks',
	'positron-code-cells',
	'positron-viewer',
	'positron-supervisor',
	'positron-reticulate',
	'positron-run-app',
];

const expectedPackagingDifferences = [
	/^positron-python\/(?:\.gitignore|\.vscodeignore)$/,
	/^positron-python\/python_files\/posit\/positron\/_vendor\//,
	/^positron-supervisor\/(?:package\.json|positron\.json)$/,
	/\/tsconfig\.tsbuildinfo$/,
];

function walk(directory) {
	const files = new Map();
	const ignoredDirectories = new Set(['node_modules', 'dist', 'out', 'build', 'l10n', '__pycache__', '.git', 'ark', 'python-env-tools', 'resources']);
	if (!existsSync(directory)) {
		return files;
	}
	function visit(current) {
		for (const entry of readdirSync(current, { withFileTypes: true })) {
			const fullPath = join(current, entry.name);
			if (entry.isDirectory()) {
				if (ignoredDirectories.has(entry.name)) {
					continue;
				}
				visit(fullPath);
			} else if (entry.isFile()) {
				const relativePath = relative(directory, fullPath).split('\\').join('/');
				files.set(relativePath, createHash('sha256').update(readFileSync(fullPath)).digest('hex'));
			}
		}
	}
	visit(directory);
	return files;
}

function isExpected(relativePath) {
	return expectedPackagingDifferences.some(pattern => pattern.test(relativePath));
}

const report = {
	format: 'napo-data-extension-integrity/v1',
	sourceRoot,
	destinationRoot,
	baseline: 'RHS-IA',
	policy: 'functional source code must match RHS-IA; packaging metadata and generated/transfer assets are reported separately',
	extensions: [],
	codeMismatches: [],
	packagingDifferences: [],
	missingExtensions: [],
};

for (const extension of extensions) {
	const source = join(sourceRoot, 'extensions', extension);
	const destination = join(destinationRoot, 'extensions', extension);
	if (!existsSync(source) || !existsSync(destination)) {
		report.missingExtensions.push(extension);
		continue;
	}

	const sourceFiles = walk(source);
	const destinationFiles = walk(destination);
	const paths = new Set([...sourceFiles.keys(), ...destinationFiles.keys()]);
	const extensionReport = { extension, sourceFiles: sourceFiles.size, destinationFiles: destinationFiles.size, mismatches: [] };
	for (const path of [...paths].sort()) {
		if (sourceFiles.get(path) === destinationFiles.get(path)) {
			continue;
		}
		const item = { extension, path, sourceSha256: sourceFiles.get(path) ?? null, destinationSha256: destinationFiles.get(path) ?? null };
		extensionReport.mismatches.push(item);
		if (isExpected(`${extension}/${path}`)) {
			report.packagingDifferences.push(item);
		} else {
			report.codeMismatches.push(item);
		}
	}
	report.extensions.push(extensionReport);
}

report.status = report.missingExtensions.length === 0 && report.codeMismatches.length === 0 ? 'pass' : 'fail';
mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Inventario escrito: ${reportPath}`);
console.log(`Extensiones comparadas: ${report.extensions.length}`);
console.log(`Diferencias funcionales: ${report.codeMismatches.length}`);
console.log(`Diferencias de empaquetado/artefactos: ${report.packagingDifferences.length}`);

if (report.missingExtensions.length > 0) {
	console.error(`FALLA: faltan extensiones de la línea base: ${report.missingExtensions.join(', ')}`);
}
if (report.codeMismatches.length > 0) {
	console.error('FALLA: se detectaron diferencias funcionales en extensiones de análisis de datos.');
}
if (report.status !== 'pass') {
	process.exit(1);
}

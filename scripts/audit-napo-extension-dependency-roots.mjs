#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { collectExtensionDependencyRoots, allowedExtensionDependencyRoots, unexpectedExtensionDependencyRoots } from './napo-extension-dependency-policy.mjs';

const root = resolve(import.meta.dirname, '..');
function argument(name, fallback) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

const packagePath = resolve(argument('--package', join(root, 'dist', 'Napo.app')));
const packageAppRoot = resolve(packagePath, 'Contents', 'Resources', 'app');
const outputPath = resolve(root, argument('--out', 'reports/napo-extension-dependency-roots.json'));
if (!existsSync(packageAppRoot)) {
	console.error(`No existe el app root de Napo: ${packageAppRoot}`);
	process.exit(1);
}

const observedRoots = collectExtensionDependencyRoots(packageAppRoot);
const unexpectedRoots = unexpectedExtensionDependencyRoots(observedRoots);
const report = {
	schemaVersion: 1,
	format: 'napo-extension-dependency-roots/v1',
	package: packagePath,
	policy: 'solo se permiten raíces runtime declaradas para extensiones integradas; no se aceptan árboles nuevos sin revisión',
	allowedRoots: [...allowedExtensionDependencyRoots],
	observedRoots,
	unexpectedRoots,
	status: unexpectedRoots.length === 0 ? 'pass' : 'fail',
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Reporte: ${outputPath}`);
console.log(`Raíces observadas: ${observedRoots.length}; no declaradas: ${unexpectedRoots.length}`);
if (unexpectedRoots.length > 0) {
	console.error(`FALLA: raíces no declaradas: ${unexpectedRoots.join(', ')}`);
	process.exit(1);
}
console.log('OK raíces runtime de extensiones declaradas');

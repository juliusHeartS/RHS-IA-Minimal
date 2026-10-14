#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

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

const manifestPath = resolve(argumentValue('--manifest', join(root, 'reports', 'napo-release-manifest.json')));
const outputPath = resolve(argumentValue('--out', join(root, 'reports', 'napo-document-consistency.json')));

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function normalizeCount(value) {
	return Number(value.replaceAll('.', '').replaceAll(',', ''));
}

function isHistoricalHeading(line) {
	return /^#{1,6}\s/.test(line) && /históric|historical|superad|legacy|historial/i.test(line);
}

function inspectDocument(relativePath, { requireCount, requireLegalCount }) {
	const path = join(root, relativePath);
	if (!existsSync(path)) {
		return {
			path: relativePath,
			status: 'fail',
			detail: 'El documento canónico no existe.',
		};
	}

	const text = readFileSync(path, 'utf8');
	const lines = text.split(/\r?\n/);
	let historicalHeadingLevel;
	const activeCountMismatches = [];
	const activeLegalCountMismatches = [];
	for (const [index, line] of lines.entries()) {
		const heading = line.match(/^(#{1,6})\s/);
		if (heading) {
			const headingLevel = heading[1].length;
			if (historicalHeadingLevel !== undefined && headingLevel <= historicalHeadingLevel) {
				historicalHeadingLevel = undefined;
			}
			if (historicalHeadingLevel === undefined && isHistoricalHeading(line)) {
				historicalHeadingLevel = headingLevel;
			}
		}
		if (historicalHeadingLevel !== undefined) {
			continue;
		}
		if (requireLegalCount) {
			const legalMatch = line.match(/(\d[\d.,]*)\s+archivos legales con hash/i);
			if (legalMatch && expectedLegalFileCount !== undefined && normalizeCount(legalMatch[1]) !== expectedLegalFileCount) {
				activeLegalCountMismatches.push({ line: index + 1, value: legalMatch[1], text: line.trim() });
			}
		}
		if (!/manifiesto\s+(?:vigente|canónico|de release)|release técnico|digest\s+(?:vigente|actual|canónico)/i.test(line) || !/archivos/i.test(line)) {
			continue;
		}
		const match = line.match(/(\d[\d.,]*)\s+archivos/);
		if (match && normalizeCount(match[1]) !== expectedFileCount) {
			activeCountMismatches.push({ line: index + 1, value: match[1], text: line.trim() });
		}
	}

	const hasDigest = text.includes(expectedDigest);
	const hasCount = text.includes(expectedCountLabel);
	const failures = [];
	if (!hasDigest) {
		failures.push(`no contiene el digest vigente ${expectedDigest}`);
	}
	if (requireCount && !hasCount) {
		failures.push(`no contiene el conteo vigente ${expectedCountLabel}`);
	}
	if (activeCountMismatches.length > 0) {
		failures.push(`contiene ${activeCountMismatches.length} conteo(s) activo(s) distinto(s) del manifiesto`);
	}
	if (requireLegalCount && expectedLegalFileCount === undefined) {
		failures.push('no existe un inventario legal generado para comprobar el conteo de archivos legales');
	}
	if (activeLegalCountMismatches.length > 0) {
		failures.push(`contiene ${activeLegalCountMismatches.length} conteo(s) legal(es) activo(s) distinto(s) del inventario`);
	}
	return {
		path: relativePath,
		status: failures.length === 0 ? 'pass' : 'fail',
		detail: failures.length === 0 ? 'Digest y conteo vigentes reconciliados.' : failures.join('; '),
		hasDigest,
		hasCount,
		hasLegalCount: requireLegalCount ? text.includes(`${expectedLegalFileCount} archivos legales con hash`) : undefined,
		activeCountMismatches,
		activeLegalCountMismatches,
	};
}

let manifest;
try {
	manifest = readJson(manifestPath);
} catch (error) {
	console.error(`ERROR no se pudo leer el manifiesto: ${error instanceof Error ? error.message : String(error)}`);
	process.exitCode = 1;
	process.exit();
}

const expectedFileCount = manifest.fileCount;
const expectedCountLabel = expectedFileCount.toLocaleString('de-DE').replaceAll(',', '.');
const expectedDigest = manifest.treeSha256;
let expectedLegalFileCount;
const legalInventoryPath = join(root, 'reports', 'napo-license-inventory-package.json');
if (existsSync(legalInventoryPath)) {
	const legalInventory = readJson(legalInventoryPath);
	if (Array.isArray(legalInventory.legalFiles)) {
		expectedLegalFileCount = legalInventory.legalFiles.length;
	}
}
const documents = [
	{ path: 'README.md', requireCount: true, requireLegalCount: false },
	{ path: 'AUDITORIA_CIERRE_NAPO.md', requireCount: true, requireLegalCount: true },
	{ path: 'MATRIZ_HOST_CAPIBARA.md', requireCount: true, requireLegalCount: false },
	{ path: 'PLAN_TRABAJO_RHS_IA_MINIMAL.md', requireCount: true, requireLegalCount: false },
	{ path: 'MATRIZ_CUMPLIMIENTO_NAPO.md', requireCount: false, requireLegalCount: true },
	{ path: 'ENTRADAS_PENDIENTES_NAPO.md', requireCount: false, requireLegalCount: false },
	{ path: 'PERFIL_NAPO_MINIMAL.md', requireCount: true, requireLegalCount: false },
	{ path: 'AUDITORIA_LEGAL_NAPO.md', requireCount: true, requireLegalCount: true },
];

const checks = documents.map(document => inspectDocument(document.path, document));
const failures = checks.filter(check => check.status === 'fail');
const report = {
	schemaVersion: 1,
	format: 'napo-document-consistency/v1',
	product: 'Napo',
	manifest: {
		path: manifestPath,
		fileCount: expectedFileCount,
		treeSha256: expectedDigest,
	},
	legalInventory: {
		path: legalInventoryPath,
		legalFileCount: expectedLegalFileCount,
	},
	status: failures.length === 0 ? 'pass' : 'fail',
	checks,
	interpretation: failures.length === 0
		? 'Los documentos canónicos distinguen el estado vigente de los addenda históricos y están ligados al manifiesto actual.'
		: 'Hay referencias documentales vigentes que no coinciden con el manifiesto actual.',
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Auditoría de consistencia documental escrita: ${outputPath}`);
console.log(`Resultado: ${report.status}; documentos=${checks.length}; fallos=${failures.length}`);
if (failures.length > 0) {
	process.exitCode = 1;
}

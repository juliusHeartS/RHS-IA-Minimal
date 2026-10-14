#!/usr/bin/env node

import { existsSync, lstatSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateKnowledgeManifest } from './validate-napo-knowledge-source.mjs';

const modulePath = fileURLToPath(import.meta.url);
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argument(name, fallback) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

function isManifest(name) {
	return name.endsWith('.source.json');
}

function listManifestPaths(directory, output = []) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = resolve(directory, entry.name);
		if (entry.isSymbolicLink()) continue;
		if (entry.isDirectory()) listManifestPaths(path, output);
		else if (entry.isFile() && isManifest(entry.name)) output.push(path);
	}
	return output.sort();
}

export function auditKnowledgeRoot({ knowledgeRoot, requireApproved = false }) {
	const rootPath = resolve(knowledgeRoot);
	if (!existsSync(rootPath) || !lstatSync(rootPath).isDirectory()) {
		throw new Error(`no existe la raíz de conocimiento: ${rootPath}`);
	}

	const manifestPaths = listManifestPaths(rootPath);
	const entries = manifestPaths.map((manifestPath) => {
		const result = validateKnowledgeManifest({ manifestPath, root: rootPath, requireApproved });
		return {
			manifestPath: relative(rootPath, manifestPath).split(sep).join('/'),
			id: result.manifest?.id ?? null,
			version: result.manifest?.version ?? null,
			jurisdiction: result.manifest?.jurisdiction ?? null,
			reviewStatus: result.manifest?.reviewStatus ?? null,
			ok: result.ok,
			usableForPlanning: result.usableForPlanning,
			errors: result.errors,
		};
	});

	const keyCounts = new Map();
	for (const entry of entries) {
		if (!entry.id || !entry.version || !entry.jurisdiction) continue;
		const key = `${entry.id}\u0000${entry.version}\u0000${entry.jurisdiction}`;
		keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
	}
	const duplicateKeys = [...keyCounts.entries()]
		.filter(([, count]) => count > 1)
		.map(([key, count]) => ({ key: key.split('\u0000'), count }));
	if (duplicateKeys.length > 0) {
		for (const entry of entries) {
			const key = entry.id && entry.version && entry.jurisdiction
				? `${entry.id}\u0000${entry.version}\u0000${entry.jurisdiction}`
				: null;
			if (key && keyCounts.get(key) > 1) entry.errors.push('identidad id/version/jurisdiction duplicada en la raíz');
			if (entry.errors.length > 0) entry.ok = false;
			entry.usableForPlanning = entry.ok && entry.reviewStatus === 'approved';
		}
	}

	const summary = {
		total: entries.length,
		valid: entries.filter((entry) => entry.ok).length,
		invalid: entries.filter((entry) => !entry.ok).length,
		approved: entries.filter((entry) => entry.ok && entry.reviewStatus === 'approved').length,
		pendingHumanReview: entries.filter((entry) => entry.reviewStatus === 'pending-human-review').length,
		rejected: entries.filter((entry) => entry.reviewStatus === 'rejected').length,
		usableForPlanning: entries.filter((entry) => entry.usableForPlanning).length,
		duplicateIdentities: duplicateKeys.length,
	};
	return {
		format: 'napo-knowledge-bundle-audit/v1',
		root: rootPath,
		requireApproved,
		policy: 'la auditoría es local y determinista; no descarga sourceUri, no infiere autoridad o licencia y no convierte una fuente en jurídicamente válida',
		summary,
		duplicateIdentities: duplicateKeys,
		entries,
		status: summary.invalid === 0 && (!requireApproved || summary.pendingHumanReview === 0) ? 'pass' : 'fail',
	};
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(modulePath)) {
	const knowledgeRoot = argument('--root');
	if (!knowledgeRoot) {
		console.error('Uso: node scripts/audit-napo-knowledge-bundle.mjs --root PATH [--out PATH] [--require-approved]');
		process.exit(2);
	}
	const report = auditKnowledgeRoot({
		knowledgeRoot,
		requireApproved: process.argv.includes('--require-approved'),
	});
	const outputPath = resolve(root, argument('--out', 'reports/napo-knowledge-bundle-audit.json'));
	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
	console.log(`Auditoría de paquete de conocimiento escrita: ${outputPath}`);
	console.log(`Fuentes: ${report.summary.total}; válidas: ${report.summary.valid}; aprobadas: ${report.summary.approved}; utilizables: ${report.summary.usableForPlanning}`);
	if (report.summary.duplicateIdentities > 0) console.error(`FALLA: identidades duplicadas: ${report.summary.duplicateIdentities}`);
	if (report.status !== 'pass') {
		console.error(`FALLA: el paquete de conocimiento no cumple la política${report.requireApproved ? ' de aprobación humana' : ''}`);
		process.exit(1);
	}
	console.log('OK paquete de conocimiento');
}

#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const modulePath = fileURLToPath(import.meta.url);

export function sha256(filePath) {
	return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function isValidCalendarDate(value) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isInside(rootPath, candidatePath) {
	return candidatePath === rootPath || candidatePath.startsWith(`${rootPath}${sep}`);
}

function safeRealpath(filePath) {
	try {
		return realpathSync(filePath);
	} catch {
		return null;
	}
}

export function validateKnowledgeManifest({ manifestPath, root = dirname(manifestPath), requireApproved = false }) {
	const errors = [];
	let manifest;
	try {
		manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	} catch (error) {
		return { ok: false, usableForPlanning: false, errors: [`no se pudo leer el manifiesto: ${error.message}`] };
	}

	if (manifest.schemaVersion !== 1) errors.push('schemaVersion debe ser 1');
	const required = ['id', 'version', 'jurisdiction', 'authority', 'effectiveDate', 'sourceUri', 'contentPath', 'contentSha256', 'reviewStatus', 'licenseRef'];
	for (const field of required) {
		if (typeof manifest[field] !== 'string' || manifest[field].trim() === '') errors.push(`falta ${field}`);
	}
	if (!isValidCalendarDate(manifest.effectiveDate)) errors.push('effectiveDate debe ser una fecha calendario válida YYYY-MM-DD');
	if (!/^[a-f0-9]{64}$/.test(manifest.contentSha256 || '')) errors.push('contentSha256 no es SHA-256 hexadecimal');
	if (!['pending-human-review', 'approved', 'rejected'].includes(manifest.reviewStatus)) errors.push('reviewStatus inválido');
	if (manifest.reviewStatus === 'approved') {
		if (typeof manifest.reviewedBy !== 'string' || manifest.reviewedBy.trim() === '') errors.push('una fuente aprobada requiere reviewedBy');
		if (typeof manifest.reviewedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(manifest.reviewedAt) || Number.isNaN(Date.parse(manifest.reviewedAt))) errors.push('una fuente aprobada requiere reviewedAt ISO');
	}
	if (manifest.reviewStatus === 'rejected') errors.push('la fuente está rechazada');

	const rootPath = resolve(root);
	const rootRealPath = safeRealpath(rootPath);
	const manifestAbsolutePath = resolve(manifestPath);
	const manifestRealPath = safeRealpath(manifestAbsolutePath);
	if (!rootRealPath) errors.push('no existe la raíz de conocimiento autorizada');
	if (rootRealPath && manifestRealPath && !isInside(rootRealPath, manifestRealPath)) errors.push('el manifiesto debe permanecer dentro de la raíz de conocimiento');

	const contentPath = manifest.contentPath && !isAbsolute(manifest.contentPath) ? resolve(rootPath, manifest.contentPath) : null;
	if (manifest.contentPath && isAbsolute(manifest.contentPath)) {
		errors.push('contentPath debe ser relativo a la raíz de conocimiento');
	}
	if (contentPath && rootRealPath && !isInside(rootPath, contentPath)) {
		errors.push('contentPath debe permanecer dentro de la raíz de conocimiento');
	} else if (contentPath && !existsSync(contentPath)) {
		errors.push(`no existe el contenido ${manifest.contentPath}`);
	} else if (contentPath) {
		const contentRealPath = safeRealpath(contentPath);
		if (!rootRealPath || !contentRealPath || !isInside(rootRealPath, contentRealPath)) {
			errors.push('el contenido no puede escapar de la raíz autorizada mediante un symlink');
		} else if (!lstatSync(contentRealPath).isFile()) {
			errors.push(`el contenido no es un archivo regular ${manifest.contentPath}`);
		} else if (sha256(contentRealPath) !== manifest.contentSha256) {
			errors.push(`hash de contenido no coincide para ${manifest.contentPath}`);
		}
	}

	if (requireApproved && manifest.reviewStatus !== 'approved') errors.push('la fuente requiere revisión humana aprobada antes de usarse para planificación');
	return {
		ok: errors.length === 0,
		usableForPlanning: errors.length === 0 && manifest.reviewStatus === 'approved',
		errors,
		manifest,
		contentPath: contentPath ? relative(rootPath, contentPath).split(sep).join('/') : null,
	};
}

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(modulePath)) {
	const manifestPath = argumentValue('--manifest');
	if (!manifestPath) {
		console.error('Uso: node scripts/validate-napo-knowledge-source.mjs --manifest PATH [--root PATH] [--require-approved]');
		process.exit(2);
	}
	const result = validateKnowledgeManifest({
		manifestPath: resolve(manifestPath),
		root: resolve(argumentValue('--root') || dirname(resolve(manifestPath))),
		requireApproved: process.argv.includes('--require-approved'),
	});
	console.log(JSON.stringify(result, null, 2));
	if (!result.ok) process.exit(1);
}

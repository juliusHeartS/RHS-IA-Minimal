#!/usr/bin/env node

import {
	copyFileSync,
	existsSync,
	lstatSync,
	mkdirSync,
	readFileSync,
	realpathSync,
	renameSync,
	writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditKnowledgeRoot } from './audit-napo-knowledge-bundle.mjs';
import { sha256, validateKnowledgeManifest } from './validate-napo-knowledge-source.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argument(name, fallback) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

function relativePosix(base, path) {
	return relative(base, path).split(sep).join('/');
}

function writeJsonAtomic(path, value) {
	const temporaryPath = `${path}.tmp-${process.pid}-${Date.now()}`;
	writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
	renameSync(temporaryPath, path);
}

function isInside(rootPath, candidatePath) {
	return candidatePath === rootPath || candidatePath.startsWith(`${rootPath}${sep}`);
}

function safeTarget(basePath, relativePath, containmentBasePath = basePath) {
	if (!relativePath || relativePath.startsWith('/') || relativePath.split('/').includes('..')) {
		throw new Error(`ruta de destino no relativa y segura: ${relativePath}`);
	}
	const resolvedBasePath = resolve(basePath);
	const containmentBase = resolve(containmentBasePath);
	const target = resolve(resolvedBasePath, relativePath);
	if (!isInside(resolvedBasePath, target) || !isInside(containmentBase, target)) throw new Error(`ruta de destino fuera de la raíz: ${relativePath}`);
	let existingAncestor = target;
	while (!existsSync(existingAncestor) && existingAncestor !== containmentBase) existingAncestor = dirname(existingAncestor);
	const baseRealPath = realpathSync(containmentBase);
	const ancestorRealPath = realpathSync(existingAncestor);
	if (!isInside(baseRealPath, ancestorRealPath)) throw new Error(`ruta de destino escapa mediante symlink: ${relativePath}`);
	return target;
}

function describeFile(sourcePath, targetPath, sourceRoot, destinationRoot) {
	const sourceStat = lstatSync(sourcePath);
	if (!sourceStat.isFile()) throw new Error(`la fuente no es un archivo regular: ${sourcePath}`);
	const targetRelative = relativePosix(destinationRoot, targetPath);
	let action = 'create';
	if (existsSync(targetPath)) {
		const targetStat = lstatSync(targetPath);
		if (!targetStat.isFile() || targetStat.isSymbolicLink()) {
			throw new Error(`colisión insegura en destino: ${targetRelative}`);
		}
		action = sha256(targetPath) === sha256(sourcePath) ? 'unchanged' : 'conflict';
	}
	return {
		sourcePath: relativePosix(sourceRoot, sourcePath),
		destinationPath: targetRelative,
		size: sourceStat.size,
		sha256: sha256(sourcePath),
		action,
	};
}

function buildReport({ knowledgeRoot, workspace, destination, receipt, apply }) {
	const audit = auditKnowledgeRoot({ knowledgeRoot, requireApproved: true });
	const destinationRoot = safeTarget(workspace, destination);
	const receiptPath = safeTarget(workspace, receipt);
	const report = {
		format: 'napo-knowledge-materialization/v1',
		product: 'Napo',
		policy: 'solo materializa fuentes aprobadas y verificadas localmente; nunca sigue sourceUri ni descarga contenido',
		knowledgeRoot,
		workspace,
		destination,
		receipt,
		requireApproved: true,
		apply,
		status: 'fail',
		summary: { sources: audit.summary.total, approved: audit.summary.approved, usableForPlanning: audit.summary.usableForPlanning, files: 0, create: 0, unchanged: 0, conflicts: 0 },
		sources: [],
		files: [],
		errors: [],
	};
	if (existsSync(receiptPath)) {
		const receiptStat = lstatSync(receiptPath);
		if (!receiptStat.isFile() || receiptStat.isSymbolicLink()) {
			report.errors.push('el recibo existente no es un archivo regular y no será sobrescrito');
			return report;
		}
	}

	if (audit.status !== 'pass') {
		report.errors.push('la raíz no cumple la política de fuentes aprobadas');
		for (const entry of audit.entries.filter((item) => !item.ok || !item.usableForPlanning)) {
			report.errors.push(`${entry.manifestPath}: ${entry.errors.join('; ') || 'fuente no utilizable para planificación'}`);
		}
		return report;
	}
	if (audit.summary.total === 0) {
		report.errors.push('la raíz no contiene manifiestos *.source.json');
		return report;
	}

	const targetOwners = new Map();
	for (const entry of audit.entries) {
		const manifestPath = resolve(knowledgeRoot, entry.manifestPath);
		const validation = validateKnowledgeManifest({ manifestPath, root: knowledgeRoot, requireApproved: true });
		if (!validation.ok || !validation.usableForPlanning) {
			report.errors.push(`${entry.manifestPath}: la validación individual no permite materialización`);
			continue;
		}
		const contentPath = resolve(knowledgeRoot, validation.contentPath);
		const targetManifest = safeTarget(destinationRoot, entry.manifestPath, workspace);
		const targetContent = safeTarget(destinationRoot, validation.contentPath, workspace);
		const files = [
			describeFile(manifestPath, targetManifest, knowledgeRoot, destinationRoot),
			describeFile(contentPath, targetContent, knowledgeRoot, destinationRoot),
		];
		for (const file of files) {
			const owner = targetOwners.get(file.destinationPath);
			if (owner && owner !== file.sha256) report.errors.push(`dos fuentes producen el mismo destino con contenido distinto: ${file.destinationPath}`);
			targetOwners.set(file.destinationPath, file.sha256);
		}
		report.sources.push({
			id: validation.manifest.id,
			version: validation.manifest.version,
			jurisdiction: validation.manifest.jurisdiction,
			authority: validation.manifest.authority,
			effectiveDate: validation.manifest.effectiveDate,
			reviewStatus: validation.manifest.reviewStatus,
			reviewedBy: validation.manifest.reviewedBy ?? null,
			reviewedAt: validation.manifest.reviewedAt ?? null,
			licenseRef: validation.manifest.licenseRef,
			manifestPath: entry.manifestPath,
			contentPath: validation.contentPath,
			contentSha256: validation.manifest.contentSha256,
		});
		report.files.push(...files);
	}

	report.summary.files = report.files.length;
	report.summary.create = report.files.filter((file) => file.action === 'create').length;
	report.summary.unchanged = report.files.filter((file) => file.action === 'unchanged').length;
	report.summary.conflicts = report.files.filter((file) => file.action === 'conflict').length;
	if (report.summary.conflicts > 0) report.errors.push('existen colisiones de contenido en el workspace; no se sobrescribirá ningún archivo');
	if (report.errors.length === 0) report.status = 'ready';
	report.receiptPath = relativePosix(workspace, receiptPath);
	return report;
}

const knowledgeRootArgument = argument('--root');
const workspaceArgument = argument('--workspace');
const destination = argument('--destination', 'Docs');
const receipt = argument('--receipt', '.napo/knowledge/materialization.json');
const outputPath = resolve(root, argument('--out', 'reports/napo-knowledge-materialization.json'));
const apply = process.argv.includes('--apply');
const requireApproved = process.argv.includes('--require-approved');

if (!knowledgeRootArgument || !workspaceArgument) {
	console.error('Uso: node scripts/prepare-napo-knowledge-bundle.mjs --root PATH --workspace PATH --require-approved [--apply] [--destination Docs] [--out PATH]');
	process.exit(2);
}
const knowledgeRoot = resolve(knowledgeRootArgument);
const workspace = resolve(workspaceArgument);
if (!requireApproved) {
	console.error('FALTA --require-approved: Napo nunca materializa una fuente pendiente.');
	process.exit(2);
}
if (!existsSync(knowledgeRoot) || !lstatSync(knowledgeRoot).isDirectory()) {
	console.error(`No existe la raíz de conocimiento: ${knowledgeRoot}`);
	process.exit(1);
}
if (!existsSync(workspace) || !lstatSync(workspace).isDirectory()) {
	console.error(`No existe el workspace: ${workspace}`);
	process.exit(1);
}

let report;
try {
	report = buildReport({ knowledgeRoot, workspace, destination, receipt, apply });
} catch (error) {
	report = {
		format: 'napo-knowledge-materialization/v1', product: 'Napo', policy: 'solo materializa fuentes aprobadas y verificadas localmente; nunca sigue sourceUri ni descarga contenido', knowledgeRoot, workspace, destination, receipt, requireApproved: true, apply, status: 'fail',
		summary: { sources: 0, approved: 0, usableForPlanning: 0, files: 0, create: 0, unchanged: 0, conflicts: 0 }, sources: [], files: [], errors: [error.message],
	};
}

mkdirSync(dirname(outputPath), { recursive: true });
writeJsonAtomic(outputPath, report);
if (report.status === 'fail') {
	console.error(`FALLA: no se puede materializar el paquete de conocimiento (${report.errors.join(' | ')})`);
	process.exit(1);
}

if (apply) {
	try {
		for (const file of report.files.filter((item) => item.action === 'create')) {
			const sourcePath = resolve(knowledgeRoot, file.sourcePath);
			const targetPath = resolve(workspace, destination, file.destinationPath);
			mkdirSync(dirname(targetPath), { recursive: true });
			copyFileSync(sourcePath, targetPath);
		}
		report.status = 'applied';
		const receiptPath = safeTarget(workspace, receipt);
		mkdirSync(dirname(receiptPath), { recursive: true });
		const appliedReport = { ...report, receiptPath: relativePosix(workspace, receiptPath) };
		writeJsonAtomic(receiptPath, appliedReport);
		writeJsonAtomic(outputPath, appliedReport);
	} catch (error) {
		report.status = 'fail';
		report.errors.push(`la aplicación no se completó: ${error.message}`);
		writeJsonAtomic(outputPath, report);
		console.error(`FALLA: ${report.errors.at(-1)}`);
		process.exit(1);
	}
}

console.log(`${apply ? 'Paquete de conocimiento materializado' : 'Paquete de conocimiento listo para materializar'}: ${report.sources.length} fuente(s), ${report.summary.files} archivo(s)`);
console.log(`Reporte: ${outputPath}`);

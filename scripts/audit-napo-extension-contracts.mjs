#!/usr/bin/env node

import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());

function argumentValue(name) {
	const index = process.argv.indexOf(name);
	return index === -1 ? undefined : process.argv[index + 1];
}

const packagePath = resolve(argumentValue('--package') || join(root, 'dist', 'RHS-IA.app'));
const artifactRoot = join(packagePath, 'Contents', 'Resources', 'app');
const extensionsRoot = join(artifactRoot, 'extensions');
const surfaceReportPath = resolve(argumentValue('--surface-report') || join(root, 'reports', 'napo-extension-surface-package.json'));
const outputPath = resolve(argumentValue('--out') || join(root, 'reports', 'napo-extension-contracts-package.json'));

function readJson(file) {
	try {
		return { value: JSON.parse(readFileSync(file, 'utf8')), error: null };
	} catch (error) {
		return { value: null, error: String(error) };
	}
}

function listManifests() {
	if (!existsSync(extensionsRoot)) return [];
	return readdirSync(extensionsRoot, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => join(extensionsRoot, entry.name, 'package.json'))
		.filter(existsSync)
		.sort();
}

function pathCandidates(extensionRoot, declared) {
	if (typeof declared !== 'string' || declared.length === 0) return [];
	if (/^(?:https?:|data:|command:|vscode-|#)/i.test(declared)) return [];
	const normalized = declared.replace(/^\.\//, '');
	const base = join(extensionRoot, normalized);
	return [
		base,
		`${base}.js`,
		`${base}.mjs`,
		`${base}.cjs`,
		join(base, 'index.js'),
	];
}

function resolveDeclaredPath(extensionRoot, declared) {
	const candidates = pathCandidates(extensionRoot, declared);
	return candidates.find(existsSync) || null;
}

function collectPathDeclaration(value, label, extensionRoot, issues, checked = new Set()) {
	if (typeof value === 'string') {
		const key = `${label}:${value}`;
		if (checked.has(key) || pathCandidates(extensionRoot, value).length === 0) return;
		checked.add(key);
		if (!resolveDeclaredPath(extensionRoot, value)) {
			issues.push(`${label} declara un recurso ausente: ${value}`);
		}
		return;
	}
	if (value && typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) {
			if (['light', 'dark', 'path', 'module', 'entrypoint'].includes(key)) {
				collectPathDeclaration(child, `${label}.${key}`, extensionRoot, issues, checked);
			}
		}
	}
}

function values(object, key) {
	return Array.isArray(object?.[key]) ? object[key] : [];
}

function nestedValues(object, dottedKey) {
	const value = dottedKey.split('.').reduce((current, key) => current?.[key], object);
	return Array.isArray(value) ? value : [];
}

const surfaceResult = readJson(surfaceReportPath);
if (surfaceResult.error) throw new Error(`No se pudo leer el inventario de superficie: ${surfaceResult.error}`);
const reviewedFolders = new Set((surfaceResult.value.extensions || [])
	.filter(extension => extension.recommendation === 'revisar')
	.map(extension => extension.folder));
if (reviewedFolders.size === 0) throw new Error('El inventario de superficie no contiene extensiones bajo revisión.');

const manifests = listManifests();
const allCommands = new Set();
for (const manifestPath of manifests) {
	const result = readJson(manifestPath);
	if (!result.value) continue;
	for (const command of values(result.value.contributes, 'commands')) {
		if (typeof command?.command === 'string') allCommands.add(command.command);
	}
}

const checks = [];
const issues = [];
const warnings = [];
for (const manifestPath of manifests) {
	const folder = manifestPath.split('/').at(-2);
	if (!reviewedFolders.has(folder)) continue;
	const extensionRoot = join(extensionsRoot, folder);
	const result = readJson(manifestPath);
	const manifest = result.value;
	const extensionIssues = [];
	const extensionWarnings = [];
	if (!manifest) {
		extensionIssues.push(`manifiesto ilegible: ${result.error}`);
	} else {
		if (manifest.main && !resolveDeclaredPath(extensionRoot, manifest.main)) {
			extensionIssues.push(`main ausente: ${manifest.main}`);
		}
		if (manifest.browser && !resolveDeclaredPath(extensionRoot, manifest.browser)) {
			// Napo is audited as a macOS desktop package. A browser entrypoint
			// may be intentionally omitted from a desktop artifact.
			extensionWarnings.push(`browser opcional no materializado en el paquete de escritorio: ${manifest.browser}`);
		}
		const contributes = manifest.contributes || {};
		const commands = values(contributes, 'commands');
		const commandIds = new Set();
		for (const command of commands) {
			if (!command || typeof command.command !== 'string' || typeof command.title !== 'string' || command.title.length === 0) {
				extensionIssues.push('cada comando contribuido debe declarar command y title');
				continue;
			}
			if (commandIds.has(command.command)) extensionIssues.push(`comando duplicado: ${command.command}`);
			commandIds.add(command.command);
		}
		for (const [menuId, entries] of Object.entries(contributes.menus || {})) {
			for (const entry of values({ entries }, 'entries')) {
				if (typeof entry?.command === 'string' && !allCommands.has(entry.command)) {
					extensionWarnings.push(`menú ${menuId} referencia ${entry.command}, que no está contribuido por una extensión empaquetada`);
				}
			}
		}
		for (const [containerType, containers] of Object.entries(contributes.viewsContainers || {})) {
			for (const container of values({ containers }, 'containers')) {
				if (!container?.id || !container?.title) extensionIssues.push(`viewsContainers.${containerType} requiere id y title`);
				collectPathDeclaration(container?.icon, `viewsContainers.${containerType}.icon`, extensionRoot, extensionIssues);
			}
		}
		for (const [viewType, views] of Object.entries(contributes.views || {})) {
			for (const view of values({ views }, 'views')) {
				if (!view?.id || !view?.name) extensionIssues.push(`views.${viewType} requiere id y name`);
			}
		}
		for (const grammar of values(contributes, 'grammars')) collectPathDeclaration(grammar?.path, 'grammars.path', extensionRoot, extensionIssues);
		for (const snippet of values(contributes, 'snippets')) collectPathDeclaration(snippet?.path, 'snippets.path', extensionRoot, extensionIssues);
		for (const language of values(contributes, 'languages')) {
			collectPathDeclaration(language?.configuration, 'languages.configuration', extensionRoot, extensionIssues);
			collectPathDeclaration(language?.icon, 'languages.icon', extensionRoot, extensionIssues);
		}
		for (const script of nestedValues(contributes, 'markdown.previewScripts')) collectPathDeclaration(script, 'markdown.previewScripts', extensionRoot, extensionIssues);
		for (const style of nestedValues(contributes, 'markdown.previewStyles')) collectPathDeclaration(style, 'markdown.previewStyles', extensionRoot, extensionIssues);
		for (const renderer of values(contributes, 'notebookRenderer')) collectPathDeclaration(renderer?.entrypoint, 'notebookRenderer.entrypoint', extensionRoot, extensionIssues);
		for (const plugin of nestedValues(contributes, 'markdown.markdownItPlugins')) collectPathDeclaration(plugin?.path, 'markdown.markdownItPlugins.path', extensionRoot, extensionIssues);
		const activationEvents = values(manifest, 'activationEvents');
		const contributedViews = new Set(Object.values(contributes.views || {}).flat().map(view => view?.id).filter(Boolean));
		for (const event of activationEvents) {
			const viewMatch = /^onView:(.+)$/.exec(event);
			if (viewMatch && !contributedViews.has(viewMatch[1])) extensionWarnings.push(`activation event ${event} no tiene una vista declarada localmente`);
		}
	}
	issues.push(...extensionIssues.map(issue => `${folder}: ${issue}`));
	warnings.push(...extensionWarnings.map(warning => `${folder}: ${warning}`));
	checks.push({
		folder,
		name: manifest?.publisher && manifest?.name ? `${manifest.publisher}.${manifest.name}` : null,
		status: extensionIssues.length === 0 ? 'pass' : 'fail',
		issueCount: extensionIssues.length,
		warningCount: extensionWarnings.length,
	});
}

const report = {
	format: 'napo-extension-contracts/v1',
	package: packagePath,
	reviewedExtensionCount: checks.length,
	checks,
	issues,
	warnings,
	status: issues.length === 0 ? 'pass' : 'fail',
	limitations: [
		'La auditoría verifica contratos declarados y recursos empaquetados; no prueba la ejecución de cada comando, vista o flujo de usuario.',
	'Una referencia de menú sin comando local se conserva como advertencia porque puede pertenecer al host o a otra extensión.',
	'La ausencia de errores aquí no sustituye las pruebas UI específicas de las 21 extensiones.',
	],
};

mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Evidencia escrita: ${outputPath}`);
console.log(`Extensiones bajo revisión: ${checks.length}`);
console.log(`Contratos con errores: ${issues.length}`);
console.log(`Advertencias de referencias cruzadas: ${warnings.length}`);
for (const check of checks) console.log(`${check.status === 'pass' ? 'OK' : 'FAIL'} ${check.name || check.folder}`);
if (report.status !== 'pass') process.exit(1);
console.log('OK auditoría de contratos declarados de extensiones');

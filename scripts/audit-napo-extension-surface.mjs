#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
function optionValue(flag) {
	const index = process.argv.indexOf(flag);
	return index === -1 ? null : process.argv[index + 1];
}

const packageArgument = optionValue('--package');
const artifactRoot = packageArgument
	? path.resolve(packageArgument, 'Contents', 'Resources', 'app')
	: root;
const extensionsRoot = path.join(artifactRoot, 'extensions');
const outputPath = path.resolve(optionValue('--out') || path.join(root, 'reports', packageArgument ? 'napo-extension-surface-package.json' : 'napo-extension-surface.json'));

const conservedExact = new Set([
	'juliushearts.rhs-agent4',
	'quarto.quarto',
	'positron.authentication',
	'positron.connections',
	'positron.duckdb',
	'positron.environment',
	'positron.environment-modules',
	'positron.file-transfer',
	'positron.positron-r',
	'positron.positron-python',
	'positron.proxy',
	'positron.r',
	'positron.reticulate',
	'positron.supervisor',
	'positron.viewer',
	'positron.notebooks',
	'positron.code-cells',
	'positron.notebook-export',
	'positron.ipywidgets',
	'vscode.git',
	'vscode.git-base',
	'vscode.github-authentication',
	'vscode.markdown-language-features',
	'vscode.markdown-math',
	'vscode.markdown-basics',
	'vscode.ipynb',
	'vscode.json-language-features',
	'vscode.configuration-editing',
	'vscode.html-language-features',
	'vscode.css-language-features',
	'vscode.typescript-language-features',
	'vscode.references-view',
	'vscode.search-result',
	'vscode.terminal-suggest',
	'vscode.emmet',
]);

const candidateFolderPrefixes = [
	'cpp', 'csharp', 'java', 'go', 'julia', 'rust', 'ruby', 'php', 'perl', 'dart',
	'swift', 'fsharp', 'groovy', 'lua', 'objective-c', 'hlsl', 'razor', 'pug',
	'scss', 'less', 'coffeescript', 'clojure', 'bat', 'powershell', 'shellscript',
	'handlebars', 'typescript-basics', 'java-debug', 'java-test', 'maven', 'gradle',
	'azure-repos', 'github', 'github-actions', 'github-pull-request-github',
	'open-remote-wsl', 'dev-containers', 'configuration-editing', 'extension-editing',
	'js-debug', 'js-debug-companion', 'vscode-js-profile-table', 'docker', 'npm',
	'gulp', 'grunt', 'jake', 'open-remote-ssh', 'tunnel-forwarding',
];

const conservedFolderPrefixes = [
	'positron-data-',
	'positron-environment',
	'positron-notebook',
];

const conservedFolders = new Set([
	'positron-catalog-explorer',
	'positron-code-cells',
	'positron-connections',
	'positron-duckdb',
	'positron-file-transfer',
	'positron-ipywidgets',
	'positron-notebooks',
	'positron-pdf-server',
	'positron-proxy',
	'positron-python',
	'positron-r',
	'positron-reticulate',
	'positron-runtime-debugger',
	'positron-supervisor',
	'positron-viewer',
	'rhs-agent4',
	'quarto.quarto',
	'python',
	'r',
	'sql',
	'ipynb',
	'notebook-renderers',
	'notebook-remote-kernels',
]);

const resourceOnlyLanguages = new Set([
	'css', 'dotenv', 'ini', 'latex', 'log', 'make', 'restructuredtext', 'shaderlab', 'vb', 'xml',
]);

const productContractFolders = new Set([
	'debug-auto-launch', 'debug-server-ready', 'media-preview', 'merge-conflict',
	'mermaid-markdown-features', 'microsoft-authentication', 'next-edit-suggestions',
	'positron-dev-containers', 'positron-run-app', 'positron-skills', 'rhs-ia-documentation',
	'simple-browser',
]);

const developerToolingFolders = new Set([
	'ms-vscode.js-debug', 'ms-vscode.js-debug-companion', 'ms-vscode.vscode-js-profile-table',
]);

function classifySurfaceRole({ folder, activationEvents, contributes }) {
	if (folder.startsWith('theme-') || folder === 'theme-seti') {
		return {
			role: 'theme-resource',
			recommendation: 'aplazar',
			rationale: 'recurso visual sin activación; no participa en R, Python, Quarto ni Capibara',
		};
	}
	if (resourceOnlyLanguages.has(folder)
		&& activationEvents.length === 0
		&& contributes.every(contribution => ['grammars', 'languages', 'snippets'].includes(contribution))) {
		return {
			role: 'language-resource',
			recommendation: 'aplazar',
			rationale: 'gramática o soporte de lenguaje sin activación; no corresponde al perfil R/Python/Markdown/Quarto',
		};
	}
	if (developerToolingFolders.has(folder)) {
		return {
			role: 'developer-tooling',
			recommendation: 'aplazar',
			rationale: 'depuración o profiling de JavaScript, fuera del flujo analítico de Napo',
		};
	}
	if (productContractFolders.has(folder)) {
		return {
			role: 'product-contract',
			recommendation: 'revisar',
			rationale: 'puede participar en el host, Capibara, documentación, preview o proyectos; requiere prueba específica',
		};
	}
	return {
		role: 'host-contract-review',
		recommendation: 'revisar',
		rationale: 'no hay evidencia suficiente para retirar o aplazar este componente del receptor',
	};
}

function readJson(file) {
	try {
		return JSON.parse(fs.readFileSync(file, 'utf8'));
	} catch (error) {
		return { __readError: String(error) };
	}
}

function listManifests() {
	return fs.readdirSync(extensionsRoot, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => path.join(extensionsRoot, entry.name, 'package.json'))
		.filter(fs.existsSync)
		.sort();
}

function folderCandidate(folder) {
	return candidateFolderPrefixes.some(prefix => folder === prefix || folder.startsWith(`${prefix}-`));
}

function folderConserved(folder) {
	return conservedFolders.has(folder) || conservedFolderPrefixes.some(prefix => folder.startsWith(prefix));
}

const extensions = listManifests().map(manifestPath => {
	const manifest = readJson(manifestPath);
	const folder = path.basename(path.dirname(manifestPath));
	const name = manifest.name ? `${manifest.publisher}.${manifest.name}` : null;
	const dependencies = [
		...(Array.isArray(manifest.extensionDependencies) ? manifest.extensionDependencies : []),
		...(Array.isArray(manifest.extensionPack) ? manifest.extensionPack : []),
	].sort();
	const conserved = (name ? conservedExact.has(name) : false) || folderConserved(folder);
	const surfaceRole = classifySurfaceRole({
		folder,
		activationEvents: Array.isArray(manifest.activationEvents) ? manifest.activationEvents : [],
		contributes: manifest.contributes ? Object.keys(manifest.contributes).sort() : [],
	});
	return {
		folder,
		manifest: path.relative(root, manifestPath),
		name,
		version: manifest.version ?? null,
		activationEvents: Array.isArray(manifest.activationEvents) ? manifest.activationEvents : [],
		dependencies,
		contributes: manifest.contributes ? Object.keys(manifest.contributes).sort() : [],
		classification: conserved ? 'conservar' : folderCandidate(folder) ? 'candidata-aplazar' : 'requiere-prueba',
		surfaceRole: surfaceRole.role,
		recommendation: conserved ? 'conservar' : surfaceRole.recommendation,
		reviewRationale: surfaceRole.rationale,
		readError: manifest.__readError ?? null,
	};
});

const knownNames = new Set(extensions.map(extension => extension.name).filter(Boolean));
for (const extension of extensions) {
	extension.unresolvedDependencies = extension.dependencies.filter(dependency => !knownNames.has(dependency));
	extension.dependents = [];
}
for (const extension of extensions) {
	for (const dependency of extension.dependencies) {
		const target = extensions.find(candidate => candidate.name === dependency);
		if (target && extension.name) {
			target.dependents.push(extension.name);
		}
	}
}
for (const extension of extensions) {
	extension.dependents.sort();
	extension.dependencyTopology = extension.unresolvedDependencies.length > 0
		? 'unresolved'
		: extension.dependents.length > 0
			? 'has-dependents'
			: 'no-declared-dependents';
}

const summary = extensions.reduce((accumulator, extension) => {
	accumulator.total += 1;
	accumulator[extension.classification] += 1;
	accumulator.recommendations[extension.recommendation] = (accumulator.recommendations[extension.recommendation] || 0) + 1;
	accumulator.surfaceRoles[extension.surfaceRole] = (accumulator.surfaceRoles[extension.surfaceRole] || 0) + 1;
	if (extension.classification === 'candidata-aplazar' && extension.dependents.length === 0 && extension.unresolvedDependencies.length === 0) {
		accumulator.candidatasAisladas += 1;
	}
	return accumulator;
}, {
	total: 0,
	conservar: 0,
	'candidata-aplazar': 0,
	'requiere-prueba': 0,
	candidatasAisladas: 0,
	recommendations: {},
	surfaceRoles: {},
});

const report = {
	schemaVersion: 1,
	generatedAt: 'deterministic',
	root: path.relative(root, extensionsRoot) || extensionsRoot,
	artifactRoot,
	policy: 'clasificación orientativa; no autoriza eliminar extensiones',
	summary,
	extensions,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Inventario escrito: ${path.relative(root, outputPath)}`);
console.log(`Extensiones: ${summary.total}`);
console.log(`Conservar: ${summary.conservar}`);
console.log(`Candidatas a aplazar: ${summary['candidata-aplazar']}`);
console.log(`Requieren prueba: ${summary['requiere-prueba']}`);
console.log(`Recomendaciones: ${JSON.stringify(summary.recommendations)}`);
console.log(`Roles de superficie: ${JSON.stringify(summary.surfaceRoles)}`);
console.log(`Dependencias no resueltas en manifiesto: ${extensions.filter(extension => extension.unresolvedDependencies.length > 0).length}`);

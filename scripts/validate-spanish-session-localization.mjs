/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import ts from '../node_modules/typescript/lib/typescript.js';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourceRoots = [
	'src/vs/workbench/contrib/positronSession',
	'src/vs/workbench/contrib/positronConsole',
	'src/vs/workbench/contrib/positronVariables',
	'src/vs/workbench/contrib/positronPlots',
	'src/vs/workbench/services/positronConsole',
	'src/vs/workbench/services/positronVariables',
	'src/vs/workbench/services/positronPlots',
	'src/vs/platform/positronActionBar/browser/components/actionBarFilter.tsx',
	'src/vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage',
	'src/vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent.ts',
	'src/vs/workbench/browser/parts/positronTopActionBar',
	'src/vs/workbench/browser/actions/positronActions.ts',
	'src/vs/workbench/browser/parts/editor/workspaceActions.ts',
	'src/vs/workbench/contrib/languageRuntime/browser/languageRuntimeActions.ts',
	'src/vs/workbench/contrib/languageRuntime/common/languageRuntime.ts',
];

const collectFiles = relativePath => {
	const absolutePath = path.join(repositoryRoot, relativePath);
	const stat = fs.statSync(absolutePath);
	if (stat.isFile()) {
		return [relativePath];
	}
	return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap(entry => {
		const childPath = path.join(relativePath, entry.name);
		if (entry.isDirectory()) {
			return entry.name === 'test' ? [] : collectFiles(childPath);
		}
		return /\.(ts|tsx)$/.test(entry.name) && !/\.(test|vitest|integrationTest)\./.test(entry.name) ? [childPath] : [];
	});
};

const getLocalizationKey = (node, sourceFile) => {
	if (ts.isStringLiteralLike(node)) {
		return node.text;
	}
	if (!ts.isObjectLiteralExpression(node)) {
		return undefined;
	}
	const property = node.properties.find(candidate =>
		ts.isPropertyAssignment(candidate) && candidate.name.getText(sourceFile) === 'key'
	);
	return property && ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
		? property.initializer.text
		: undefined;
};

const sourceStrings = new Map();
for (const relativePath of sourceRoots.flatMap(collectFiles).sort()) {
	const absolutePath = path.join(repositoryRoot, relativePath);
	const sourceFile = ts.createSourceFile(relativePath, fs.readFileSync(absolutePath, 'utf8'), ts.ScriptTarget.Latest, true);
	const moduleId = relativePath.replace(/^src\//, '').replace(/\.(ts|tsx)$/, '').replaceAll('\\', '/');
	const moduleStrings = sourceStrings.get(moduleId) ?? new Map();
	const visit = node => {
		if (ts.isCallExpression(node)) {
			const expression = node.expression;
			const name = ts.isIdentifier(expression)
				? expression.text
				: ts.isPropertyAccessExpression(expression) ? expression.name.text : undefined;
			if ((name === 'localize' || name === 'localize2') && node.arguments.length >= 2) {
				const key = getLocalizationKey(node.arguments[0], sourceFile);
				const message = node.arguments[1];
				if (key && ts.isStringLiteralLike(message)) {
					const prior = moduleStrings.get(key);
					if (prior && prior !== message.text) {
						throw new Error(`Conflicting English messages for ${moduleId}:${key}`);
					}
					moduleStrings.set(key, message.text);
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);
	if (moduleStrings.size) {
		sourceStrings.set(moduleId, moduleStrings);
	}
}

const overlayStrings = new Map();
const curatedOverlayStrings = new Map();
// Curated module entries replace session entries; the result overlays generated keys.
for (const [catalogPath, catalogName] of [
	['src/vs/base/node/sp.positron.additional.nls.ts', 'positronAdditionalNlsData'],
	['src/vs/base/node/sp.positron.session.nls.ts', 'positronSessionNlsData'],
	['src/vs/base/node/sp.positron.nls.ts', 'positronCuratedNlsData'],
]) {
	const overlayPath = path.join(repositoryRoot, catalogPath);
	const overlaySource = ts.createSourceFile(overlayPath, fs.readFileSync(overlayPath, 'utf8'), ts.ScriptTarget.Latest, true);
	const catalogStrings = catalogName === 'positronAdditionalNlsData' ? overlayStrings : curatedOverlayStrings;
	for (const statement of overlaySource.statements) {
		if (!ts.isVariableStatement(statement)) {
			continue;
		}
		for (const declaration of statement.declarationList.declarations) {
			if (declaration.name.getText(overlaySource) !== catalogName || !declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
				continue;
			}
			for (const moduleProperty of declaration.initializer.properties) {
				if (!ts.isPropertyAssignment(moduleProperty) || !ts.isStringLiteralLike(moduleProperty.name) || !ts.isObjectLiteralExpression(moduleProperty.initializer)) {
					continue;
				}
				const translations = new Map();
				for (const translationProperty of moduleProperty.initializer.properties) {
					if (ts.isPropertyAssignment(translationProperty) && ts.isStringLiteralLike(translationProperty.name) && ts.isStringLiteralLike(translationProperty.initializer)) {
						translations.set(translationProperty.name.text, translationProperty.initializer.text);
					}
				}
				catalogStrings.set(moduleProperty.name.text, translations);
			}
		}
	}
}
for (const [moduleId, translations] of curatedOverlayStrings) {
	overlayStrings.set(moduleId, new Map([...(overlayStrings.get(moduleId) ?? []), ...translations]));
}

const placeholderPattern = /\{\d+\}/g;
const placeholders = value => [...value.matchAll(placeholderPattern)].map(match => match[0]).sort().join(',');
const errors = [];
let checkedCoreKeys = 0;
for (const [moduleId, strings] of sourceStrings) {
	const translations = overlayStrings.get(moduleId);
	for (const [key, english] of strings) {
		checkedCoreKeys++;
		const spanish = translations?.get(key);
		if (spanish === undefined) {
			errors.push(`Missing core translation: ${moduleId}:${key}`);
		} else if (placeholders(english) !== placeholders(spanish)) {
			errors.push(`Placeholder mismatch: ${moduleId}:${key}`);
		}
	}
}

const expectedVisibleTranslations = new Map([
	// allow-any-unicode-next-line
	['vs/workbench/contrib/positronSession/browser/positronSessionContainer:positron.session', 'Sesión'],
	['vs/workbench/contrib/positronConsole/browser/positronConsole.contribution:positron.console', 'Consola'],
	['vs/workbench/contrib/positronVariables/browser/positronVariables.contribution:positron.variables', 'Variables'],
	// allow-any-unicode-next-line
	['vs/workbench/contrib/positronPlots/browser/positronPlots.contribution:positron.plots', 'Gráficos'],
	['vs/workbench/contrib/positronVariables/browser/components/variablesEmpty:positron.noVariablesCreated', 'No se han creado variables.'],
	// allow-any-unicode-next-line
	['vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/welcomeHeader:positron.welcome.title', 'Bienvenido a {0}'],
	['vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/welcomeHeader:positron.welcome.help', 'Ayuda'],
	// allow-any-unicode-next-line
	['vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/environmentHealthSection:positron.welcome.environmentSetupTitle', 'Configuración del entorno'],
	['vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent:positron.gettingStarted.welcome.title', 'Comience con RHS-IA'],
	['vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent:positron.gettingStarted.welcome.description', 'Encuentre su camino entre los paneles, atajos y herramientas integrados para la ciencia de datos'],
	['vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent:positron.gettingStarted.welcome.theme.title', 'Elija su tema'],
	['vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent:positron.gettingStarted.welcome.git.button', 'Nueva carpeta desde Git'],
	// allow-any-unicode-next-line
	['vs/workbench/browser/parts/positronTopActionBar/components/topActionBarSessionPicker:positron.console.startSession', 'Iniciar sesión'],
	['vs/workbench/browser/parts/editor/workspaceActions:clearRecentWorkspaces', 'Borrar elementos abiertos recientemente'],
	['vs/workbench/browser/actions/positronActions:positronNewFolderFromTemplate', 'Nueva carpeta desde plantilla...'],
	// allow-any-unicode-next-line
	['vs/workbench/contrib/languageRuntime/browser/languageRuntimeActions:positron.languageRuntime.changeForegroundSession.quickPickTitle', 'Sesiones de intérprete en ejecución'],
]);
for (const [identifier, expected] of expectedVisibleTranslations) {
	const separatorIndex = identifier.lastIndexOf(':');
	const moduleId = identifier.slice(0, separatorIndex);
	const key = identifier.slice(separatorIndex + 1);
	if (overlayStrings.get(moduleId)?.get(key) !== expected) {
		errors.push(`Unexpected visible translation: ${identifier}`);
	}
}

const extensionSources = new Map([
	['extensions/positron-python/l10n/bundle.l10n.es.json', [
		'extensions/positron-python/src/client/positron/environmentHealth.ts',
		'extensions/positron-python/src/client/positron/condaPickerContribution.ts',
	]],
	['extensions/positron-r/l10n/bundle.l10n.es.json', [
		'extensions/positron-r/src/environmentHealth.ts',
		'extensions/positron-r/src/runtime-quickpick.ts',
	]],
]);
let checkedExtensionKeys = 0;
for (const [bundlePath, sourcePaths] of extensionSources) {
	const bundle = JSON.parse(fs.readFileSync(path.join(repositoryRoot, bundlePath), 'utf8'));
	for (const [english, spanish] of Object.entries(bundle)) {
		if (placeholders(english) !== placeholders(spanish)) {
			errors.push(`Placeholder mismatch: ${bundlePath}:${english}`);
		}
	}

	const extensionStrings = new Set();
	for (const sourcePath of sourcePaths) {
		const sourceFile = ts.createSourceFile(sourcePath, fs.readFileSync(path.join(repositoryRoot, sourcePath), 'utf8'), ts.ScriptTarget.Latest, true);
		const visit = node => {
			if (ts.isCallExpression(node)
				&& ts.isPropertyAccessExpression(node.expression)
				&& node.expression.expression.getText(sourceFile) === 'vscode.l10n'
				&& node.expression.name.text === 't'
				&& ts.isStringLiteralLike(node.arguments[0])) {
				extensionStrings.add(node.arguments[0].text);
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
	}

	for (const english of extensionStrings) {
		checkedExtensionKeys++;
		const spanish = bundle[english];
		if (spanish === undefined) {
			errors.push(`Missing extension translation: ${bundlePath}:${english}`);
		} else if (placeholders(english) !== placeholders(spanish)) {
			errors.push(`Placeholder mismatch: ${bundlePath}:${english}`);
		}
	}
}

if (errors.length) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Validated ${checkedCoreKeys} Spanish core localization keys, ${checkedExtensionKeys} environment-health and interpreter-picker keys, and ${extensionSources.size} extension bundles.`);
}

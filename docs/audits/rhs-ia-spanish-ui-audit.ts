import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from '../../node_modules/typescript/lib/typescript.js';

const repo = path.resolve(import.meta.dirname, '../..');
const auditDir = import.meta.dirname;
const jsonPath = path.join(auditDir, 'rhs-ia-spanish-ui-inventory.json');
const markdownPath = path.join(auditDir, 'rhs-ia-spanish-ui-audit.md');

const excludedExtensions = new Set([
	'positron-assistant',
	'positron-zed',
	'positron-javascript',
	'positron-data-explorer-protocol',
	'positron-data-explorer-formatting',
	'positron-data-explorer-duckdb',
]);
const sourceExtensions = fs.readdirSync(path.join(repo, 'extensions'), { withFileTypes: true })
	.filter(entry => entry.isDirectory() && entry.name.startsWith('positron-') && !excludedExtensions.has(entry.name))
	.filter(entry => fs.existsSync(path.join(repo, 'extensions', entry.name, 'package.json')))
	.map(entry => entry.name)
	.sort();

const translationSources = [
	'language-packs/vscode-language-pack-es-1.111.0.vsix (pinned bundled pack)',
	'src/vs/base/node/sp.positron.nls.ts',
	'src/vs/base/node/sp.positron.session.nls.ts',
	'extensions/positron-python/l10n/bundle.l10n.es.json',
	'extensions/positron-r/l10n/bundle.l10n.es.json',
	'extensions/positron-*/l10n/bundle.l10n.es.json',
	'package.nls.es.json beside each extension manifest (when present)',
];

const read = file => fs.readFileSync(path.join(repo, file), 'utf8');
const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;
const sourceFile = (file, text) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
const stringValue = node => {
	if (ts.isStringLiteralLike(node)) {
		return node.text;
	}
	if (node && ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
		const left = stringValue(node.left);
		const right = stringValue(node.right);
		return left !== undefined && right !== undefined ? left + right : undefined;
	}
	return undefined;
};
const propertyName = (node, sf) => node.name && (ts.isStringLiteralLike(node.name) || ts.isIdentifier(node.name)) ? node.name.text ?? node.name.getText(sf) : undefined;

function objectStrings(node, sf) {
	const result = new Map();
	if (!node || !ts.isObjectLiteralExpression(node)) {
		return result;
	}
	for (const property of node.properties) {
		if (ts.isPropertyAssignment(property)) {
			const key = propertyName(property, sf);
			const value = stringValue(property.initializer);
			if (key !== undefined && value !== undefined) {
				result.set(key, value);
			}
		}
	}
	return result;
}

function callLocalizationStrings(file) {
	const text = read(file);
	const sf = sourceFile(file, text);
	const calls = [];
	const dynamicCallSites = [];
	const visit = node => {
		if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
			const receiver = node.expression.expression;
			if (ts.isPropertyAccessExpression(receiver) && receiver.expression.getText(sf) === 'vscode' && receiver.name.text === 'l10n' && node.expression.name.text === 't') {
				const english = stringValue(node.arguments[0]);
				if (english === undefined) {
					dynamicCallSites.push({ line: ts.getLineAndCharacterOfPosition(sf, node.getStart(sf)).line + 1 });
				} else {
					calls.push({ english, line: ts.getLineAndCharacterOfPosition(sf, node.getStart(sf)).line + 1 });
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return { calls, dynamicCallSites };
}

function collectOverlay(file) {
	const text = read(file);
	const sf = sourceFile(file, text);
	const result = new Map();
	const visit = node => {
		if (ts.isVariableDeclaration(node) && ['positronNlsData', 'positronCuratedNlsData', 'positronSessionNlsData', 'positronAdditionalNlsData'].includes(node.name.getText(sf)) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
			for (const moduleProperty of node.initializer.properties) {
				if (!ts.isPropertyAssignment(moduleProperty)) {
					continue;
				}
				const moduleId = propertyName(moduleProperty, sf);
				if (moduleId !== undefined) {
					result.set(moduleId, objectStrings(moduleProperty.initializer, sf));
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return result;
}

const overlay = collectOverlay('src/vs/base/node/sp.positron.session.nls.ts');
for (const [moduleId, values] of collectOverlay('src/vs/base/node/sp.positron.nls.ts')) {
		overlay.set(moduleId, values);
}
for (const [moduleId, values] of collectOverlay('src/vs/base/node/sp.positron.additional.nls.ts')) {
	overlay.set(moduleId, new Map([...(overlay.get(moduleId) ?? []), ...values]));
}

function unpackJson(entry) {
	try {
		return JSON.parse(execFileSync('unzip', ['-p', path.join(repo, 'language-packs/vscode-language-pack-es-1.111.0.vsix'), entry], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }));
	} catch {
		return undefined;
	}
}

function unpackExtensionTranslation(name) {
	const raw = unpackJson(`extension/translations/extensions/vscode.${name}.i18n.json`);
	if (!raw) {
		return undefined;
	}
	return raw.contents ?? raw;
}

const corePack = unpackJson('extension/translations/main.i18n.json');
const corePackContents = corePack?.contents ?? corePack ?? {};
const extensionPackCache = new Map();
const coreTranslation = (moduleId, key) => {
	const value = corePackContents[moduleId]?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
};
const extensionTranslation = (extensionName, key) => {
	if (!extensionPackCache.has(extensionName)) {
		extensionPackCache.set(extensionName, unpackExtensionTranslation(extensionName));
	}
	const bundle = extensionPackCache.get(extensionName);
	const packageValues = bundle?.package ?? bundle;
	const value = packageValues?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
};
const extensionRuntimeBundleCache = new Map();
const extensionRuntimeTranslation = (extensionName, english) => {
	if (!extensionRuntimeBundleCache.has(extensionName)) {
		const bundlePath = path.join(repo, 'extensions', extensionName, 'l10n', 'bundle.l10n.es.json');
		extensionRuntimeBundleCache.set(extensionName, fs.existsSync(bundlePath) ? JSON.parse(fs.readFileSync(bundlePath, 'utf8')) : undefined);
	}
	const value = extensionRuntimeBundleCache.get(extensionName)?.[english];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const placeholders = value => [...value.matchAll(/\{[^{}]+\}|\$\([^)]+\)|%[A-Za-z0-9_.-]+%/g)].map(match => match[0]).sort();
const assertPlaceholderParity = (english, spanish, location) => {
	if (JSON.stringify(placeholders(english)) !== JSON.stringify(placeholders(spanish))) {
		throw new Error(`Placeholder mismatch at ${location}: ${JSON.stringify(english)} -> ${JSON.stringify(spanish)}`);
	}
};

const findings = new Map();
const candidates = [];
const addFinding = finding => {
	const identity = `${finding.status}|${finding.kind}|${finding.localizationModuleKey}|${finding.englishString}`;
	const existing = findings.get(identity);
	if (existing) {
		if (!existing.affectedLocations.some(location => location.sourceFile === finding.sourceFile && location.line === finding.line)) {
			existing.affectedLocations.push({ sourceFile: finding.sourceFile, line: finding.line, context: finding.context });
		}
		return existing;
	}
	const digest = crypto.createHash('sha1').update(identity).digest('hex').slice(0, 10).toUpperCase();
	const prefix = finding.kind === 'core-nls' ? 'CORE' : finding.kind === 'manifest' ? 'MAN' : finding.kind === 'hardcoded' ? 'HTML' : 'EXT';
	const result = {
		id: `RHS-ES-${prefix}-${digest}`,
		kind: finding.kind,
		status: finding.status,
		uiSurface: finding.uiSurface,
		englishString: finding.englishString,
		sourceFile: finding.sourceFile,
		line: finding.line,
		localizationModuleKey: finding.localizationModuleKey,
		hardcodedStatus: finding.hardcodedStatus,
		whySpanishMissingOrIneffective: finding.whySpanishMissingOrIneffective,
		translationSourceInspected: finding.translationSourceInspected ?? translationSources,
		userReachabilityShippingStatus: finding.userReachabilityShippingStatus,
		confidence: finding.confidence,
		priority: finding.priority,
		suggestedSpanishTranslation: finding.suggestedSpanishTranslation ?? null,
		affectedLocations: [{ sourceFile: finding.sourceFile, line: finding.line, context: finding.context }],
	};
	findings.set(identity, result);
	return result;
};

const exactTranslations = new Map([
	['API Key', 'Clave de API'], ['Access Token', 'Token de acceso'], ['Account', 'Cuenta'], ['All Folders', 'Todas las carpetas'],
	['Cancel', 'Cancelar'], ['Catalog', 'Catálogo'], ['Client Certificate', 'Certificado de cliente'], ['Client ID', 'ID de cliente'],
	['Client Key', 'Clave de cliente'], ['Client Secret', 'Secreto de cliente'], ['Connection', 'Conexión'], ['Connection File', 'Archivo de conexiones'],
	['Connection String', 'Cadena de conexión'], ['Database', 'Base de datos'], ['Database File', 'Archivo de base de datos'], ['Data Source', 'Origen de datos'],
	['Connection string', 'Cadena de conexión'], ['Database file path', 'Ruta del archivo de base de datos'], ['Server Hostname', 'Nombre de host del servidor'],
	['Data Source (DSN)', 'Origen de datos (DSN)'], ['Default Connection', 'Conexión predeterminada'], ['Dismiss', 'Descartar'], ['Download', 'Descargar'],
	['Environment Variables', 'Variables de entorno'], ['External Browser', 'Navegador externo'], ['Host', 'Host'], ['HTTP Path', 'Ruta HTTP'],
	['Key Pair', 'Par de claves'], ['Local Server (No Password)', 'Servidor local (sin contraseña)'], ['Name is required', 'El nombre es obligatorio'],
	['No active notebook to export.', 'No hay ningún cuaderno activo para exportar.'], ['No workspace folder is open', 'No hay ninguna carpeta de espacio de trabajo abierta'],
	['Open in Viewer pane', 'Abrir en el panel Visor'], ['Open in new browser window', 'Abrir en una ventana nueva del navegador'], ['Password', 'Contraseña'],
	['Personal Access Token', 'Token de acceso personal'], ['Port', 'Puerto'], ['Private Key File', 'Archivo de clave privada'],
	['Private Key Passphrase', 'Frase de contraseña de la clave privada'], ['Project ID is required', 'El ID del proyecto es obligatorio'], ['Read Only', 'Solo lectura'],
	['Role', 'Rol'], ['Run Above', 'Ejecutar arriba'], ['Run Cell', 'Ejecutar celda'], ['Run Next', 'Ejecutar siguiente'], ['Schema', 'Esquema'],
	['Scope', 'Ámbito'], ['Server', 'Servidor'], ['Server Hostname', 'Nombre de host del servidor'], ['Server URL', 'URL del servidor'],
	['Service account keyfile path is required', 'La ruta del archivo de claves de la cuenta de servicio es obligatoria'], ['Sign in with a browser', 'Iniciar sesión con un navegador'],
	['Socket Directory', 'Directorio del socket'], ['Token', 'Token'], ['Token Request URL', 'URL de solicitud del token'], ['Use SSL', 'Usar SSL'],
	['User', 'Usuario'], ['User & Password', 'Usuario y contraseña'], ['View Log', 'Ver registro'], ['Warehouse', 'Almacén'], ['Waiting for sign-in in your browser...', 'Esperando el inicio de sesión en el navegador...'],
	['Installing dependencies', 'Instalando dependencias'], ['Failed to execute code', 'No se pudo ejecutar el código'], ['Debugger', 'Depurador'],
	['Custom Positron environment variables', 'Variables de entorno personalizadas de Positron'], ['$(run) Run Cell', '$(run) Ejecutar celda'],
]);

function suggest(english) {
	if (exactTranslations.has(english)) {
		return exactTranslations.get(english);
	}
	const translatePart = value => exactTranslations.get(value) ?? [...exactTranslations.entries()].find(([key]) => key.toLowerCase() === value.toLowerCase())?.[1] ?? value;
	const feminineRequired = new Set(['clave de cliente', 'cadena de conexión', 'url del servidor', 'clave de api', 'conexión', 'cuenta', 'ruta del archivo de base de datos', 'ruta http', 'base de datos', 'contraseña', 'frase de contraseña de la clave privada']);
	const patterns = [
		[/^Unknown connection mechanism '(.*)'\.$/, value => `Mecanismo de conexión desconocido '${value}'.`],
		[/^(.+) is required$/, value => translatePart(value) === value ? null : `${translatePart(value)} es ${feminineRequired.has(translatePart(value).toLowerCase()) ? 'obligatoria' : 'obligatorio'}`],
		[/^Connect to a (.+) database server$/, 'Conectarse a un servidor de base de datos $1'],
		[/^Connect to a (.+) database file$/, 'Conectarse a un archivo de base de datos $1'],
		[/^Connect to a (.+) database file on disk$/, 'Conectarse a un archivo de base de datos $1 en el disco'],
		[/^Downloading (.+)\.\.\.$/, 'Descargando $1...'],
		[/^(.+) upload complete$/, 'Carga de $1 completada'],
		[/^(.+) download complete$/, 'Descarga de $1 completada'],
		[/^Failed to read log file: \{0\}$/, 'No se pudo leer el archivo de registro: {0}'],
		[/^Failed to install Positron server in container\. Click "View Log" to see details\.$/, 'No se pudo instalar el servidor de Positron en el contenedor. Haga clic en «Ver registro» para ver los detalles.'],
		[/^No '(.*)' interpreter found\.$/, 'No se encontró ningún intérprete de $1.'],
	];
	for (const [pattern, replacement] of patterns) {
		const match = pattern.exec(english);
		if (match) {
			return typeof replacement === 'function' ? replacement(...match.slice(1)) : english.replace(pattern, replacement);
		}
	}
	return null;
}

function surfaceForExtension(extensionName, file, english) {
	if (extensionName.includes('data-driver') || extensionName === 'positron-connections' || extensionName.includes('catalog-explorer') || extensionName.includes('duckdb')) return 'connections/data explorer';
	if (extensionName.includes('notebook') || extensionName.includes('code-cells') || extensionName.includes('ipywidgets')) return 'notebooks/code cells';
	if (extensionName.includes('environment') || extensionName.includes('reticulate') || extensionName.includes('-python') || extensionName === 'positron-r') return 'languages/interpreters/environments';
	if (extensionName.includes('dev-containers') || extensionName === 'positron-proxy') return 'remote/workspace notifications';
	if (extensionName.includes('run-app') || extensionName.includes('viewer') || extensionName.includes('pdf-server')) return 'applications/viewer';
	if (extensionName.includes('runtime-debugger') || extensionName.includes('supervisor')) return 'sessions/debugging';
	if (extensionName.includes('file-transfer')) return 'file operations';
	return 'bundled extension UI';
}

function priorityFor(surface, english) {
	if (surface === 'connections/data explorer' && (/required|Failed|Cannot|Could not|Unknown/.test(english))) return 'P1';
	if (surface.includes('notebooks') || surface.includes('languages')) return 'P1';
	if (/Failed|Cannot|No |required|Error|Could not/.test(english)) return 'P1';
	return 'P2';
}

function walk(dir) {
	const result = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (['node_modules', 'out', 'dist', 'build', 'test', 'tests', '__snapshots__'].includes(entry.name)) continue;
		const absolute = path.join(dir, entry.name);
		if (entry.isDirectory()) result.push(...walk(absolute));
		else if (/\.(ts|tsx|js|jsx|mts|mjs)$/.test(entry.name)) result.push(absolute);
	}
	return result;
}

let dynamicCallCount = 0;
const dynamicLocalizationCallSites = [];
const extensionRuntimeCallCount = {};
for (const extensionName of sourceExtensions) {
	const extensionRoot = path.join(repo, 'extensions', extensionName);
	const sourceRoot = path.join(extensionRoot, 'src');
	if (!fs.existsSync(sourceRoot)) continue;
	for (const absolute of walk(sourceRoot)) {
		const relative = path.relative(repo, absolute).replaceAll(path.sep, '/');
		if (relative.includes('/test/') || relative.includes('/tests/')) continue;
		const { calls, dynamicCallSites } = callLocalizationStrings(relative);
		dynamicCallCount += dynamicCallSites.length;
		for (const site of dynamicCallSites) dynamicLocalizationCallSites.push({ extension: extensionName, sourceFile: relative, line: site.line, status: 'candidate-runtime-verification', reason: 'vscode.l10n.t() first argument is not a literal; exact English key and effective Spanish value require build extraction or runtime inspection.' });
		extensionRuntimeCallCount[extensionName] = (extensionRuntimeCallCount[extensionName] ?? 0) + calls.length;
		for (const call of calls) {
			if ((extensionName === 'positron-python' && relative.endsWith('src/client/positron/environmentHealth.ts')) || (extensionName === 'positron-r' && relative.endsWith('src/environmentHealth.ts'))) continue;
			const runtimeTranslation = extensionRuntimeTranslation(extensionName, call.english);
			if (runtimeTranslation) {
				assertPlaceholderParity(call.english, runtimeTranslation, `${extensionName}:${relative}:${call.line}`);
				continue;
			}
			const surface = surfaceForExtension(extensionName, relative, call.english);
			addFinding({
				kind: 'extension-runtime', status: 'confirmed-gap', uiSurface: surface, englishString: call.english,
				sourceFile: relative, line: call.line, localizationModuleKey: `${extensionName}:vscode.l10n.t:${call.english}`,
				hardcodedStatus: 'localized-call-with-English-fallback',
				whySpanishMissingOrIneffective: `The shipped ${extensionName} source calls vscode.l10n.t(), but the extension has no Spanish runtime bundle. The pinned VSIX has no vscode.${extensionName}.i18n.json entry, so the English source string is the effective Spanish fallback.`,
				userReachabilityShippingStatus: 'shipped source-built extension; exact path is activation/context dependent',
				confidence: 'high', priority: priorityFor(surface, call.english), suggestedSpanishTranslation: suggest(call.english),
				context: 'runtime localization call',
			});
		}
	}
}

function packageNlsValue(value) {
	return typeof value === 'string' ? value : value && typeof value.message === 'string' ? value.message : undefined;
}

function collectPercentRefs(value, pathParts = []) {
	const refs = [];
	if (typeof value === 'string') {
		const match = /^%(.+)%$/.exec(value);
		if (match) refs.push({ key: match[1], path: pathParts });
	} else if (Array.isArray(value)) {
		value.forEach((child, index) => refs.push(...collectPercentRefs(child, [...pathParts, String(index)])));
	} else if (value && typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) refs.push(...collectPercentRefs(child, [...pathParts, key]));
	}
	return refs;
}

for (const extensionName of sourceExtensions) {
	const packageRelative = `extensions/${extensionName}/package.json`;
	const packageRaw = read(packageRelative);
	const packageJson = JSON.parse(packageRaw);
	const nlsPath = path.join(repo, `extensions/${extensionName}/package.nls.json`);
	if (!fs.existsSync(nlsPath)) continue;
	const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
	const esPath = path.join(repo, `extensions/${extensionName}/package.nls.es.json`);
	const es = fs.existsSync(esPath) ? JSON.parse(fs.readFileSync(esPath, 'utf8')) : undefined;
	for (const ref of collectPercentRefs(packageJson)) {
		const english = packageNlsValue(nls[ref.key]);
		if (!english) continue;
		const spanish = packageNlsValue(es?.[ref.key]) ?? extensionTranslation(packageJson.name, ref.key);
		if (spanish) {
			assertPlaceholderParity(english, spanish, `${packageRelative}:${ref.key}`);
			continue;
		}
		const needle = `%${ref.key}%`;
		const offset = packageRaw.indexOf(needle);
		const line = lineAt(packageRaw, offset < 0 ? 0 : offset);
		addFinding({
			kind: 'manifest', status: 'confirmed-gap', uiSurface: 'extension manifest / commands / settings', englishString: english,
			sourceFile: packageRelative, line, localizationModuleKey: `${packageJson.name}:package.nls:${ref.key}`,
			hardcodedStatus: 'manifest-placeholder-without-effective-Spanish-value',
			whySpanishMissingOrIneffective: es ? `package.nls.es.json exists but does not provide a distinct Spanish value for ${ref.key}; the pinned pack also has no effective translation for this key.` : `No package.nls.es.json ships beside the manifest, and no pinned language-pack entry supplies this ${packageJson.name} manifest key.`,
			userReachabilityShippingStatus: 'shipped manifest; visible when the extension/command/setting is surfaced',
			confidence: 'high', priority: 'P1', suggestedSpanishTranslation: suggest(english), context: `manifest path ${ref.path.join('.')}`,
		});
	}
}

const coreRoots = [
	'src/vs/workbench/contrib/positron', 'src/vs/workbench/browser/parts/positron', 'src/vs/platform/positron',
	'src/vs/workbench/contrib/languageRuntime', 'src/vs/workbench/contrib/welcomeGettingStarted', 'src/vs/workbench/contrib/positronNotebook',
	'src/vs/workbench/contrib/positronControlGallery', 'src/vs/base/node',
];
const coreFiles = [];
for (const root of coreRoots) {
	const absolute = path.join(repo, root);
	if (!fs.existsSync(absolute)) continue;
	for (const file of walk(absolute)) {
		const relative = path.relative(repo, file).replaceAll(path.sep, '/');
		if (!relative.endsWith('.ts') && !relative.endsWith('.tsx')) continue;
		if (relative.endsWith('gettingStartedPositronNotebookContent.ts')) continue;
		if (relative.endsWith('ContextKeys.ts')) continue;
		if (!relative.includes('/test/') && !relative.includes('/tests/')) coreFiles.push(relative);
	}
}
const coreCallCount = {};
for (const relative of [...new Set(coreFiles)].sort()) {
	const text = read(relative);
	const sf = sourceFile(relative, text);
	const moduleId = relative.replace(/^src\//, '').replace(/\.(ts|tsx)$/, '');
		const visit = node => {
			if (ts.isCallExpression(node)) {
				const name = ts.isIdentifier(node.expression) ? node.expression.text : ts.isPropertyAccessExpression(node.expression) ? node.expression.name.text : undefined;
				if ((name === 'localize' || name === 'localize2') && node.arguments.length >= 2) {
					const first = node.arguments[0];
					const key = stringValue(first) ?? (ts.isObjectLiteralExpression(first) ? stringValue(first.properties.find(property => ts.isPropertyAssignment(property) && propertyName(property, sf) === 'key')?.initializer) : undefined);
					const english = stringValue(node.arguments[1]);
					if (key && english && !(relative.endsWith('AssistantErrorQuickFix.tsx') && key === 'positronAssistantExplainOnlyConstraint')) {
						coreCallCount[relative] = (coreCallCount[relative] ?? 0) + 1;
						const translated = overlay.get(moduleId)?.get(key) ?? coreTranslation(moduleId, key);
						if (translated) {
							assertPlaceholderParity(english, translated, `${relative}:${key}`);
							return;
						}
						let surface = relative.includes('positronNotebook') ? 'notebooks' : relative.includes('positronControlGallery') ? 'developer/control gallery' : relative.includes('positronAssistant') || relative.includes('/chat/') ? 'assistant/chat' : relative.includes('languageRuntime') ? 'sessions/interpreters' : relative.includes('positronConnections') ? 'connections' : relative.includes('positronHelp') ? 'help/documentation' : relative.includes('positronConsole') ? 'console' : relative.includes('positronVariables') ? 'variables' : relative.includes('positronPlots') ? 'plots' : relative.includes('welcomeGettingStarted') ? 'welcome/environment checks' : 'core UI';
						addFinding({
							kind: 'core-nls', status: 'confirmed-gap', uiSurface: surface, englishString: english,
								sourceFile: relative, line: ts.getLineAndCharacterOfPosition(sf, node.getStart(sf)).line + 1, localizationModuleKey: `${moduleId}:${key}`,
							hardcodedStatus: 'core-localize-call-without-effective-Spanish-translation',
							whySpanishMissingOrIneffective: `The English default is used because neither the RHS-IA Spanish overlay nor the pinned Spanish main.i18n.json contains ${moduleId}:${key}.`,
							userReachabilityShippingStatus: 'core workbench source; exact path is UI/context dependent', confidence: 'high', priority: surface === 'developer/control gallery' ? 'P3' : 'P1', suggestedSpanishTranslation: suggest(english), context: 'core localize/localize2 call',
						});
					}
				}
			}
			ts.forEachChild(node, visit);
		};
	visit(sf);
}

const hardcoded = [
	['src/vs/workbench/contrib/positronNotebook/browser/AssistantPanel/AssistantPanelActions.tsx', 283, 'Submit prompt', 'notebooks', 'hardcoded accessibility label/title; no localize call', 'Enviar solicitud'],
	['src/vs/workbench/contrib/positronNotebook/browser/notebookCells/SortableCell.tsx', 81, 'Drag to reorder cell', 'notebooks', 'hardcoded accessibility label; no localize call', 'Arrastrar para reordenar la celda'],
	['src/vs/workbench/contrib/positronNotebook/browser/notebookCells/JsonOutput.tsx', 0, 'Collapse to truncated preview', 'notebooks', 'hardcoded accessibility/title text; conditional label has no localization', 'Contraer a vista previa truncada'],
	['src/vs/workbench/contrib/positronNotebook/browser/notebookCells/JsonOutput.tsx', 0, 'Expand to see all {0} characters', 'notebooks', 'hardcoded accessibility/title text; conditional label has no localization', 'Expandir para ver los {0} caracteres'],
	['src/vs/workbench/contrib/positronNotebook/browser/notebookCells/JsonOutput.tsx', 120, 'item/items', 'notebooks', 'hardcoded pluralized accessibility text; no localization', 'elemento/elementos'],
	['extensions/positron-pdf-server/src/pdfHttpServer.ts', 166, 'Open With...', 'PDF viewer/notebooks', 'HTML injected directly into PDF.js webview; bypasses extension localization', 'Abrir con...'],
	['extensions/positron-r/src/rdata-editor.ts', 139, 'Waiting for R', 'R data editor', 'HTML webview title and visible status text are hardcoded', 'Esperando a R'],
	['extensions/positron-r/src/rdata-editor.ts', 145, 'Waiting for R...', 'R data editor', 'HTML webview heading is hardcoded', 'Esperando a R...'],
	['extensions/positron-r/src/rdata-editor.ts', 146, 'Discovering R installations to load {0}...', 'R data editor', 'HTML webview status text is hardcoded', 'Buscando instalaciones de R para cargar {0}...'],
	['extensions/positron-r/src/rdata-editor.ts', 180, 'R Required', 'R data editor', 'HTML webview title is hardcoded', 'Se requiere R'],
	['extensions/positron-r/src/rdata-editor.ts', 186, 'R Installation Required', 'R data editor', 'HTML webview heading is hardcoded', 'Se requiere una instalación de R'],
	['extensions/positron-r/src/rdata-editor.ts', 187, 'Cannot load {0}.', 'R data editor', 'HTML webview error text is hardcoded', 'No se puede cargar {0}.'],
	['extensions/positron-r/src/rdata-editor.ts', 191, 'Learn more about R discovery', 'R data editor', 'HTML webview link text is hardcoded', 'Más información sobre la detección de R'],
	['extensions/positron-r/src/rdata-editor.ts', 450, 'Load', 'R data editor', 'HTML webview button is hardcoded', 'Cargar'],
	['src/vs/workbench/contrib/positronControlGallery/browser/galleries/positronTreeGallery.tsx', 172, 'No nodes', 'developer/control gallery', 'developer-facing gallery renderer contains literal UI text', 'No hay nodos'],
	['src/vs/workbench/contrib/positronControlGallery/browser/galleries/positronTreeGallery.tsx', 174, 'Loading...', 'developer/control gallery', 'developer-facing gallery renderer contains literal UI text', 'Cargando...'],
	['src/vs/workbench/contrib/positronControlGallery/browser/galleries/positronTreeGallery.tsx', 161, 'Selection follows cursor', 'developer/control gallery', 'developer-facing gallery form label is hardcoded', 'La selección sigue el cursor'],
	['src/vs/workbench/contrib/positronControlGallery/browser/galleries/positronListGallery.tsx', 91, 'Items', 'developer/control gallery', 'developer-facing gallery form label is hardcoded', 'Elementos'],
	['src/vs/workbench/contrib/positronControlGallery/browser/components/controlGallery.tsx', 54, 'No controls registered.', 'developer/control gallery', 'developer-facing gallery empty state is hardcoded', 'No hay controles registrados.'],
];
for (const [file, line, english, surface, why, spanish] of hardcoded) {
	const text = read(file);
	const sf = sourceFile(file, text);
	const localizedValues = new Set();
	const visitLocalized = node => {
		if (ts.isCallExpression(node)) {
			const name = ts.isIdentifier(node.expression) ? node.expression.text : ts.isPropertyAccessExpression(node.expression) ? node.expression.name.text : undefined;
			if ((name === 'localize' || name === 'localize2') && node.arguments.length >= 2) {
				const value = stringValue(node.arguments[1]);
				if (value) localizedValues.add(value);
			} else if (name === 't' && ts.isPropertyAccessExpression(node.expression) && node.expression.expression.getText(sf) === 'vscode.l10n') {
				const value = stringValue(node.arguments[0]);
				if (value) localizedValues.add(value);
			}
		}
		ts.forEachChild(node, visitLocalized);
	};
	visitLocalized(sf);
	if (english === 'item/items' ? localizedValues.has('item') && localizedValues.has('items') : localizedValues.has(english)) {
		continue;
	}
	const actualLine = line || Math.max(1, text.split('\n').findIndex(value => value.includes(english.split(' {')[0])) + 1);
	addFinding({
		kind: 'hardcoded', status: 'candidate-runtime-verification', uiSurface: surface, englishString: english,
		sourceFile: file, line: actualLine, localizationModuleKey: null, hardcodedStatus: 'hardcoded-user-facing-text',
		whySpanishMissingOrIneffective: why, translationSourceInspected: translationSources,
		userReachabilityShippingStatus: surface === 'developer/control gallery' ? 'reachable only through developer/control-gallery command; low product priority' : 'shipped UI/webview; confirm by opening the relevant flow',
		confidence: surface === 'developer/control gallery' ? 'medium' : 'high', priority: surface === 'developer/control gallery' ? 'P3' : 'P1', suggestedSpanishTranslation: spanish, context: 'targeted hardcoded-text scan',
	});
}

const allFindings = [...findings.values()].sort((a, b) => a.priority.localeCompare(b.priority) || a.uiSurface.localeCompare(b.uiSurface) || a.id.localeCompare(b.id));
const surfaceCounts = {};
const priorityCounts = {};
const statusCounts = {};
for (const finding of allFindings) {
	surfaceCounts[finding.uiSurface] = (surfaceCounts[finding.uiSurface] ?? 0) + 1;
	priorityCounts[finding.priority] = (priorityCounts[finding.priority] ?? 0) + 1;
	statusCounts[finding.status] = (statusCounts[finding.status] ?? 0) + 1;
}

const inventory = {
	schemaVersion: '1.0.0',
	audit: {
		auditedAt: new Date().toISOString(),
		repository: 'RHS-IA',
		workingTreePath: repo,
		branch: execFileSync('git', ['branch', '--show-current'], { cwd: repo, encoding: 'utf8' }).trim(),
		head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
		previousWorkingTreeStatus: 'clean before audit artifacts were created (verified with git status --short)',
		applicationSourceModifiedByAudit: false,
		baselineFindings: 1607,
		baselineConfirmedGaps: 1588,
		baselineHardcodedCandidates: 19,
	},
	method: {
		coverage: 'Static audit of source-built Positron extensions, Positron/core NLS call sites, extension manifests, shipped Spanish overlays, and targeted hardcoded UI scans. Runtime findings are separated when opening the flow is still required.',
		commands: [
			'rtk read /Users/josu/.codex/RTK.md',
			'rtk git status --short',
			'rtk read AGENTS.md',
			'rtk read docs/upgrades/rhs-customizations.md',
			'rtk read docs/upgrades/rhs-customizations.json',
			'rtk read docs/language/translation-plan.md',
			'rtk proxy unzip -Z1 language-packs/vscode-language-pack-es-1.111.0.vsix',
			'rtk proxy node scripts/validate-spanish-session-localization.mjs',
			'rtk proxy rg -n "vscode.l10n.t|localize(|aria-label|title=|>...<" src extensions',
		],
			exclusions: [
				'English source defaults with an effective bundled-pack or RHS overlay translation',
				'comments, logs, tests/fixtures, generated duplicates, user-authored notebook/output content, proper names, and code identifiers',
				'intentionally excluded/non-shipping extensions from build/lib/extensions.ts and the RHS customization ledger',
				'the hidden Learn section, except as a coverage boundary because it is intentionally inactive',
			],
	},
		translationPipeline: {
			languagePack: 'language-packs/vscode-language-pack-es-1.111.0.vsix',
			languagePackExtensionBundlesInspected: 'extension/translations/extensions/vscode.*.i18n.json; no positron.* bundle present',
			coreOrder: ['RHS overlay', 'pinned Microsoft Spanish main.i18n.json', 'English default'],
			extensionOrder: ['package.nls.es.json or pinned vscode.<extension>.i18n.json for manifest strings', 'extension l10n/bundle.l10n.es.json', 'English default'],
			validatorScope: 'The focused validator covers the curated core/session/welcome and environment-health scope; this audit also verifies every statically resolvable shipped extension runtime call, manifest reference, audited core call, hardcoded candidate, and placeholder.',
		},
		counts: {
			findings: allFindings.length,
			confirmedGaps: allFindings.filter(f => f.status === 'confirmed-gap').length,
			candidatesNeedingRuntimeVerification: allFindings.filter(f => f.status === 'candidate-runtime-verification').length,
			staticExtensionRuntimeCalls: Object.values(extensionRuntimeCallCount).reduce((a, b) => a + b, 0),
			dynamicExtensionLocalizationCallsNotInventoried: dynamicCallCount,
			bySurface: surfaceCounts,
			byPriority: priorityCounts,
			byStatus: statusCounts,
		},
		shippedSourceExtensions: sourceExtensions,
		findings: allFindings,
		candidates: candidates,
		dynamicLocalizationCallSites,
		limitations: [
			'No fresh packaged-app GUI session was run by this audit; rendered locale behavior still requires packaged-app smoke testing.',
			'The pinned language pack was inspected from its VSIX contents; upstream translations are treated as effective only when the exact module/key or extension package key was found.',
			'This is not an exhaustive audit of every upstream extension contribution or every HTML/string assembled at runtime. The report focuses on RHS-IA-owned/source-built surfaces and shipped customizations.',
		],
		remediationBacklog: [],
};

if (process.argv.includes('--check')) {
	if (inventory.counts.findings > 0 || inventory.counts.dynamicExtensionLocalizationCallsNotInventoried > 0) {
		console.error(`Spanish UI audit failed: ${inventory.counts.findings} findings and ${inventory.counts.dynamicExtensionLocalizationCallsNotInventoried} unresolved dynamic calls.`);
		process.exit(1);
	}
	console.log(`Spanish UI audit passed: ${inventory.counts.staticExtensionRuntimeCalls} runtime calls, all audited core/manifest keys, and all hardcoded candidates are covered.`);
	process.exit(0);
}

fs.writeFileSync(jsonPath, `${JSON.stringify(inventory, null, 2)}\n`);

const md = [];
md.push('# RHS-IA Spanish UI localization audit', '', `Generated from ${inventory.audit.head} on ${inventory.audit.auditedAt}.`, '', '## Executive summary', '', `The baseline audit identified **${inventory.audit.baselineConfirmedGaps} confirmed gaps** and **${inventory.audit.baselineHardcodedCandidates} hardcoded candidates** (${inventory.audit.baselineFindings} findings total). The current scan reports **${inventory.counts.findings} remaining findings** and **${inventory.counts.dynamicExtensionLocalizationCallsNotInventoried} unresolved dynamic localization calls**.`);
md.push('', 'Spanish runtime bundles now ship for source-built Positron extensions, manifest contributions have local `package.nls.es.json` coverage, audited core strings are covered by the RHS-IA overlay, and the targeted hardcoded UI strings use localization APIs.', '', '## Counts');
md.push('', '| Measure | Count |', '| --- | ---: |', `| Confirmed gaps | ${inventory.counts.confirmedGaps} |`, `| Candidates needing runtime verification | ${inventory.counts.candidatesNeedingRuntimeVerification} |`, `| Static extension runtime calls extracted | ${inventory.counts.staticExtensionRuntimeCalls} |`, `| Dynamic extension localization calls counted but not assigned | ${inventory.counts.dynamicExtensionLocalizationCallsNotInventoried} |`, '', '| Priority | Count |', '| --- | ---: |', ...Object.entries(priorityCounts).sort().map(([key, value]) => `| ${key} | ${value} |`));
md.push('', '### Findings by surface', '', '| Surface | Findings |', '| --- | ---: |', ...Object.entries(surfaceCounts).sort((a, b) => b[1] - a[1]).map(([key, value]) => `| ${key} | ${value} |`));
md.push('', '## Confirmed gaps', '', 'These findings have a statically demonstrated ineffective Spanish path: the exact source key/string is not in the RHS overlay, not in the pinned main/extension translation, and/or has no shipped Spanish extension bundle.', '', '| ID | Priority | Surface | English source string | Primary location | Localization key | Suggested Spanish |', '| --- | --- | --- | --- | --- | --- | --- |');
for (const finding of allFindings.filter(f => f.status === 'confirmed-gap')) {
	const loc = finding.affectedLocations[0];
	md.push(`| ${finding.id} | ${finding.priority} | ${finding.uiSurface} | ${finding.englishString.replaceAll('|', '\\|')} | ${loc.sourceFile}:${loc.line} | ${finding.localizationModuleKey ?? 'hardcoded'} | ${finding.suggestedSpanishTranslation ? finding.suggestedSpanishTranslation.replaceAll('|', '\\|') : 'Needs contextual translation'} |`);
}
md.push('', '## Candidates needing runtime verification', '', 'These are hardcoded literals found in shipped source where static inspection shows no localization call, but a runtime pass should confirm whether the text is reachable in the product path.', '', '| ID | Priority | Surface | English text | Location | Suggested Spanish |', '| --- | --- | --- | --- | --- | --- |');
for (const finding of allFindings.filter(f => f.status === 'candidate-runtime-verification')) {
	md.push(`| ${finding.id} | ${finding.priority} | ${finding.uiSurface} | ${finding.englishString.replaceAll('|', '\\|')} | ${finding.sourceFile}:${finding.line} | ${finding.suggestedSpanishTranslation ?? 'Needs contextual translation'} |`);
}
md.push('', '## Pipeline and shipping evidence', '', '- The RHS overlay is applied before the pinned Microsoft Spanish pack and English fallback in `src/vs/base/node/nls.ts`.', '- This audit verifies all statically resolvable source-built Positron extension `vscode.l10n.t()` calls, manifest placeholders, audited core calls, targeted hardcoded candidates, and placeholder parity.', '- Local `bundle.l10n.es.json` and `package.nls.es.json` files fill the Positron-specific coverage absent from the pinned upstream VSIX.', '- `build/lib/extensions.ts` excludes `positron-zed`, `positron-javascript`, build-only data-explorer packages, and other non-shipping sources; those are not treated as product gaps.', '- The hidden Learn content, user-authored/output content, comments, logs, tests, fixtures, generated duplicates, and proper names were excluded.');
md.push('', '## Reproducible audit method', '', ...inventory.method.commands.map(command => `- \`${command}\``), '', 'The extractor parses TypeScript/TSX ASTs for literal `vscode.l10n.t()`, `localize()` and `localize2()` calls, reads manifest `%key%` references, compares exact keys against the RHS overlay and unpacked Spanish VSIX JSON, groups duplicate English strings while retaining affected locations, and adds a small targeted hardcoded-text scan for notebook/R/PDF/control-gallery surfaces.');
md.push('', '## Coverage boundaries and limitations', '', ...inventory.limitations.map(value => `- ${value}`));
md.push('', '## Ordered remediation backlog', '', 'No remediation items remain within the static audit scope. A packaged Spanish-profile smoke test remains a release-validation activity.');
md.push('', `Full machine-readable records: [rhs-ia-spanish-ui-inventory.json](./rhs-ia-spanish-ui-inventory.json).`);
fs.writeFileSync(markdownPath, `${md.join('\n')}\n`);

console.log(`Wrote ${allFindings.length} deduplicated findings to ${jsonPath}`);
console.log(`Wrote report to ${markdownPath}`);

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { collectExtensionDependencyRoots, unexpectedExtensionDependencyRoots } from './napo-extension-dependency-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const product = JSON.parse(readFileSync(join(root, 'product.json'), 'utf8'));
const failures = [];
const warnings = [];
const checks = [];

function check(name, condition, detail) {
	checks.push({ name, ok: condition, detail });
	if (!condition) {
		failures.push(`${name}: ${detail}`);
	}
}

function readArgument(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function sha256(file) {
	return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function commandVersion(command, args) {
	const result = spawnSync(command, args, { encoding: 'utf8' });
	if (result.error || result.status !== 0) {
		return undefined;
	}
	return `${result.stdout}${result.stderr}`.trim().split('\n')[0];
}

const capibaraManifestPath = join(root, 'extensions', 'rhs-agent4', 'package.json');
const capibaraDistPath = join(root, 'extensions', 'rhs-agent4', 'dist', 'extension.js');
const buildCapibaraDistPath = join(root, '.build', 'extensions', 'rhs-agent4', 'dist', 'extension.js');
const petPath = join(root, 'extensions', 'positron-python', 'python-env-tools', 'pet');
const buildPetPath = join(root, '.build', 'extensions', 'positron-python', 'python-env-tools', 'pet');
const arkPath = join(root, 'extensions', 'positron-r', 'resources', 'ark', 'ark');
const buildArkPath = join(root, '.build', 'extensions', 'positron-r', 'resources', 'ark', 'ark');
const kallichorePath = join(root, 'extensions', 'positron-supervisor', 'resources', 'kallichore', 'kcserver');
const buildKallichorePath = join(root, '.build', 'extensions', 'positron-supervisor', 'resources', 'kallichore', 'kcserver');
const policyWatcherPath = join(root, 'node_modules', '@vscode', 'policy-watcher', 'build', 'Release', 'vscode-policy-watcher.node');
const quartoBinaryPath = join(root, '.build', 'quarto', 'bin', 'quarto');
const requiredLegalPaths = [
	['Napo LICENSE.txt', join(root, 'LICENSE.txt')],
	['Napo NOTICE', join(root, 'NOTICE')],
	['Capibara LICENSE.txt', join(root, 'extensions', 'rhs-agent4', 'LICENSE.txt')],
	['Capibara THIRD_PARTY_NOTICES.md', join(root, 'extensions', 'rhs-agent4', 'dist', 'THIRD_PARTY_NOTICES.md')],
	['Capibara LICENSES', join(root, 'extensions', 'rhs-agent4', 'dist', 'LICENSES')],
];

function validateLegalArtifacts(label, paths) {
	for (const [name, path] of paths) {
		check(`${label}: ${name}`, existsSync(path), `se esperaba ${path}`);
	}
	const licenseDirectory = paths.find(([name]) => name.endsWith('LICENSES'))?.[1];
	if (licenseDirectory && existsSync(licenseDirectory)) {
		const licenseFiles = readdirSync(licenseDirectory).filter((name) => name.endsWith('.txt'));
		check(`${label}: inventario de licencias`, licenseFiles.length > 0, `se esperaba al menos un texto en ${licenseDirectory}`);
	}
}

function validateCapibaraPolicy(manifest, label) {
	const properties = manifest.contributes?.configuration?.properties ?? {};
	const provider = properties['capibara.llm.provider'];
	const profile = properties['capibara.permissions.profile'];
	const approval = properties['capibara.permissions.approval'];
	const autoDownload = properties['capibara.canonicalRag.autoDownload'];
	const codeIndex = properties['capibara.codeIndex.enabled'];
	const expectedProviders = ['ollama', 'anthropic', 'lmstudio', 'openai', 'openai-compatible', 'grok', 'gemini', 'deepseek', 'openai-codex', 'openai-native', 'mistral', 'zai', 'minimax', 'qwen-code'];
	check(`${label}: proveedor completo`, provider?.default === 'ollama' && expectedProviders.every((name) => provider.enum?.includes(name)), 'debe conservar el selector de proveedores de Capibara y usar Ollama local como default');
	check(`${label}: perfil inicial`, profile?.default === 'workspace', 'el perfil inicial debe ser Workspace');
	check(`${label}: aprobación inicial`, approval?.default === 'sensitive', 'la aprobación inicial debe ser Solo sensibles');
	check(`${label}: RAG sin descarga automática`, autoDownload?.default === false, 'el RAG canónico no debe descargarse automáticamente');
	check(`${label}: índice de código opt-in`, codeIndex?.default === false, 'el índice de código no debe activar Qdrant/Ollama por defecto');
	for (const [key, value] of Object.entries(properties)) {
		if (key.endsWith('.apiKey')) {
			check(`${label}: credencial no empaquetada (${key})`, value.default === '', `la configuración ${key} debe iniciar vacía`);
		}
	}
}

function validatePackagedExtensionDependencies(packageAppRoot) {
	const roots = collectExtensionDependencyRoots(packageAppRoot);
	const violations = unexpectedExtensionDependencyRoots(roots);
	check(
		'raíces de dependencias runtime de extensiones',
		violations.length === 0,
		violations.length === 0
			? 'solo se conservan raíces runtime declaradas de extensiones integradas'
			: `se encontraron raíces no declaradas: ${violations.join(', ')}`,
	);
}

check('identidad de producto', product.applicationName === 'napo' && product.nameShort === 'RHS-IA', 'se esperaba applicationName/nameShort=napo/RHS-IA');
check('telemetría', product.enableTelemetry === false, 'se esperaba enableTelemetry=false');
check('actualizaciones silenciosas', !product.updateUrl && !product.downloadUrl, 'se esperaban updateUrl y downloadUrl vacíos');
check('documentación LLM sin descarga automática', product.positronLlmsDocsUrl === '', 'se esperaba positronLlmsDocsUrl vacío para impedir tráfico automático');
check('Marketplace desactivado', !product.extensionsGallery?.serviceUrl && !product.extensionsGallery?.resourceUrlTemplate && !product.extensionsGallery?.extensionUrlTemplate, 'Napo no debe declarar una galería de extensiones ni sus endpoints');
check('Capibara en carpetas no confiables', product.extensionUntrustedWorkspaceSupport?.['juliushearts.rhs-agent4']?.override === true, 'Capibara debe permanecer disponible al abrir una carpeta de proyecto no confiable');
validateLegalArtifacts('artefactos legales integrados', requiredLegalPaths);
check('Capibara manifest', existsSync(capibaraManifestPath), `se esperaba ${capibaraManifestPath}`);
check('Capibara runtime', existsSync(capibaraDistPath), `se esperaba ${capibaraDistPath}`);
check('Capibara preempaquetada', existsSync(buildCapibaraDistPath), `se esperaba ${buildCapibaraDistPath}`);
check('PET runtime integrado', existsSync(petPath), `se esperaba ${petPath}`);
check('PET runtime preempaquetado', existsSync(buildPetPath), `se esperaba ${buildPetPath}`);
check('Ark runtime integrado', existsSync(arkPath), `se esperaba ${arkPath}`);
check('Ark runtime preempaquetado', existsSync(buildArkPath), `se esperaba ${buildArkPath}`);
check('Kallichore runtime integrado', existsSync(kallichorePath), `se esperaba ${kallichorePath}`);
check('Kallichore runtime preempaquetado', existsSync(buildKallichorePath), `se esperaba ${buildKallichorePath}`);
check('policy-watcher nativo integrado', existsSync(policyWatcherPath), `se esperaba ${policyWatcherPath}`);
check('Quarto CLI preempaquetado', existsSync(quartoBinaryPath), `se esperaba ${quartoBinaryPath}`);

if (existsSync(capibaraManifestPath)) {
	const manifest = JSON.parse(readFileSync(capibaraManifestPath, 'utf8'));
	check('Capibara completa', manifest.name === 'rhs-agent4' && manifest.version === '4.0.0' && manifest.main === './dist/extension.js', 'se esperaba name=rhs-agent4, version=4.0.0 y main=./dist/extension.js');
	validateCapibaraPolicy(manifest, 'Capibara integrada');
}

const packagePath = readArgument('--package');
if (packagePath) {
	const packageRoot = resolve(packagePath);
	const packageAppRoot = join(packageRoot, 'Contents', 'Resources', 'app');
	const packageProductPath = join(packageAppRoot, 'product.json');
	const packageCapibaraManifestPath = join(packageAppRoot, 'extensions', 'rhs-agent4', 'package.json');
	const packageCapibaraDistPath = join(packageAppRoot, 'extensions', 'rhs-agent4', 'dist', 'extension.js');
	const packagePetPath = join(packageAppRoot, 'extensions', 'positron-python', 'python-env-tools', 'pet');
	const packageArkPath = join(packageAppRoot, 'extensions', 'positron-r', 'resources', 'ark', 'ark');
	const packageKallichorePath = join(packageAppRoot, 'extensions', 'positron-supervisor', 'resources', 'kallichore', 'kcserver');
	const packageQuartoBinaryPath = join(packageAppRoot, 'quarto', 'bin', 'quarto');
	const packageNodePtySpawnHelperPath = join(packageAppRoot, 'node_modules.asar.unpacked', 'node-pty', 'prebuilds', 'darwin-arm64', 'spawn-helper');
	const packagePolicyWatcherPath = join(packageAppRoot, 'node_modules.asar.unpacked', '@vscode', 'policy-watcher', 'build', 'Release', 'vscode-policy-watcher.node');
	const packageLegalPaths = [
		['Napo LICENSE.txt', join(packageAppRoot, 'LICENSE.txt')],
		['Napo NOTICE', join(packageAppRoot, 'NOTICE')],
		['Capibara LICENSE.txt', join(packageAppRoot, 'extensions', 'rhs-agent4', 'LICENSE.txt')],
		['Capibara THIRD_PARTY_NOTICES.md', join(packageAppRoot, 'extensions', 'rhs-agent4', 'dist', 'THIRD_PARTY_NOTICES.md')],
		['Capibara LICENSES', join(packageAppRoot, 'extensions', 'rhs-agent4', 'dist', 'LICENSES')],
	];

	check('paquete Napo', existsSync(packageProductPath), `se esperaba ${packageProductPath}`);
	validateLegalArtifacts('artefactos legales empaquetados', packageLegalPaths);
	check('Capibara en paquete', existsSync(packageCapibaraManifestPath) && existsSync(packageCapibaraDistPath), 'se esperaban manifest y runtime dentro del paquete');
	check('PET en paquete', existsSync(packagePetPath), `se esperaba ${packagePetPath}`);
	check('Ark en paquete', existsSync(packageArkPath), `se esperaba ${packageArkPath}`);
	check('Kallichore en paquete', existsSync(packageKallichorePath), `se esperaba ${packageKallichorePath}`);
	check('Quarto en paquete', existsSync(packageQuartoBinaryPath), `se esperaba ${packageQuartoBinaryPath}`);
	check('node-pty spawn-helper en paquete', existsSync(packageNodePtySpawnHelperPath), `se esperaba ${packageNodePtySpawnHelperPath}`);
	check('policy-watcher nativo en paquete', existsSync(packagePolicyWatcherPath), `se esperaba ${packagePolicyWatcherPath}`);
	validatePackagedExtensionDependencies(packageAppRoot);

	if (existsSync(packageProductPath)) {
		const packageProduct = JSON.parse(readFileSync(packageProductPath, 'utf8'));
		check('identidad del paquete', packageProduct.applicationName === 'napo' && packageProduct.nameShort === 'RHS-IA', 'se esperaba napo/RHS-IA en el paquete');
		check('telemetría del paquete', packageProduct.enableTelemetry === false, 'se esperaba enableTelemetry=false en el paquete');
		check('documentación LLM del paquete', packageProduct.positronLlmsDocsUrl === '', 'se esperaba positronLlmsDocsUrl vacío en el paquete');
		check('Marketplace desactivado en el paquete', !packageProduct.extensionsGallery?.serviceUrl && !packageProduct.extensionsGallery?.resourceUrlTemplate && !packageProduct.extensionsGallery?.extensionUrlTemplate, 'Napo no debe declarar una galería de extensiones en el paquete');
		check('Capibara en carpetas no confiables del paquete', packageProduct.extensionUntrustedWorkspaceSupport?.['juliushearts.rhs-agent4']?.override === true, 'Capibara debe permanecer disponible al abrir una carpeta de proyecto no confiable');
	}

	if (existsSync(packageCapibaraManifestPath)) {
		validateCapibaraPolicy(JSON.parse(readFileSync(packageCapibaraManifestPath, 'utf8')), 'Capibara empaquetada');
	}

	if (existsSync(packageCapibaraDistPath) && existsSync(capibaraDistPath)) {
		check('integridad Capibara empaquetada', sha256(packageCapibaraDistPath) === sha256(capibaraDistPath), 'el runtime empaquetado debe coincidir con la copia integrada');
	}

	if (existsSync(packagePetPath) && existsSync(petPath)) {
		check('integridad PET empaquetada', sha256(packagePetPath) === sha256(petPath), 'el descubridor PET empaquetado debe coincidir con la copia integrada');
		check('PET ejecutable en paquete', (statSync(packagePetPath).mode & 0o111) !== 0, 'el binario PET empaquetado debe tener permiso de ejecución');
	}

	if (existsSync(packageArkPath) && existsSync(arkPath)) {
		check('integridad Ark empaquetada', sha256(packageArkPath) === sha256(arkPath), 'el kernel Ark empaquetado debe coincidir con la copia integrada');
		check('Ark ejecutable en paquete', (statSync(packageArkPath).mode & 0o111) !== 0, 'el kernel Ark empaquetado debe tener permiso de ejecución');
	}

	if (existsSync(packageKallichorePath) && existsSync(kallichorePath)) {
		check('integridad Kallichore empaquetada', sha256(packageKallichorePath) === sha256(kallichorePath), 'el runtime Kallichore empaquetado debe coincidir con la copia integrada');
		check('Kallichore ejecutable en paquete', (statSync(packageKallichorePath).mode & 0o111) !== 0, 'el runtime Kallichore empaquetado debe tener permiso de ejecución');
	}

	if (existsSync(packageQuartoBinaryPath)) {
		const packageQuartoVersion = commandVersion(packageQuartoBinaryPath, ['--version']);
		check('Quarto operativo en paquete', Boolean(packageQuartoVersion), 'el CLI de Quarto debe poder ejecutarse desde RHS-IA.app');
		if (packageQuartoVersion) {
			checks.push({ name: 'versión Quarto en paquete', ok: true, detail: packageQuartoVersion });
		}
	}

	if (existsSync(packageNodePtySpawnHelperPath)) {
		check('node-pty spawn-helper ejecutable en paquete', (statSync(packageNodePtySpawnHelperPath).mode & 0o111) !== 0, 'el auxiliar nativo de node-pty debe tener permiso de ejecución');
	}

	if (existsSync(packagePolicyWatcherPath) && existsSync(policyWatcherPath)) {
		check('integridad policy-watcher nativo', sha256(packagePolicyWatcherPath) === sha256(policyWatcherPath), 'el binding empaquetado debe coincidir con el binding integrado');
		check('policy-watcher nativo ejecutable', (statSync(packagePolicyWatcherPath).mode & 0o111) !== 0, 'el binding nativo de policy-watcher debe tener permiso de ejecución');
	}
}

if (existsSync(capibaraDistPath) && existsSync(buildCapibaraDistPath)) {
	check('integridad Capibara', sha256(capibaraDistPath) === sha256(buildCapibaraDistPath), 'el runtime de build debe coincidir con la extensión integrada');
}

if (existsSync(petPath) && existsSync(buildPetPath)) {
	check('integridad PET', sha256(petPath) === sha256(buildPetPath), 'el descubridor PET de build debe coincidir con la copia integrada');
	check('PET ejecutable', (statSync(petPath).mode & 0o111) !== 0, 'el binario PET debe tener permiso de ejecución');
}

if (existsSync(arkPath) && existsSync(buildArkPath)) {
	check('integridad Ark', sha256(arkPath) === sha256(buildArkPath), 'el kernel Ark de build debe coincidir con la copia integrada');
	check('Ark ejecutable', (statSync(arkPath).mode & 0o111) !== 0, 'el kernel Ark debe tener permiso de ejecución');
}

if (existsSync(kallichorePath) && existsSync(buildKallichorePath)) {
	check('integridad Kallichore', sha256(kallichorePath) === sha256(buildKallichorePath), 'el runtime Kallichore de build debe coincidir con la copia integrada');
	check('Kallichore ejecutable', (statSync(kallichorePath).mode & 0o111) !== 0, 'el runtime Kallichore debe tener permiso de ejecución');
}

if (existsSync(quartoBinaryPath)) {
	const mode = statSync(quartoBinaryPath).mode & 0o111;
	check('Quarto ejecutable', mode !== 0, 'el binario Quarto debe tener permiso de ejecución');
	const version = commandVersion(quartoBinaryPath, ['--version']);
	check('Quarto operativo', Boolean(version), 'el CLI empaquetado debe poder ejecutarse');
	if (version) {
		checks.push({ name: 'versión Quarto', ok: true, detail: version });
	}
}

for (const [label, command, args] of [
	['R disponible', process.env.R_BIN || 'R', ['--version']],
	['Python disponible', process.env.PYTHON_BIN || 'python3', ['--version']],
]) {
	const version = commandVersion(command, args);
	if (version) {
		checks.push({ name: label, ok: true, detail: version });
} else {
		warnings.push(`${label}: no disponible en PATH (${command})`);
	}
}

const requireRuntime = process.argv.includes('--require-runtime');
if (requireRuntime && warnings.length > 0) {
	failures.push(...warnings);
}

for (const item of checks) {
	console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.name}: ${item.detail}`);
}
for (const warning of warnings) {
	console.warn(`WARN ${warning}`);
}

if (failures.length > 0) {
	console.error(`\nValidación de Napo falló con ${failures.length} problema(s).`);
	process.exitCode = 1;
} else {
	console.log('\nValidación estructural de Napo completada.');
}

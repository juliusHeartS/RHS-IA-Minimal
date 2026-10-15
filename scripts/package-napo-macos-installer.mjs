import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const appPath = path.resolve(process.argv[2] ?? path.join(root, 'dist', 'RHS-IA.app'));
const outDir = path.resolve(process.argv[3] ?? path.join(root, 'dist'));
const installerName = process.argv[4] ?? 'RHS-IA-Preview-macOS-arm64.dmg';
const stagedAppName = 'RHS-IA-Preview.app';
const artifactPath = path.join(outDir, installerName);

function fail(message) {
	throw new Error(message);
}

function readPlistValue(plistPath, key) {
	try {
		return execFileSync('plutil', ['-extract', key, 'raw', '-o', '-', plistPath], { encoding: 'utf8' }).trim();
	} catch {
		return undefined;
	}
}

function sha256(filePath) {
	const hash = crypto.createHash('sha256');
	const stream = fs.createReadStream(filePath);
	return new Promise((resolve, reject) => {
		stream.on('data', chunk => hash.update(chunk));
		stream.on('error', reject);
		stream.on('end', () => resolve(hash.digest('hex')));
	});
}

function run(command, args) {
	console.log(`$ ${command} ${args.join(' ')}`);
	execFileSync(command, args, { stdio: 'inherit' });
}

function validateApp() {
	if (process.platform !== 'darwin') {
		fail('El instalador de Napo para macOS solo se puede generar en macOS.');
	}
	if (!fs.existsSync(appPath)) {
		fail(`No existe la aplicación que se debe empaquetar: ${appPath}`);
	}
	const plistPath = path.join(appPath, 'Contents', 'Info.plist');
	const productPath = path.join(appPath, 'Contents', 'Resources', 'app', 'product.json');
	const executablePath = path.join(appPath, 'Contents', 'MacOS', 'RHS-IA');
	if (!fs.existsSync(plistPath) || !fs.existsSync(productPath) || !fs.existsSync(executablePath)) {
		fail(`La aplicación no tiene una estructura Napo válida: ${appPath}`);
	}

	const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
	const identity = {
		nameShort: product.nameShort,
		nameLong: product.nameLong,
		applicationName: product.applicationName,
		dataFolderName: product.dataFolderName,
		sharedDataFolderName: product.sharedDataFolderName,
		darwinBundleIdentifier: product.darwinBundleIdentifier,
		enableTelemetry: product.enableTelemetry,
		bundleIdentifier: readPlistValue(plistPath, 'CFBundleIdentifier'),
		displayName: readPlistValue(plistPath, 'CFBundleDisplayName'),
		executable: readPlistValue(plistPath, 'CFBundleExecutable')
	};

	const expected = {
		nameShort: 'RHS-IA',
		nameLong: 'RHS-IA',
		applicationName: 'napo',
		dataFolderName: '.napo',
		sharedDataFolderName: '.napo-shared',
		darwinBundleIdentifier: 'org.rhsia.napo',
		enableTelemetry: false,
		bundleIdentifier: 'org.rhsia.napo',
		displayName: 'RHS-IA',
		executable: 'RHS-IA'
	};
	for (const [key, value] of Object.entries(expected)) {
		if (identity[key] !== value) {
			fail(`Identidad inesperada en ${key}: se esperaba ${JSON.stringify(value)}, se obtuvo ${JSON.stringify(identity[key])}`);
		}
	}

	return { plistPath, productPath, executablePath, identity };
}

function installedRhsIaIdentity() {
	const installedApp = '/Applications/RHS-IA.app';
	const plistPath = path.join(installedApp, 'Contents', 'Info.plist');
	if (!fs.existsSync(plistPath)) {
		return null;
	}
	return {
		path: installedApp,
		bundleIdentifier: readPlistValue(plistPath, 'CFBundleIdentifier'),
		displayName: readPlistValue(plistPath, 'CFBundleDisplayName')
	};
}

async function main() {
	const { identity } = validateApp();
	fs.mkdirSync(outDir, { recursive: true });
	if (fs.existsSync(artifactPath)) {
		fs.unlinkSync(artifactPath);
	}

	const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'napo-installer-'));
	const stagedAppPath = path.join(stageRoot, stagedAppName);
	try {
		console.log(`Preparando instalador desde ${appPath}`);
		run('ditto', [appPath, stagedAppPath]);
		fs.symlinkSync('/Applications', path.join(stageRoot, 'Applications'));
		run('hdiutil', [
			'create',
			'-volname', 'RHS-IA Preview',
			'-srcfolder', stageRoot,
			'-ov',
			'-format', 'UDZO',
			artifactPath
		]);
	} finally {
		fs.rmSync(stageRoot, { recursive: true, force: true });
	}

	if (!fs.existsSync(artifactPath)) {
		fail(`No se creó el instalador: ${artifactPath}`);
	}

	const stats = fs.statSync(artifactPath);
	const report = {
		generatedAt: new Date().toISOString(),
		platform: process.platform,
		architecture: process.arch,
		application: appPath,
		installer: artifactPath,
		installerName,
		installerBytes: stats.size,
		installerSha256: await sha256(artifactPath),
		identity,
		parallelInstall: {
			installedRhsIa: installedRhsIaIdentity(),
			appName: stagedAppName,
			applicationDirectory: '/Applications',
			coexistence: 'RHS-IA Preview uses a distinct application bundle filename, bundle identifier and data folders.'
		},
		notarization: 'notarized: false; the user must approve opening the freely distributed app in macOS if Gatekeeper asks.'
	};
	const reportPath = path.join(root, 'reports', 'napo-macos-installer.json');
	fs.mkdirSync(path.dirname(reportPath), { recursive: true });
	fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

	console.log(`Instalador creado: ${artifactPath}`);
	console.log(`SHA-256: ${report.installerSha256}`);
	console.log(`Informe: ${reportPath}`);
}

main().catch(error => {
	console.error(`No se pudo crear el instalador de Napo: ${error.message}`);
	process.exitCode = 1;
});

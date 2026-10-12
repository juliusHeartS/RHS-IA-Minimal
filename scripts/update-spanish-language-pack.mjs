/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2024-2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VSCODE_LOC_REPO = 'https://github.com/microsoft/vscode-loc.git';
const VSCODE_LOC_REVISION = 'a18342021e6a1ac3329497351e50cfb33dbac367';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const packageJsonPath = path.join(repoRoot, 'package.json');
const productJsonPath = path.join(repoRoot, 'product.json');
const vscodeLocPath = path.join(repoRoot, '.build', 'vscode-loc');
const sourceLanguagePackPath = path.join(vscodeLocPath, 'i18n', 'vscode-language-pack-es');
const generatedRoot = path.join(repoRoot, '.build', 'spanish-language-pack');
const generatedLanguagePackPath = path.join(generatedRoot, 'vscode-language-pack-es');
const outputDirectory = path.join(repoRoot, 'language-packs');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const productJson = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
const extensionVersion = packageJson.version;
const vsixRelativePath = `language-packs/vscode-language-pack-es-${extensionVersion}.vsix`;
const vsixPath = path.join(repoRoot, vsixRelativePath);

function run(command, args, options = {}) {
	console.log(`$ ${[command, ...args].join(' ')}`);
	childProcess.execFileSync(command, args, {
		cwd: repoRoot,
		stdio: 'inherit',
		...options
	});
}

function ensureVscodeLoc() {
	if (!fs.existsSync(vscodeLocPath)) {
		fs.mkdirSync(path.dirname(vscodeLocPath), { recursive: true });
		run('git', ['clone', VSCODE_LOC_REPO, vscodeLocPath]);
	}

	run('git', ['fetch', '--depth', '1', 'origin', VSCODE_LOC_REVISION], { cwd: vscodeLocPath });
	run('git', ['checkout', '--detach', 'FETCH_HEAD'], { cwd: vscodeLocPath });
}

function normalizeLanguagePack() {
	fs.rmSync(generatedLanguagePackPath, { recursive: true, force: true });
	fs.mkdirSync(generatedRoot, { recursive: true });
	fs.cpSync(sourceLanguagePackPath, generatedLanguagePackPath, {
		recursive: true,
		filter: source => !source.endsWith('.zip')
	});
	fs.copyFileSync(
		path.join(vscodeLocPath, 'LICENSE.md'),
		path.join(generatedLanguagePackPath, 'LICENSE.md')
	);

	const languagePackPackagePath = path.join(generatedLanguagePackPath, 'package.json');
	const languagePackPackage = JSON.parse(fs.readFileSync(languagePackPackagePath, 'utf8'));
	languagePackPackage.version = extensionVersion;
	languagePackPackage.engines = { vscode: `^${extensionVersion}` };
	languagePackPackage.publisher = 'ms-ceintl';

	const localizations = languagePackPackage.contributes?.localizations;
	if (!Array.isArray(localizations) || localizations.length === 0) {
		throw new Error('Spanish language pack does not define contributes.localizations');
	}

	if (!Array.isArray(localizations[0].translations)) {
		throw new Error('Spanish language pack does not define localization translations');
	}

	fs.writeFileSync(languagePackPackagePath, `${JSON.stringify(languagePackPackage, null, '\t')}\n`);
}

function packageLanguagePack() {
	fs.mkdirSync(outputDirectory, { recursive: true });
	fs.rmSync(vsixPath, { force: true });
	run('npx', ['@vscode/vsce', 'package', '--no-dependencies', '--out', vsixPath], {
		cwd: generatedLanguagePackPath
	});
}

function updateProductJson() {
	const vsix = fs.readFileSync(vsixPath);
	const sha256 = crypto.createHash('sha256').update(vsix).digest('hex');
	const extension = {
		name: 'ms-ceintl.vscode-language-pack-es',
		version: extensionVersion,
		sha256,
		repo: VSCODE_LOC_REPO,
		vsix: vsixRelativePath,
		metadata: {
			id: '47e020a1-33db-4cc0-a1b4-42f97781749a',
			publisherId: {
				publisherId: '0b0882c3-aee3-4d7c-b5f9-872f9be0a115',
				publisherName: 'MS-CEINTL',
				displayName: 'Microsoft',
				flags: 'verified'
			},
			publisherDisplayName: 'Microsoft'
		}
	};

	const builtInExtensions = productJson.builtInExtensions ?? [];
	const existingIndex = builtInExtensions.findIndex(candidate => candidate.name === extension.name);
	if (existingIndex === -1) {
		builtInExtensions.push(extension);
	} else {
		builtInExtensions[existingIndex] = {
			...builtInExtensions[existingIndex],
			...extension
		};
	}
	productJson.builtInExtensions = builtInExtensions;

	fs.writeFileSync(productJsonPath, `${JSON.stringify(productJson, null, '\t')}\n`);
	console.log(`Updated ${vsixRelativePath}`);
	console.log(`Spanish language pack SHA: ${sha256}`);
}

ensureVscodeLoc();
normalizeLanguagePack();
packageLanguagePack();
updateProductJson();

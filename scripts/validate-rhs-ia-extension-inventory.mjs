/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'node:assert/strict';
import fs from 'node:fs';

const product = JSON.parse(fs.readFileSync('product.json', 'utf8'));
const extensionsBuildSource = fs.readFileSync('build/lib/extensions.ts', 'utf8');
const extensionTagMap = JSON.parse(fs.readFileSync('.github/workflows/extensions-tag-map.json', 'utf8'));

const forbiddenExtensionIds = [
	'posit.publisher',
	'github.vscode-pull-request-github',
	'posit.assistant',
	'github.copilot-chat'
];

const bundledExtensionIds = [
	...(product.builtInExtensions ?? []),
	...(product.webBuiltInExtensions ?? []),
	...(product.bootstrapExtensions ?? [])
].map(extension => extension.name.toLowerCase());

const requiredBuiltInExtensionIds = [
	'ms-vscode.js-debug-companion',
	'ms-vscode.js-debug',
	'ms-vscode.vscode-js-profile-table',
	'rstudio.rstudio-workbench',
	'posit.slc',
	'ms-ceintl.vscode-language-pack-es'
];
const requiredBootstrapExtensionIds = [
	'charliermarsh.ruff',
	'ms-toolsai.vscode-jupyter-cell-tags',
	'ms-toolsai.jupyter-keymap',
	'ms-toolsai.vscode-jupyter-slideshow',
	'ms-toolsai.jupyter-renderers',
	'ms-toolsai.jupyter',
	'meta.pyrefly',
	'ms-python.debugpy',
	'quarto.quarto',
	'posit.air-vscode',
	'posit.shiny'
];
for (const extensionId of [...requiredBuiltInExtensionIds, ...requiredBootstrapExtensionIds]) {
	assert.ok(
		bundledExtensionIds.includes(extensionId),
		`${extensionId} must remain in the RHS-IA product extension catalogs`
	);
}
for (const extensionId of requiredBootstrapExtensionIds) {
	assert.ok(
		Object.keys(extensionTagMap).some(taggedId => taggedId.toLowerCase() === extensionId),
		`${extensionId} must remain in the bootstrap extension update metadata`
	);
}

for (const extensionId of forbiddenExtensionIds) {
	assert.ok(
		!bundledExtensionIds.includes(extensionId),
		`${extensionId} must not be included in the RHS-IA product extension catalogs`
	);
	assert.ok(
		!Object.keys(extensionTagMap).some(taggedId => taggedId.toLowerCase() === extensionId),
		`${extensionId} must not be included in the bootstrap extension update metadata`
	);
}

assert.ok(
	Array.isArray(product.builtInExtensionsEnabledWithAutoUpdates),
	'builtInExtensionsEnabledWithAutoUpdates must remain an array even when no extensions are enabled'
);
assert.deepStrictEqual(
	product.builtInExtensionsEnabledWithAutoUpdates,
	[],
	'builtInExtensionsEnabledWithAutoUpdates must remain empty'
);

const autoUpdatedExtensionIds = product.builtInExtensionsEnabledWithAutoUpdates
	.map(extensionId => extensionId.toLowerCase());
for (const extensionId of forbiddenExtensionIds) {
	assert.ok(
		!autoUpdatedExtensionIds.includes(extensionId),
		`${extensionId} must not be enabled through automatic built-in extension updates`
	);
}

assert.ok(
	!Object.keys(product.extensionEnabledApiProposals ?? []).some(extensionId => extensionId.toLowerCase() === 'github.vscode-pull-request-github'),
	'GitHub Pull Requests must not retain proposed API access after removal'
);

const excludedExtensionsMatch = extensionsBuildSource.match(/const excludedExtensions = \[([\s\S]*?)\n\];/);
assert.ok(excludedExtensionsMatch, 'Unable to locate excludedExtensions in build/lib/extensions.ts');
assert.match(
	excludedExtensionsMatch[1],
	/["']github["']/,
	'The source-built vscode.github extension must be excluded from packaged RHS-IA builds'
);
assert.match(
	excludedExtensionsMatch[1],
	/["']github-authentication["']/,
	'The source-built vscode.github-authentication extension must be excluded from packaged RHS-IA builds'
);
assert.match(
	excludedExtensionsMatch[1],
	/["']copilot["']/,
	'The source-built GitHub Copilot Chat extension must be excluded from packaged RHS-IA builds'
);

assert.ok(
	!fs.existsSync('extensions/copilot/package.json'),
	'The GitHub Copilot Chat extension source must not be present in RHS-IA'
);

const productAssemblyFiles = [
	'package.json',
	'build/npm/dirs.ts',
	'build/gulpfile.extensions.ts',
	'build/gulpfile.vscode.ts',
	'build/gulpfile.reh.ts',
	'build/azure-pipelines/product-build.yml',
	'build/azure-pipelines/alpine/product-build-alpine.yml',
	'build/azure-pipelines/web/product-build-web.yml',
	'build/azure-pipelines/darwin/steps/product-build-darwin-compile.yml',
	'build/azure-pipelines/darwin/steps/product-build-darwin-test.yml',
	'build/azure-pipelines/linux/steps/product-build-linux-compile.yml',
	'build/azure-pipelines/linux/steps/product-build-linux-test.yml',
	'build/azure-pipelines/win32/steps/product-build-win32-compile.yml',
	'build/azure-pipelines/win32/steps/product-build-win32-test.yml'
];
const forbiddenAssemblyPattern = /extensions\/copilot|compileCopilotExtensionBuildTask|downloadCopilotVsix|product-copilot|copilot\/test-integration-steps/;
for (const file of productAssemblyFiles) {
	assert.doesNotMatch(
		fs.readFileSync(file, 'utf8'),
		forbiddenAssemblyPattern,
		`${file} must not install, package, download, or test the removed GitHub Copilot Chat extension`
	);
}

assert.ok(
	fs.existsSync('extensions/git/package.json'),
	'The Git extension must remain available'
);
assert.ok(
	fs.existsSync('extensions/git-base/package.json'),
	'The Git Base extension must remain available'
);

console.log('Validated the RHS-IA extension inventory exclusions.');

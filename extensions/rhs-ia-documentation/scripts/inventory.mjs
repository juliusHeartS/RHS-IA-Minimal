/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultUpstreamRoot = path.resolve(extensionRoot, '..', '..', '..', 'rhs-ia-documentation', 'positron-website-main');
const upstreamRoot = path.resolve(process.argv[2] ?? defaultUpstreamRoot);
const manifestRoot = path.join(extensionRoot, 'manifests');
const baselineRoot = path.join(extensionRoot, 'upstream');

const contentExtensions = new Set(['.qmd', '.md', '.yml', '.yaml', '.html']);
const assetExtensions = new Set([
	'.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
	'.mp4', '.webm', '.mov', '.woff', '.woff2', '.ttf', '.otf'
]);
const ignoredDirectories = new Set(['.git', '_freeze']);
const ignoredFiles = new Set(['.DS_Store']);

const navigation = JSON.parse(await fs.readFile(path.join(manifestRoot, 'navigation.json'), 'utf8'));
const navigationPages = navigation.sections.flatMap(section => section.pages);
const navigationBySource = new Map(navigationPages.map(page => [page.source, page.id]));
const allFiles = await walk(upstreamRoot);
const allFileSet = new Set(allFiles);

const content = [];
const assets = [];
const references = [];

for (const relativePath of allFiles) {
	const extension = path.extname(relativePath).toLowerCase();
	const absolutePath = path.join(upstreamRoot, relativePath);
	if (contentExtensions.has(extension)) {
		const text = await fs.readFile(absolutePath, 'utf8');
		const decision = classifyContent(relativePath);
		content.push({
			source: relativePath,
			kind: contentKind(relativePath),
			disposition: decision.disposition,
			reason: decision.reason,
			targetId: navigationBySource.get(relativePath) ?? null,
			assistantReferences: /\b(?:assistant|databot|ai features?)\b/i.test(text),
			upstreamBrandReferences: /\b(?:positron|posit software|posit\.co)\b/i.test(text),
			screenshotsReplace: /!\[[^\]]*\]\([^)]*\.(?:png|jpe?g|gif|webp)/i.test(text),
			translate: decision.disposition !== 'REMOVE',
		});
		references.push(...extractReferences(relativePath, text));
	} else {
		assets.push(classifyAsset(relativePath));
		if (extension === '.css' || extension === '.js' || extension === '.mjs') {
			const text = await fs.readFile(absolutePath, 'utf8');
			references.push(...extractReferences(relativePath, text));
		}
	}
}

for (const reference of references) {
	reference.resolvedTarget = resolveReference(reference.source, reference.target);
}

content.sort(bySource);
assets.sort(bySource);
references.sort((left, right) => left.source.localeCompare(right.source) || left.target.localeCompare(right.target));

await fs.mkdir(manifestRoot, { recursive: true });
await fs.mkdir(baselineRoot, { recursive: true });
await writeJson(path.join(manifestRoot, 'content.json'), { schemaVersion: 1, generatedFrom: relative(upstreamRoot), entries: content });
await writeJson(path.join(manifestRoot, 'assets.json'), { schemaVersion: 1, generatedFrom: relative(upstreamRoot), entries: assets });
await writeJson(path.join(manifestRoot, 'upstream-references.json'), { schemaVersion: 1, entries: references });

const baseline = await createBaseline(allFiles);
await writeJson(path.join(baselineRoot, 'baseline.json'), baseline);

console.log(`Inventoried ${content.length} content files, ${assets.length} assets, and ${references.length} references.`);
console.log(`Snapshot SHA-256: ${baseline.snapshotTreeSha256}`);

function classifyContent(relativePath) {
	const name = path.posix.basename(relativePath).toLowerCase();
	const aiPattern = /(?:^|[-_])(assistant|databot|ai)(?:[-_.]|$)/;
	if (aiPattern.test(name)) {
		return { disposition: 'REMOVE', reason: 'upstream-ai-system' };
	}
	if (name === 'updating.qmd') {
		return { disposition: 'REMOVE', reason: 'updating-excluded' };
	}
	if (name === 'publish-to-connect.qmd') {
		return { disposition: 'REMOVE', reason: 'publisher-workflow-excluded' };
	}
	if (name.startsWith('migrate-') || name.startsWith('tutorial-migrate-')) {
		return { disposition: 'REMOVE', reason: 'migration-guide-excluded' };
	}
	if (['404.qmd', 'download.qmd', 'education.qmd', 'features.qmd', 'feedback.qmd', 'index.qmd', 'older-releases.qmd', 'privacy.qmd', 'release-notes.qmd'].includes(name)) {
		return { disposition: 'REMOVE', reason: 'public-site-content' };
	}
	if (['claude.md', 'readme.md'].includes(name)) {
		return { disposition: 'REMOVE', reason: 'upstream-maintainer-material' };
	}
	if (name === 'license.md') {
		return { disposition: 'KEEP', reason: 'upstream-documentation-license' };
	}
	if (name === 'licensing.qmd') {
		return { disposition: 'REMOVE', reason: 'posit-infrastructure' };
	}
	if (name === 'about.qmd') {
		return { disposition: 'REWRITE', reason: 'rhs-ia-product-content-required' };
	}
	if (navigationBySource.has(relativePath)) {
		return { disposition: 'REVIEW', reason: 'rhs-ia-behavior-not-yet-verified' };
	}
	return { disposition: 'REVIEW', reason: 'not-yet-classified-for-production' };
}

function classifyAsset(relativePath) {
	const extension = path.extname(relativePath).toLowerCase();
	if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.mp4', '.webm', '.mov'].includes(extension)) {
		return { source: relativePath, kind: 'media', disposition: 'RECREATE', reason: 'upstream-visual-review-required' };
	}
	if (assetExtensions.has(extension)) {
		return { source: relativePath, kind: extension.slice(1), disposition: 'REVIEW', reason: 'runtime-dependency-review-required' };
	}
	return { source: relativePath, kind: 'support', disposition: 'REVIEW', reason: 'upstream-build-support-review-required' };
}

function contentKind(relativePath) {
	const name = path.posix.basename(relativePath);
	if (name.startsWith('_') && name.endsWith('.qmd')) {
		return 'include';
	}
	if (name.endsWith('.qmd')) {
		return 'page';
	}
	if (name.endsWith('.yml') || name.endsWith('.yaml')) {
		return 'configuration';
	}
	if (name.endsWith('.html')) {
		return 'html-include';
	}
	return 'markdown';
}

function extractReferences(source, text) {
	const found = [];
	const patterns = [
		/!?\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g,
		/\b(?:src|href)\s*=\s*['"]([^'"]+)['"]/gi,
		/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi,
		/\{\{<\s*include\s+([^\s>]+)\s*>\}\}/gi,
	];
	for (const pattern of patterns) {
		for (const match of text.matchAll(pattern)) {
			const target = match[1].replace(/^<|>$/g, '');
			found.push({
				source,
				target,
				kind: /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//') ? 'external' : 'local',
			});
		}
	}
	return found;
}

function resolveReference(source, target) {
	if (target.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//') || /[{}$]/.test(target)) {
		return null;
	}

	let decodedTarget;
	try {
		decodedTarget = decodeURIComponent(target.split(/[?#]/, 1)[0]);
	} catch {
		return null;
	}
	if (!decodedTarget) {
		return null;
	}

	const sourceDirectory = path.posix.dirname(source);
	const candidate = path.posix.normalize(decodedTarget.startsWith('/')
		? decodedTarget.slice(1)
		: path.posix.join(sourceDirectory, decodedTarget));
	if (candidate === '..' || candidate.startsWith('../')) {
		return null;
	}
	if (allFileSet.has(candidate)) {
		return candidate;
	}

	if (candidate.endsWith('.html')) {
		const qmdCandidate = `${candidate.slice(0, -'.html'.length)}.qmd`;
		if (allFileSet.has(qmdCandidate)) {
			return qmdCandidate;
		}
	}

	return null;
}

async function createBaseline(files) {
	const treeHash = createHash('sha256');
	const fileRecords = [];
	for (const file of files) {
		const bytes = await fs.readFile(path.join(upstreamRoot, file));
		const sha256 = createHash('sha256').update(bytes).digest('hex');
		fileRecords.push({ path: file, sha256 });
		treeHash.update(`${file}\0${sha256}\n`);
	}
	const quartoVersionPath = path.join(upstreamRoot, '.quarto-version');
	let upstreamQuartoVersion = null;
	try {
		upstreamQuartoVersion = (await fs.readFile(quartoVersionPath, 'utf8')).trim();
	} catch {
		// The snapshot digest is still a valid baseline without this optional file.
	}
	return {
		schemaVersion: 1,
		upstreamRepository: 'https://github.com/posit-dev/positron-website',
		upstreamCommit: null,
		upstreamCommitStatus: 'unresolved-snapshot-has-no-git-metadata',
		upstreamQuartoVersion,
		rhsIaDocumentationBaseline: 1,
		snapshotPath: relative(upstreamRoot),
		snapshotTreeSha256: treeHash.digest('hex'),
		fileCount: files.length,
		license: 'CC BY-SA 4.0',
		files: fileRecords,
	};
}

async function walk(root) {
	const result = [];
	async function visit(directory, prefix = '') {
		const entries = await fs.readdir(directory, { withFileTypes: true });
		entries.sort((left, right) => left.name.localeCompare(right.name));
		for (const entry of entries) {
			if (ignoredFiles.has(entry.name) || (entry.isDirectory() && ignoredDirectories.has(entry.name))) {
				continue;
			}
			const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
			if (entry.isDirectory()) {
				await visit(path.join(directory, entry.name), relativePath);
			} else if (entry.isFile()) {
				result.push(relativePath);
			}
		}
	}
	await visit(root);
	return result;
}

async function writeJson(filePath, value) {
	await fs.writeFile(filePath, `${JSON.stringify(value, null, '\t')}\n`, 'utf8');
}

function relative(value) {
	return path.relative(extensionRoot, value).split(path.sep).join('/');
}

function bySource(left, right) {
	return left.source.localeCompare(right.source);
}

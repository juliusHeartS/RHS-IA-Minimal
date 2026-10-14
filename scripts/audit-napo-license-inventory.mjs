import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { caseIdFor, loadDecisionRegistry } from './napo-license-decisions.mjs';

const root = resolve(import.meta.dirname, '..');

function argument(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function sha256(path) {
	return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function relativePosix(base, path) {
	return relative(base, path).split(sep).join('/');
}

function isLicenseName(name) {
	return /^(license|licence|notice|thirdpartynotices?|third[-_ ]party[-_ ]notices?|copying|copyright)([._-]|$)/i.test(name);
}

function isIgnoredDirectory(name) {
	return new Set(['.git', 'node_modules', '.build', 'out', 'dist/runtime']).has(name);
}

function walkFiles(directory, predicate, output = []) {
	if (!existsSync(directory)) {
		return output;
	}
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
			continue;
		}
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			walkFiles(path, predicate, output);
		} else if (predicate(path, entry.name)) {
			output.push(path);
		}
	}
	return output;
}

function readManifest(path) {
	try {
		const manifest = JSON.parse(readFileSync(path, 'utf8'));
		return {
			path,
			name: manifest.name ?? null,
			version: manifest.version ?? null,
			publisher: manifest.publisher ?? null,
			license: manifest.license ?? null,
			repository: manifest.repository ?? null,
		};
	} catch {
		return { path, parseError: true };
	}
}

function inventoryFiles(base, paths) {
	return paths
		.filter((path) => existsSync(path) && lstatSync(path).isFile())
		.map((path) => ({
			path: relativePosix(base, path),
			size: lstatSync(path).size,
			sha256: sha256(path),
		}))
		.sort((left, right) => left.path.localeCompare(right.path));
}

function findLegalFiles(manifestPath) {
	const directory = resolve(manifestPath, '..');
	const candidates = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (entry.isFile() && isLicenseName(entry.name)) {
			candidates.push(join(directory, entry.name));
		}
	}
	for (const name of ['dist/LICENSES', 'LICENSES']) {
		const licenseDirectory = join(directory, name);
		candidates.push(...walkFiles(licenseDirectory, (_path, fileName) => isLicenseName(fileName) || fileName.endsWith('.txt')));
	}
	return [...new Set(candidates)].sort();
}

function assessLicense(manifest) {
	if (manifest.parseError) {
		return 'manifest-unreadable';
	}
	const declared = String(manifest.license ?? '').trim();
	const pointsToFile = /^see license$/i.test(declared);
	if (declared && !pointsToFile) {
		return 'manifest-declared';
	}
	if (pointsToFile && manifest.legalFiles.length > 0) {
		return 'manifest-points-to-local-file';
	}
	if (pointsToFile) {
		return 'manifest-points-to-missing-file';
	}
	if (manifest.legalFiles.length > 0) {
		return 'local-file-without-manifest-declaration';
	}
	return 'missing-manifest-and-local-file';
}

const packageArgument = argument('--package');
const packageRoot = packageArgument ? resolve(root, packageArgument) : undefined;
const scanRoot = packageRoot ? join(packageRoot, 'Contents', 'Resources', 'app') : root;
const outputPath = resolve(root, argument('--out') ?? 'reports/napo-license-inventory.json');
const requireHumanReview = process.argv.includes('--require-human-review');
const decisionsPath = resolve(root, argument('--decisions') ?? 'reports/napo-license-decisions.json');
const releasePath = resolve(root, argument('--release') ?? 'reports/napo-release-manifest.json');

if (!existsSync(scanRoot)) {
	console.error(`No existe el árbol a auditar: ${scanRoot}`);
	process.exit(1);
}

const manifestRoot = join(scanRoot, 'extensions');
const manifestPaths = walkFiles(manifestRoot, (_path, name) => name === 'package.json').sort();
const manifests = manifestPaths.map(readManifest).map((manifest) => ({
	...manifest,
	path: relativePosix(scanRoot, manifest.path),
	legalFiles: inventoryFiles(scanRoot, findLegalFiles(manifest.path)),
})).map((manifest) => ({
	...manifest,
	licenseEvidence: assessLicense(manifest),
}));

const topLevelLegalPaths = [
	join(scanRoot, 'LICENSE.txt'),
	join(scanRoot, 'LICENSE'),
	join(scanRoot, 'NOTICE'),
	join(scanRoot, 'THIRD_PARTY_NOTICES.md'),
	join(scanRoot, 'ThirdPartyNotices.txt'),
	join(scanRoot, 'ThirdPartyNotices.md'),
];
const legalFiles = inventoryFiles(scanRoot, [
	...topLevelLegalPaths,
	...walkFiles(manifestRoot, (_path, name) => isLicenseName(name)),
	...walkFiles(join(manifestRoot, 'rhs-agent4', 'dist', 'LICENSES'), (_path, name) => name.endsWith('.txt')),
]);

const unresolved = manifests
	.filter((manifest) => manifest.parseError || !manifest.license || /^see license$/i.test(String(manifest.license).trim()))
	.map((manifest) => ({ path: manifest.path, name: manifest.name, reason: manifest.parseError ? 'manifest no legible' : 'license no declarada o remite a archivo' }));

const inventoryRoot = packageRoot ? relativePosix(root, packageRoot) : '.';
const release = existsSync(releasePath) ? JSON.parse(readFileSync(releasePath, 'utf8')) : null;
const decisionRegistry = loadDecisionRegistry(decisionsPath, release?.treeSha256);
const reviewCases = unresolved.map((item) => ({
	...item,
	caseId: caseIdFor(inventoryRoot, item.path),
	decision: decisionRegistry.decisions[caseIdFor(inventoryRoot, item.path)]?.decision ?? null,
}));
const approvedReviewCases = reviewCases.filter((item) => item.decision === 'approved');
const rejectedReviewCases = reviewCases.filter((item) => item.decision === 'rejected');
const pendingReviewCases = reviewCases.filter((item) => !['approved', 'rejected'].includes(item.decision));

const report = {
	format: 1,
	product: 'Napo',
	scope: packageRoot ? 'macOS application package' : 'integrated destination tree',
	root: inventoryRoot,
	manifestCount: manifests.length,
	manifests,
	legalFiles,
	unresolved,
	licenseEvidenceSummary: manifests.reduce((summary, manifest) => {
		summary[manifest.licenseEvidence] = (summary[manifest.licenseEvidence] ?? 0) + 1;
		return summary;
	}, {}),
	decision: pendingReviewCases.length === 0 && rejectedReviewCases.length === 0
		? 'human-review-approved'
		: unresolved.length > 0 ? 'human-review-required' : 'inventory-complete-pending-legal-approval',
	review: {
		decisionsPath: relativePosix(root, decisionsPath),
		decisionsStatus: decisionRegistry.status,
		approvedCases: approvedReviewCases.length,
		rejectedCases: rejectedReviewCases.length,
		pendingCases: pendingReviewCases.length,
	},
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Inventario escrito: ${relativePosix(root, outputPath)}`);
console.log(`Manifiestos de extensión: ${report.manifestCount}`);
console.log(`Archivos legales con hash: ${report.legalFiles.length}`);
console.log(`Revisión humana pendiente: ${pendingReviewCases.length}`);
console.log(`Revisión humana aprobada: ${approvedReviewCases.length}`);
console.log(`Evidencia de licencia: ${JSON.stringify(report.licenseEvidenceSummary)}`);
if (report.unresolved.length > 0) {
	for (const item of report.unresolved.slice(0, 20)) {
		console.warn(`WARN ${item.path}: ${item.reason}`);
	}
}
if (requireHumanReview && (pendingReviewCases.length > 0 || rejectedReviewCases.length > 0)) {
	console.error(`FALLA: la revisión legal no está completamente aprobada (pendientes=${pendingReviewCases.length}, rechazados=${rejectedReviewCases.length}).`);
	process.exit(1);
}

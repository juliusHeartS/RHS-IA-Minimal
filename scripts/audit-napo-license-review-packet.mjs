import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyDecisionRegistry, caseIdFor, loadDecisionRegistry, summarizeDecisions } from './napo-license-decisions.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function argument(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function relativePosix(base, path) {
	return relative(base, path).split(sep).join('/');
}

function sha256(path) {
	return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function isLegalName(name) {
	return /^(license|licence|notice|thirdpartynotices?|third[-_ ]party[-_ ]notices?|copying|copyright)([._-]|$)/i.test(name);
}

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function legalFiles(directory) {
	if (!existsSync(directory)) return [];
	const paths = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (entry.isFile() && isLegalName(entry.name)) paths.push(join(directory, entry.name));
	}
	return paths.sort().map((path) => ({
		path: relativePosix(root, path),
		size: lstatSync(path).size,
		sha256: sha256(path),
	}));
}

function sourceCandidates(relativeManifestPath, packageName) {
	const sourceRoots = [
		{ id: 'RHS-IA', path: resolve(root, '../RHS-IA') },
		{ id: 'positron', path: resolve(root, '../positron') },
		{ id: 'rhs-agent3', path: resolve(root, '../rhs-agent3') },
		{ id: 'rhs-agent4', path: resolve(root, '../rhs-agent4') },
		{ id: 'vscode', path: resolve(root, '../vscode') },
	];
	const relativeDirectory = dirname(relativeManifestPath);
	const candidates = [];
	for (const source of sourceRoots) {
		const directoryCandidates = [
			join(source.path, relativeDirectory),
			join(source.path, 'src', relativeDirectory),
		];
		if (source.id === 'rhs-agent4' && relativeDirectory.startsWith('extensions/rhs-agent4/')) {
			directoryCandidates.push(join(source.path, 'src', relativeDirectory.slice('extensions/rhs-agent4/'.length)));
		}
		for (const candidateDirectory of directoryCandidates) {
			const candidateManifest = join(candidateDirectory, 'package.json');
			if (!existsSync(candidateManifest)) continue;
			let manifest;
			try {
				manifest = readJson(candidateManifest);
			} catch {
				continue;
			}
			if (manifest.name !== packageName) continue;
			candidates.push({
				repository: source.id,
				manifest: relativePosix(root, candidateManifest),
				packageName: manifest.name ?? null,
				packageVersion: manifest.version ?? null,
				declaredLicense: manifest.license ?? null,
				legalFilesNearManifest: legalFiles(candidateDirectory),
				legalFilesAtRepositoryRoot: legalFiles(source.path),
			});
			break;
		}
	}
	return candidates;
}

const packagePath = resolve(root, argument('--package') ?? 'dist/RHS-IA.app');
const inventoryPath = resolve(root, argument('--inventory') ?? 'reports/napo-license-inventory-package.json');
const outputPath = resolve(root, argument('--out') ?? 'reports/napo-license-review-packet.json');
const releasePath = resolve(root, argument('--release') ?? 'reports/napo-release-manifest.json');
const decisionsPath = resolve(root, argument('--decisions') ?? 'reports/napo-license-decisions.json');
const requireApproved = process.argv.includes('--require-approved');

if (!existsSync(inventoryPath)) throw new Error(`No existe el inventario legal: ${inventoryPath}`);
const inventory = readJson(inventoryPath);
const release = existsSync(releasePath) ? readJson(releasePath) : null;
const packageRoot = join(packagePath, 'Contents', 'Resources', 'app');

const rawCases = inventory.unresolved.map((item) => {
	const manifest = inventory.manifests.find((candidate) => candidate.path === item.path);
	const manifestPath = join(packageRoot, item.path);
	return {
		caseId: caseIdFor(inventory.root, item.path),
		packagePath: item.path,
		name: manifest?.name ?? item.name ?? null,
		version: manifest?.version ?? null,
		publisher: manifest?.publisher ?? null,
		declaredLicense: manifest?.license ?? null,
		licenseEvidence: manifest?.licenseEvidence ?? null,
		repository: manifest?.repository ?? null,
		packageManifestSha256: existsSync(manifestPath) ? sha256(manifestPath) : null,
		packageLegalFiles: manifest?.legalFiles ?? [],
		provenanceCandidates: sourceCandidates(item.path, manifest?.name ?? item.name),
		decision: null,
		reviewer: null,
		reviewedAt: null,
		basis: null,
		notes: null,
		reviewChecklist: [
			'confirmar la licencia aplicable al componente exacto empaquetado',
			'confirmar avisos, dependencias transitivas, binarios, modelos y datos redistribuidos',
			'confirmar compatibilidad de marcas y términos de servicio con la distribución de Napo',
			'registrar decisión, persona revisora, fecha y fundamento documental en el registro lateral',
		],
	};
});

const decisionRegistry = loadDecisionRegistry(decisionsPath, release?.treeSha256);
const cases = applyDecisionRegistry(rawCases, decisionRegistry);
const decisionSummary = summarizeDecisions(cases);

const evidenceSummary = cases.reduce((summary, item) => {
	const key = item.licenseEvidence ?? 'unknown';
	summary[key] = (summary[key] ?? 0) + 1;
	return summary;
}, {});

const report = {
	format: 'napo-license-review-packet/v1',
	product: 'RHS-IA',
	scope: inventory.scope,
	package: relativePosix(root, packagePath),
	release: release ? {
		version: release.product?.version ?? null,
		treeSha256: release.treeSha256 ?? null,
		fileCount: release.fileCount ?? null,
	} : null,
	sourceRepositoriesReadOnly: ['RHS-IA', 'positron', 'rhs-agent3', 'rhs-agent4', 'vscode'],
	decision: decisionSummary.pendingCases === 0 && decisionSummary.rejectedCases === 0
		? 'human-review-approved'
		: 'human-review-required',
	summary: {
		...decisionSummary,
		withProvenanceCandidates: cases.filter((item) => item.provenanceCandidates.length > 0).length,
		licenseEvidence: evidenceSummary,
	},
	decisionRegistry: {
		path: relativePosix(root, decisionsPath),
		status: decisionRegistry.status,
		releaseTreeSha256: decisionRegistry.release?.treeSha256 ?? null,
	},
	limitations: [
		'Los candidatos de procedencia son evidencia para revisión y no transfieren ni infieren una licencia.',
	'El paquete no se modifica: ningún manifiesto de extensión recibe una licencia inventada.',
	'La revisión debe considerar binarios, dependencias transitivas, modelos, datos, marcas y términos de servicio además de estos archivos.',
	],
	cases,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Paquete de revisión legal escrito: ${relativePosix(root, outputPath)}`);
console.log(`Casos aprobados: ${decisionSummary.approvedCases}`);
console.log(`Casos rechazados: ${decisionSummary.rejectedCases}`);
console.log(`Casos pendientes: ${decisionSummary.pendingCases}`);
console.log(`Casos con candidatos de procedencia: ${cases.filter((item) => item.provenanceCandidates.length > 0).length}`);
console.log(`Registro lateral: ${relativePosix(root, decisionsPath)} (${decisionRegistry.status})`);
console.log('OK: ninguna licencia fue inferida ni ningún repositorio fuente fue modificado');

if (requireApproved && (decisionSummary.pendingCases > 0 || decisionSummary.rejectedCases > 0)) {
	console.error(`FALLA: la revisión legal no está completamente aprobada (pendientes=${decisionSummary.pendingCases}, rechazados=${decisionSummary.rejectedCases}).`);
	process.exit(1);
}

import { existsSync, readFileSync } from 'node:fs';

export const DECISION_STATUSES = new Set(['approved', 'rejected', 'needs-more-evidence']);

export function caseIdFor(inventoryRoot, packagePath) {
	return `${inventoryRoot}:${packagePath}`;
}

export function loadDecisionRegistry(path, expectedTreeSha256) {
	if (!existsSync(path)) {
		return { status: 'missing', path, decisions: {} };
	}

	let registry;
	try {
		registry = JSON.parse(readFileSync(path, 'utf8'));
	} catch (error) {
		throw new Error(`No se pudo leer el registro legal ${path}: ${error.message}`);
	}
	if (registry?.schemaVersion !== 1 || registry?.format !== 'napo-license-decisions/v1') {
		throw new Error(`Registro legal inválido: se esperaba schemaVersion=1 y format=napo-license-decisions/v1 en ${path}`);
	}
	if (!registry.decisions || typeof registry.decisions !== 'object' || Array.isArray(registry.decisions)) {
		throw new Error(`Registro legal inválido: decisions debe ser un objeto en ${path}`);
	}

	const entries = Object.entries(registry.decisions);
	const releaseMatches = !expectedTreeSha256 || registry.release?.treeSha256 === expectedTreeSha256;
	if (!releaseMatches && entries.length > 0) {
		throw new Error(`Registro legal desactualizado: su digest no coincide con el release actual (${path})`);
	}
	return {
		status: releaseMatches ? 'loaded' : 'stale-empty',
		path,
		decisions: releaseMatches ? registry.decisions : {},
		release: registry.release ?? null,
	};
}

export function applyDecisionRegistry(cases, registry) {
	const caseIds = new Set(cases.map((item) => item.caseId));
	for (const caseId of Object.keys(registry.decisions)) {
		if (!caseIds.has(caseId)) {
			throw new Error(`Registro legal contiene un caseId que no pertenece al inventario actual: ${caseId}`);
		}
	}

	return cases.map((item) => {
		const decision = registry.decisions[item.caseId];
		if (!decision) return item;
		if (!DECISION_STATUSES.has(decision.decision)) {
			throw new Error(`Decisión legal inválida para ${item.caseId}: ${decision.decision}`);
		}
		if (typeof decision.reviewer !== 'string' || !decision.reviewer.trim()) {
			throw new Error(`Decisión legal sin reviewer para ${item.caseId}`);
		}
		if (typeof decision.reviewedAt !== 'string' || Number.isNaN(Date.parse(decision.reviewedAt))) {
			throw new Error(`Decisión legal sin reviewedAt válido para ${item.caseId}`);
		}
		if (typeof decision.basis !== 'string' || !decision.basis.trim()) {
			throw new Error(`Decisión legal sin fundamento documental (basis) para ${item.caseId}`);
		}
		return {
			...item,
			decision: decision.decision,
			reviewer: decision.reviewer,
			reviewedAt: decision.reviewedAt,
			basis: decision.basis,
			notes: decision.notes ?? null,
		};
	});
}

export function summarizeDecisions(cases) {
	return {
		approvedCases: cases.filter((item) => item.decision === 'approved').length,
		rejectedCases: cases.filter((item) => item.decision === 'rejected').length,
		pendingCases: cases.filter((item) => !['approved', 'rejected'].includes(item.decision)).length,
	};
}

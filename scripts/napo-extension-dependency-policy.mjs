import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

// Runtime dependency roots intentionally shipped by Napo. These are not source
// repositories or build caches: they back built-in Git, Positron data services,
// the shared extension package, and Capibara's rhs-okf runtime.
export const allowedExtensionDependencyRoots = Object.freeze([
	'extensions/node_modules',
	'extensions/git/node_modules',
	'extensions/positron-catalog-explorer/node_modules',
	'extensions/positron-data-driver-databricks/node_modules',
	'extensions/positron-data-driver-duckdb/node_modules',
	'extensions/positron-data-driver-odbc/node_modules',
	'extensions/positron-data-driver-pins/node_modules',
	'extensions/positron-data-driver-postgresql/node_modules',
	'extensions/positron-data-driver-redshift/node_modules',
	'extensions/positron-data-driver-snowflake/node_modules',
	'extensions/positron-data-driver-sqlite/node_modules',
	'extensions/positron-duckdb/node_modules',
	'extensions/positron-pdf-server/node_modules',
	'extensions/positron-proxy/node_modules',
	'extensions/rhs-agent4/resources/rhs-okf/node_modules',
]);

export function collectExtensionDependencyRoots(packageAppRoot) {
	const roots = [];
	const extensionsRoot = join(packageAppRoot, 'extensions');

	function visit(current) {
		if (!existsSync(current)) return;
		for (const entry of readdirSync(current, { withFileTypes: true })) {
			const absolute = join(current, entry.name);
			if (!entry.isDirectory()) continue;
			const relativePath = relative(packageAppRoot, absolute).split(/[/\\]/).join('/');
			if (entry.name === 'node_modules') {
				roots.push(relativePath);
				continue;
			}
			visit(absolute);
		}
	}

	visit(extensionsRoot);
	return roots.sort();
}

export function unexpectedExtensionDependencyRoots(roots) {
	const allowed = new Set(allowedExtensionDependencyRoots);
	return roots.filter(root => !allowed.has(root));
}

import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packagePath = readArgument('--package');
const packageRoot = packagePath ? resolve(packagePath) : undefined;
const packageAppRoot = packageRoot ? join(packageRoot, 'Contents', 'Resources', 'app') : undefined;
const quartoPath = process.env.QUARTO_BIN
	?? (packageAppRoot ? join(packageAppRoot, 'quarto', 'bin', 'quarto') : join(root, '.build', 'quarto', 'bin', 'quarto'));
const rPath = process.env.R_BIN ?? 'R';
const pythonPath = process.env.PYTHON_BIN ?? 'python3';
const smokeRoot = mkdtempSync(join(tmpdir(), 'napo-runtime-smoke.'));

function readArgument(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
	console.error(`FAIL ${message}`);
	process.exitCode = 1;
}

function run(label, command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: options.cwd ?? root,
		encoding: 'utf8',
		stdio: options.stdio ?? 'pipe',
		env: { ...process.env, ...options.env },
	});
	if (result.error || result.status !== 0) {
		const detail = result.error?.message ?? `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
		fail(`${label}: ${detail || `salida ${result.status}`}`);
		return false;
	}
	console.log(`OK ${label}`);
	return true;
}

if (!existsSync(quartoPath)) {
	fail(`Quarto no encontrado en ${quartoPath}`);
} else {
	run('Quarto CLI operativo', quartoPath, ['--version']);
}

run('R operativo', rPath, ['--version']);
const pythonReady = run('Python operativo con ipykernel', pythonPath, ['-c', 'import ipykernel; print(ipykernel.__version__)']);

const rDocument = join(smokeRoot, 'r-smoke.qmd');
writeFileSync(rDocument, [
	'---',
	'title: "Napo runtime smoke test (R)"',
	'format: html',
	'---',
	'',
	'```{r}',
	'stopifnot(identical(mean(c(2, 4, 6)), 4))',
	'cat("R runtime OK\\n")',
	'```',
	'',
].join('\n'));

const pythonDocument = join(smokeRoot, 'python-smoke.qmd');
writeFileSync(pythonDocument, [
	'---',
	'title: "Napo runtime smoke test (Python)"',
	'format: html',
	'jupyter: python3',
	'---',
	'',
	'```{python}',
	'assert sum([2, 4, 6]) == 12',
	'print("Python runtime OK")',
	'```',
	'',
].join('\n'));

if (existsSync(quartoPath)) {
	run('Quarto render R', quartoPath, ['render', rDocument, '--execute'], { cwd: smokeRoot, stdio: 'inherit' });
	if (pythonReady) {
		run('Quarto render Python/Jupyter', quartoPath, ['render', pythonDocument, '--execute'], { cwd: smokeRoot, stdio: 'inherit' });
	} else {
		fail('Quarto render Python/Jupyter: falta ipykernel en el intérprete seleccionado');
	}
}

console.log(`Evidencia temporal: ${smokeRoot}`);
if (process.exitCode) {
	console.error('\nSmoke test de runtime de Napo falló.');
} else {
	console.log('\nSmoke test de runtime de Napo completado.');
}

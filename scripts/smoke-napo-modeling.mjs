#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');

function argumentValue(name, fallback) {
	const index = process.argv.indexOf(name);
	if (index < 0) return fallback;
	const value = process.argv[index + 1];
	if (!value || value.startsWith('--')) throw new Error(`Falta el valor de ${name}.`);
	return value;
}

const packagePath = resolve(argumentValue('--package', join(root, 'dist', 'Napo.app')));
const outputPath = resolve(argumentValue('--out', join(root, 'reports', 'napo-modeling-smoke.json')));
const quarto = join(packagePath, 'Contents', 'Resources', 'app', 'quarto', 'bin', 'quarto');
const work = mkdtempSync(join(tmpdir(), 'napo-modeling-smoke-'));
const report = { format: 'napo-modeling-smoke/v1', package: packagePath, status: 'fail', checks: [] };

function record(name, ok, detail) {
	report.checks.push({ name, ok, detail });
}

function run(command, args, cwd = work) {
	const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
	return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error?.message };
}

function tail(text) {
	return text.trim().split('\n').slice(-12).join('\n');
}

function sha256(file) {
	return createHash('sha256').update(readFileSync(file)).digest('hex');
}

try {
	if (!existsSync(packagePath)) record('paquete Napo', false, `No existe ${packagePath}`);
	else record('paquete Napo', true, packagePath);
	record('Quarto incluido', existsSync(quarto), quarto);

	const rScript = join(work, 'modeling-smoke.R');
	writeFileSync(rScript, [
		'x <- 1:8',
		'y <- 2 + 3 * x',
		'fit <- lm(y ~ x)',
		'stopifnot(abs(unname(coef(fit)[[1]]) - 2) < 1e-10)',
		'stopifnot(abs(unname(coef(fit)[[2]]) - 3) < 1e-10)',
		'set.seed(42)',
		'trajectory <- cumsum(rnorm(100))',
		'stopifnot(length(trajectory) == 100, all(is.finite(trajectory)))',
		'scenarios <- data.frame(scenario = c("baseline", "investment"), capacity = c(100, 125), demand = c(100, 110))',
		'scenarios$margin <- scenarios$capacity - scenarios$demand',
		'stopifnot(scenarios$margin[[2]] > scenarios$margin[[1]])',
		'cat("NAPO_R_MODEL_SIMULATION_SCENARIO_OK\\n")',
	].join('\n'), 'utf8');
	const r = run('Rscript', [rScript]);
	record('R: modelo, simulación y escenarios', r.status === 0 && r.stdout.includes('NAPO_R_MODEL_SIMULATION_SCENARIO_OK'), { status: r.status, stdout: tail(r.stdout), stderr: tail(r.stderr) });

	const pythonScript = join(work, 'modeling-smoke.py');
	writeFileSync(pythonScript, [
		'import random',
		'x = list(range(1, 9))',
		'y = [2 + 3 * value for value in x]',
		'x_bar = sum(x) / len(x)',
		'y_bar = sum(y) / len(y)',
		'slope = sum((a - x_bar) * (b - y_bar) for a, b in zip(x, y)) / sum((a - x_bar) ** 2 for a in x)',
		'intercept = y_bar - slope * x_bar',
		'assert abs(intercept - 2) < 1e-10',
		'assert abs(slope - 3) < 1e-10',
		'rng = random.Random(42)',
		'trajectory = []',
		'value = 0.0',
		'for _ in range(100):',
		'    value += rng.gauss(0, 1)',
		'    trajectory.append(value)',
		'assert len(trajectory) == 100 and all(value == value for value in trajectory)',
		'scenarios = {"baseline": {"capacity": 100, "demand": 100}, "investment": {"capacity": 125, "demand": 110}}',
		'margin = {name: values["capacity"] - values["demand"] for name, values in scenarios.items()}',
		'assert margin["investment"] > margin["baseline"]',
		'print("NAPO_PYTHON_MODEL_SIMULATION_SCENARIO_OK")',
	].join('\n'), 'utf8');
	const python = run('python3', [pythonScript]);
	record('Python: modelo, simulación y escenarios', python.status === 0 && python.stdout.includes('NAPO_PYTHON_MODEL_SIMULATION_SCENARIO_OK'), { status: python.status, stdout: tail(python.stdout), stderr: tail(python.stderr) });

	const qmd = join(work, 'modeling-smoke.qmd');
	const outputDirectory = join(work, 'rendered');
	mkdirSync(outputDirectory, { recursive: true });
	writeFileSync(qmd, [
		'---',
		'title: "Napo modeling smoke test"',
		'format: html',
		'---',
		'',
		'Este informe verifica un modelo, una simulación y una comparación de escenarios.',
		'',
		'```{r}',
		'x <- 1:8',
		'y <- 2 + 3 * x',
		'fit <- lm(y ~ x)',
		'set.seed(42)',
		'trajectory <- cumsum(rnorm(100))',
		'scenarios <- data.frame(scenario = c("baseline", "investment"), margin = c(0, 15))',
		'stopifnot(abs(unname(coef(fit)[[2]]) - 3) < 1e-10)',
		'stopifnot(length(trajectory) == 100, scenarios$margin[[2]] > scenarios$margin[[1]])',
		'cat("NAPO_QUARTO_MODELING_OK")',
		'```',
		'',
	].join('\n'), 'utf8');
	const quartoResult = run(quarto, ['render', qmd, '--output-dir', outputDirectory]);
	const rendered = join(outputDirectory, 'modeling-smoke.html');
	record('Quarto: informe reproducible de modelación', quartoResult.status === 0 && existsSync(rendered) && readFileSync(rendered, 'utf8').includes('NAPO_QUARTO_MODELING_OK'), {
		status: quartoResult.status,
		outputExists: existsSync(rendered),
		outputSha256: existsSync(rendered) ? sha256(rendered) : null,
		stdout: tail(quartoResult.stdout),
		stderr: tail(quartoResult.stderr),
	});
	report.status = report.checks.every(check => check.ok) ? 'pass' : 'fail';
} finally {
	mkdirSync(resolve(outputPath, '..'), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
	rmSync(work, { recursive: true, force: true });
}

for (const check of report.checks) console.log(`${check.ok ? 'OK' : 'FAIL'} ${check.name}`);
console.log(`Reporte: ${outputPath}`);
if (report.status !== 'pass') process.exitCode = 1;

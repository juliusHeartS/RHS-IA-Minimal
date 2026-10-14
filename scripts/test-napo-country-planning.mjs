#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const reportPath = join(root, 'reports', 'napo-country-planning.json');
const project = mkdtempSync(join(tmpdir(), 'napo-country-planning-'));
const dataDir = join(project, 'data');
const policyDir = join(project, 'policy');
const analysisDir = join(project, 'analysis');
const reportDir = join(project, 'report');
const outputDir = join(reportDir, 'rendered');
for (const directory of [dataDir, policyDir, analysisDir, reportDir, outputDir]) mkdirSync(directory, { recursive: true });

const csv = [
	'region,population,baseline_coverage,target_coverage,capacity,investment_musd',
	'Costa Norte,1200000,0.61,0.82,740,32',
	'Sierra Central,850000,0.54,0.78,510,28',
	'Amazonia Sur,420000,0.39,0.70,260,24',
	'Valle Metropolitano,2100000,0.74,0.90,1260,18',
	'Frontera Oriental,610000,0.47,0.73,380,21',
	'Islas del Sol,180000,0.58,0.80,140,9',
].join('\n') + '\n';
writeFileSync(join(dataDir, 'regions.csv'), csv);

writeFileSync(join(policyDir, 'national-health-policy.yml'), [
	'country: República de Andesia (ficticia)',
	'policy_id: AND-SALUD-2026-01',
	'policy_version: 2026.01',
	'planning_horizon: 2030',
	'objective: elevar cobertura efectiva sin dejar regiones rezagadas',
	'guardrails:',
	'  minimum_regional_coverage: 0.70',
	'  maximum_annual_investment_musd: 150',
	'  no_region_below_baseline: true',
	'scenarios: baseline, accelerated-investment',
].join('\n') + '\n');

writeFileSync(join(analysisDir, 'plan.R'), [
	'data <- read.csv("../data/regions.csv", check.names = FALSE)',
	'data$gap <- data$target_coverage - data$baseline_coverage',
	'data$scenario_coverage <- pmin(0.95, data$baseline_coverage + 0.65 * data$gap)',
	'weighted_baseline <- weighted.mean(data$baseline_coverage, data$population)',
	'weighted_scenario <- weighted.mean(data$scenario_coverage, data$population)',
	'stopifnot(weighted_scenario > weighted_baseline)',
	'stopifnot(all(data$scenario_coverage >= data$baseline_coverage))',
	'stopifnot(sum(data$investment_musd) <= 150)',
	'png("../report/coverage-scenarios.png", width = 1200, height = 720, res = 120)',
	'barplot(rbind(data$baseline_coverage, data$scenario_coverage), beside = TRUE, names.arg = data$region, las = 2, ylim = c(0, 1), col = c("#7b8794", "#0b7285"), ylab = "Cobertura efectiva", main = "República de Andesia: escenarios de cobertura")',
	'legend("topleft", legend = c("Base", "Inversión acelerada"), fill = c("#7b8794", "#0b7285"), bty = "n")',
	'dev.off()',
	'write.csv(data, "../report/region-results.csv", row.names = FALSE)',
	'cat(sprintf("NAPO_COUNTRY_R_OK baseline=%.4f scenario=%.4f\\n", weighted_baseline, weighted_scenario))',
].join('\n') + '\n');

writeFileSync(join(analysisDir, 'plan.py'), [
	'import csv, json',
	'from pathlib import Path',
	'rows = list(csv.DictReader(Path("../data/regions.csv").open()))',
	'population = sum(int(row["population"]) for row in rows)',
	'baseline = sum(float(row["baseline_coverage"]) * int(row["population"]) for row in rows) / population',
	'scenario = sum(min(0.95, float(row["baseline_coverage"]) + 0.65 * (float(row["target_coverage"]) - float(row["baseline_coverage"]))) * int(row["population"]) for row in rows) / population',
	'assert scenario > baseline',
	'assert sum(float(row["investment_musd"]) for row in rows) <= 150',
	'result = {"country": "República de Andesia", "regions": len(rows), "population": population, "weighted_baseline": baseline, "weighted_scenario": scenario, "investment_musd": sum(float(row["investment_musd"]) for row in rows)}',
	'Path("../report/python-results.json").write_text(json.dumps(result, indent=2) + "\\n")',
	'print(f"NAPO_COUNTRY_PYTHON_OK baseline={baseline:.4f} scenario={scenario:.4f}")',
].join('\n') + '\n');

writeFileSync(join(reportDir, 'andesia-plan.qmd'), [
	'---',
	'title: "Plan nacional sintético — República de Andesia"',
	'subtitle: "Prueba de aceptación de Napo: R, Python, gráficos y Quarto"',
	'format: html',
	'lang: es',
	'---',
	'',
	'> **Fixture de prueba.** Andesia, sus regiones y sus políticas son datos inventados; no representan una fuente institucional ni una recomendación legal.',
	'',
	'## Política evaluada',
	'',
	'- Objetivo: elevar cobertura efectiva sin dejar regiones rezagadas.',
	'- Horizonte: 2030.',
	'- Salvaguardas: ninguna región puede quedar por debajo de su línea base y la inversión anual máxima es de 150 millones.',
	'',
	'## Resultados',
	'',
	'```{r}',
	'data <- read.csv("../data/regions.csv", check.names = FALSE)',
	'data$gap <- data$target_coverage - data$baseline_coverage',
	'data$scenario_coverage <- pmin(0.95, data$baseline_coverage + 0.65 * data$gap)',
	'weighted.mean(data$baseline_coverage, data$population)',
	'weighted.mean(data$scenario_coverage, data$population)',
	'```',
	'',
	'La simulación mantiene la cobertura de cada región por encima de su línea base y respeta el techo de inversión.',
	'',
	'```{r}',
	'knitr::include_graphics("coverage-scenarios.png")',
	'```',
	'',
	'El gráfico fue producido por R y el mismo escenario fue recalculado de forma independiente en Python.',
].join('\n') + '\n');

function run(command, args, cwd) {
	return spawnSync(command, args, { cwd, encoding: 'utf8' });
}

const checks = [];
const r = run('Rscript', ['plan.R'], analysisDir);
checks.push({ name: 'R: política, escenarios y gráfico', ok: r.status === 0 && r.stdout.includes('NAPO_COUNTRY_R_OK') && existsSync(join(reportDir, 'coverage-scenarios.png')), output: `${r.stdout}${r.stderr}`.trim() });
const python = run('python3', ['plan.py'], analysisDir);
checks.push({ name: 'Python: réplica independiente del escenario', ok: python.status === 0 && python.stdout.includes('NAPO_COUNTRY_PYTHON_OK') && existsSync(join(reportDir, 'python-results.json')), output: `${python.stdout}${python.stderr}`.trim() });
const quarto = join(root, 'dist', 'Napo.app', 'Contents', 'Resources', 'app', 'quarto', 'bin', 'quarto');
const rendered = run(quarto, ['render', 'andesia-plan.qmd', '--execute', '--output-dir', outputDir], reportDir);
checks.push({ name: 'Quarto: reporte nacional reproducible', ok: rendered.status === 0 && existsSync(join(outputDir, 'andesia-plan.html')), output: `${rendered.stdout}${rendered.stderr}`.trim().slice(-4000) });

const report = {
	format: 'napo-country-planning/v1',
	status: checks.every(check => check.ok) ? 'pass' : 'fail',
	fixture: { country: 'República de Andesia', fictional: true, policy: 'AND-SALUD-2026-01', regions: 6 },
	project,
	artifacts: {
		data: join(dataDir, 'regions.csv'),
		policy: join(policyDir, 'national-health-policy.yml'),
		graphic: join(reportDir, 'coverage-scenarios.png'),
		quarto: join(outputDir, 'andesia-plan.html'),
	},
	checks,
	limitations: ['Todos los datos, políticas y resultados son sintéticos y no tienen autoridad institucional.', 'Esta prueba valida la cadena técnica R/Python/Quarto y no sustituye revisión humana de políticas reales.'],
};
mkdirSync(resolve(reportPath, '..'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
for (const check of checks) console.log(`${check.ok ? 'OK' : 'FAIL'} ${check.name}`);
console.log(`Proyecto temporal conservado en: ${project}`);
console.log(`Reporte: ${reportPath}`);
if (report.status !== 'pass') process.exitCode = 1;

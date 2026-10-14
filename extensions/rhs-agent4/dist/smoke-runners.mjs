// services/runner/PdfstructRunner.ts
import * as fs from "fs";
import * as path from "path";

// services/runner/SubprocessRunner.ts
import { spawn } from "child_process";
var SubprocessRunner = class {
  /** Args extra del env que este runner necesita (e.g. PDFSTRUCT_PROGRESS). */
  envExtras() {
    return {};
  }
  /**
   * Ejecuta el subproceso con los args provistos.
   * Siempre retorna `SubprocessResult` (nunca rechaza) salvo que `proc.on('error')`
   * falle antes del spawn (e.g. binario no encontrado); en ese caso rechaza con
   * un mensaje accionable.
   */
  async run(args, opts = {}) {
    if (opts.signal?.aborted) throw new Error("Task cancelled");
    const finalArgs = [...args];
    if (opts.json) finalArgs.push("--json");
    const env = {
      ...process.env ?? {},
      ...this.envExtras(),
      ...opts.env ?? {}
    };
    let proc;
    try {
      proc = spawn(this.getBin(), finalArgs, {
        env,
        cwd: opts.cwd,
        stdio: ["pipe", "pipe", "pipe"]
      });
    } catch (err) {
      throw new Error(
        `No se pudo iniciar ${this.constructor.name} (bin=${this.getBin()}): ${err instanceof Error ? err.message : String(err)}`
      );
    }
    if (opts.input) {
      proc.stdin?.write(opts.input);
    }
    proc.stdin?.end();
    let stdout = "";
    let stderr = "";
    const onLog = opts.onLog;
    let pendingStdout = "";
    let pendingStderr = "";
    const emitCompleteLines = (pending, chunk) => {
      const lines = `${pending}${chunk}`.split("\n");
      const remainder = lines.pop() ?? "";
      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, "");
        if (line.trim()) onLog?.(line);
      }
      return remainder;
    };
    const flushPendingLines = () => {
      const stdoutLine = pendingStdout.replace(/\r$/, "");
      const stderrLine = pendingStderr.replace(/\r$/, "");
      if (stdoutLine.trim()) onLog?.(stdoutLine);
      if (stderrLine.trim()) onLog?.(stderrLine);
      pendingStdout = "";
      pendingStderr = "";
    };
    proc.stdout?.on("data", (d) => {
      const chunk = d.toString();
      stdout += chunk;
      if (onLog) pendingStdout = emitCompleteLines(pendingStdout, chunk);
    });
    proc.stderr?.on("data", (d) => {
      const chunk = d.toString();
      stderr += chunk;
      if (onLog) pendingStderr = emitCompleteLines(pendingStderr, chunk);
    });
    return new Promise((resolve, reject) => {
      const timer = opts.timeoutMs ? setTimeout(() => proc.kill("SIGTERM"), opts.timeoutMs) : null;
      let aborted = false;
      const abort = () => {
        aborted = true;
        proc.kill("SIGTERM");
      };
      const cleanup = () => {
        if (timer) clearTimeout(timer);
        opts.signal?.removeEventListener("abort", abort);
      };
      opts.signal?.addEventListener("abort", abort, { once: true });
      proc.on("error", (err) => {
        cleanup();
        if (aborted) {
          reject(new Error("Task cancelled"));
          return;
        }
        reject(
          new Error(
            `No se pudo ejecutar ${this.constructor.name} (bin=${this.getBin()}): ${err.message}. Configura la ruta al binario en Settings.`
          )
        );
      });
      proc.on("exit", (code) => {
        cleanup();
        flushPendingLines();
        if (aborted) {
          reject(new Error("Task cancelled"));
          return;
        }
        const exitCode = code ?? -1;
        let json;
        if (opts.json) {
          try {
            json = JSON.parse(stdout);
          } catch {
          }
        }
        resolve({ exitCode, stdout, stderr, json, ok: exitCode === 0 });
      });
    });
  }
  /** Mensaje corto para UI/logs cuando el subproceso falla. */
  summarizeError(res) {
    const errLine = res.stderr.split(/\r?\n/).find((l) => l.startsWith("Error:"));
    if (errLine) return errLine.replace(/^Error:\s*/, "");
    const lastLine = (res.stderr || res.stdout || `exit ${res.exitCode}`).split(/\r?\n/).filter(Boolean).slice(-1)[0];
    return lastLine ?? `exit ${res.exitCode}`;
  }
};

// services/runner/PdfstructRunner.ts
var PdfstructRunner = class extends SubprocessRunner {
  constructor(binaryPath, yoloModelPath) {
    super();
    this.binaryPath = binaryPath;
    this.yoloModelPath = yoloModelPath;
  }
  binaryPath;
  yoloModelPath;
  getBin() {
    return this.binaryPath;
  }
  envExtras() {
    return { PDFSTRUCT_PROGRESS: "ndjson" };
  }
  /** Inspects a PDF through `pdfstruct info` before extraction. */
  async getDocumentInfo(filePath, signal, timeoutMs) {
    const res = await this.run(["info", "-i", filePath], { signal, timeoutMs });
    if (!res.ok) return { pageCount: 0 };
    const output = `${res.stdout}
${res.stderr}`;
    const direct = res.stdout.trim();
    const pageCount = /^\d+$/.test(direct) ? parseInt(direct, 10) : parseInt(output.match(/Paginas:\s*(\d+)/i)?.[1] ?? "0", 10);
    const size = output.match(/([\d.]+)\s*x\s*([\d.]+)\s*puntos/i);
    return {
      pageCount,
      ...size ? { firstPageWidth: Number.parseFloat(size[1]), firstPageHeight: Number.parseFloat(size[2]) } : {}
    };
  }
  /** Counts pages through the same inspection used by the document flow. */
  async getPageCount(filePath, signal, timeoutMs) {
    return (await this.getDocumentInfo(filePath, signal, timeoutMs)).pageCount;
  }
  /**
   * Ejecuta un subcomando explícito para la superficie manual de PDFStruct.
   *
   * La herramienta `process_pdf` no usa este método: su contrato es el flujo
   * adaptativo que termina en un Markdown final. Este método existe para
   * conservar los comandos avanzados que el predecesor exponía al usuario.
   */
  async runCommand(mode, opts, onOutput, onProgress) {
    const args = this.buildCommandArgs(mode, opts);
    return this.runWithProgress(args, onOutput, onProgress, opts.signal, opts.timeoutMs);
  }
  /** Render a bounded page range through pdfstruct itself for source evidence review. */
  async renderEvidencePages(filePath, outputDir, start, end, dpi, signal) {
    if (start < 0 || end <= start) throw new Error("Invalid evidence page range");
    fs.mkdirSync(outputDir, { recursive: true });
    const result = await this.run([
      "meta-page-range",
      "-i",
      filePath,
      "--output-dir",
      outputDir,
      "--yolo-model",
      this.yoloModelPath,
      "--start",
      String(start),
      "--end",
      String(end),
      "--dpi",
      String(dpi),
      "--render-png"
    ], { signal });
    if (!result.ok) throw new Error(`pdfstruct no pudo renderizar evidencia: ${this.summarizeError(result)}`);
    return fs.readdirSync(outputDir, { recursive: true }).map(String).map((entry) => path.join(outputDir, entry)).filter((entry) => fs.existsSync(entry) && fs.statSync(entry).isFile() && entry.toLowerCase().endsWith(".png")).sort((left, right) => left.localeCompare(right, void 0, { numeric: true }));
  }
  /** Construye la extracción base adaptativa y su MetaDocumento. */
  async extractBaseline(opts, onOutput, onProgress) {
    return this.runDocuments(opts, (input) => this.buildBaselineArgs(input, opts), onOutput, onProgress);
  }
  /**
   * Recupera el texto nativo cuando la pasada adaptativa no entrega salida.
   * No inventa contenido ni sustituye la visión: conserva el texto que el PDF
   * ya expone para que el documento no quede sin Markdown.
   */
  async extractText(opts, onOutput, onProgress) {
    return this.runDocuments(opts, (input) => this.buildTextExtractionArgs(input, opts), onOutput, onProgress);
  }
  /** Extrae campos o estructuras concretas solicitadas explícitamente. */
  async extractGuided(opts, onOutput, onProgress) {
    if (!opts.extractionGoal.trim()) throw new Error("extractionGoal no puede estar vac\xEDo");
    return this.runDocuments(opts, (input) => this.buildGuidedArgs(input, opts), onOutput, onProgress);
  }
  /** Repara únicamente las páginas señaladas usando la evidencia de la base. */
  async repairPages(opts, onOutput, onProgress) {
    if (opts.repairPages.length === 0) throw new Error("repairPages requiere al menos una p\xE1gina");
    return this.runDocuments(opts, (input) => this.buildRepairArgs(input, opts), onOutput, onProgress);
  }
  async runDocuments(opts, buildArgs, onOutput, onProgress) {
    const inputs = this.collectInputs(opts.inputPath);
    const total = inputs.length;
    const result = { processed: [], failed: [] };
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const name = path.basename(input);
      const stem = path.basename(input, ".pdf");
      const outFile = path.join(opts.outputDir, `${stem}.md`);
      const totalPages = await this.getPageCount(input, opts.signal, opts.timeoutMs);
      onOutput?.(`[${i + 1}/${total}] ${name} (${totalPages} p\xE1gs)`);
      const args = buildArgs(input);
      try {
        await this.exec(args, onOutput, onProgress, opts.signal, opts.timeoutMs);
        if (fs.existsSync(outFile)) {
          result.processed.push(outFile);
          onOutput?.(`  \u2713 ${stem}.md`);
        } else {
          result.failed.push(input);
          onOutput?.(`  \u2717 no se gener\xF3 ${stem}.md`);
        }
      } catch (err) {
        if (opts.signal?.aborted) throw new Error("Task cancelled");
        result.failed.push(input);
        onOutput?.(`  \u2717 ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    return result;
  }
  collectInputs(inputPath) {
    const stat = fs.statSync(inputPath);
    if (stat.isDirectory()) {
      const inputs = [];
      const visit = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
          if (entry.name.startsWith(".")) continue;
          const entryPath = path.join(dir, entry.name);
          if (entry.isDirectory()) visit(entryPath);
          else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) inputs.push(entryPath);
        }
      };
      visit(inputPath);
      return inputs;
    }
    return [inputPath];
  }
  /** Traduce la operación documental base al comando interno de pdfstruct. */
  buildBaselineArgs(input, opts) {
    const args = [
      "auto",
      "-i",
      input,
      "-o",
      opts.outputDir,
      "--yolo-model",
      this.yoloModelPath,
      "--mode",
      "auto",
      "--dpi",
      String(opts.dpi),
      "--emit-combined-json"
    ];
    if (opts.visionProvider !== "auto") args.push("--vision-provider", opts.visionProvider);
    if ((opts.visionProvider === "ollama" || opts.visionProvider === "minimax") && opts.ollamaUrl) {
      args.push("--ollama-url", opts.ollamaUrl);
    }
    if (opts.visionProvider === "ollama" && opts.ocrModel) args.push("--ollama-model", opts.ocrModel);
    if (opts.confirmProDownload) args.push("--confirm-pro-download");
    if (opts.maxPages && opts.maxPages > 0) args.push("--max-pages", String(opts.maxPages));
    if (opts.concurrency && opts.concurrency > 0) args.push("--concurrency", String(opts.concurrency));
    return args;
  }
  buildTextExtractionArgs(input, opts) {
    const args = ["extract", "-i", input, "-o", opts.outputDir, "--post-process"];
    if (opts.profile) args.push("--profile", opts.profile);
    return args;
  }
  /** Traduce un objetivo documental explícito a extracción visual dirigida. */
  buildGuidedArgs(input, opts) {
    if (!opts.extractionGoal.trim()) throw new Error("extractionGoal no puede estar vac\xEDo");
    const args = [
      "guided-extract",
      "-i",
      input,
      "-o",
      opts.outputDir,
      "--vision-provider",
      opts.visionProvider,
      "--dpi",
      String(opts.dpi),
      "--mode",
      "full-page",
      "--guide-prompt",
      opts.extractionGoal.trim(),
      "--emit-json"
    ];
    if (opts.imagesDir) args.push("--images-dir", opts.imagesDir);
    if (opts.visionProvider === "ollama" && opts.ocrModel) args.push("--ollama-model", opts.ocrModel);
    if ((opts.visionProvider === "ollama" || opts.visionProvider === "minimax") && opts.ollamaUrl) {
      args.push("--ollama-url", opts.ollamaUrl);
    }
    if (opts.maxOutputTokens !== void 0) args.push("--max-output-tokens", String(opts.maxOutputTokens));
    if (opts.confirmProDownload) args.push("--confirm-pro-download");
    return args;
  }
  /** Traduce una reparación localizada al comando interno de pdfstruct. */
  buildRepairArgs(input, opts) {
    if (opts.repairPages.length === 0) throw new Error("repairPages requiere al menos una p\xE1gina");
    const args = [
      "repair-pages",
      "-i",
      input,
      "--base-json",
      opts.baseJson,
      "-o",
      opts.outputDir,
      "--pages",
      opts.repairPages.join(","),
      "--vision-provider",
      opts.visionProvider,
      "--dpi",
      String(opts.dpi),
      "--mode",
      opts.scope,
      "--yolo-model",
      this.yoloModelPath
    ];
    if (opts.imagesDir) args.push("--images-dir", opts.imagesDir);
    if (opts.visionProvider === "ollama" && opts.ocrModel) args.push("--ollama-model", opts.ocrModel);
    if ((opts.visionProvider === "ollama" || opts.visionProvider === "minimax") && opts.ollamaUrl) {
      args.push("--ollama-url", opts.ollamaUrl);
    }
    if (opts.guidePrompt.trim()) args.push("--guide-prompt", opts.guidePrompt.trim());
    if (opts.maxVisionRegionsPerPage !== void 0) {
      args.push("--max-vision-regions-per-page", String(opts.maxVisionRegionsPerPage));
    }
    if (opts.maxOutputTokens !== void 0) args.push("--max-output-tokens", String(opts.maxOutputTokens));
    if (opts.confirmProDownload) args.push("--confirm-pro-download");
    return args;
  }
  /** Port exacto de la tabla de subcomandos manuales del predecesor. */
  buildCommandArgs(mode, opts) {
    if (!opts.inputPath.trim()) throw new Error("inputPath no puede estar vac\xEDo");
    if (mode === "guided") {
      const guidedMode = opts.guidedMode || "full-page";
      const args2 = [
        "guided-extract",
        "-i",
        opts.inputPath,
        "-o",
        opts.outputDir ?? path.dirname(opts.inputPath),
        "--vision-provider",
        opts.visionProvider ?? "auto",
        "--dpi",
        String(Math.max(250, opts.dpi ?? 250)),
        "--mode",
        guidedMode
      ];
      if (opts.imagesDir) args2.push("--images-dir", opts.imagesDir);
      if (guidedMode === "regions") args2.push("--yolo-model", this.yoloModelPath);
      if (opts.visionProvider === "ollama" && opts.ocrModel) args2.push("--ollama-model", opts.ocrModel);
      if ((opts.visionProvider === "ollama" || opts.visionProvider === "minimax") && opts.ollamaUrl) {
        args2.push("--ollama-url", opts.ollamaUrl);
      }
      if (opts.guideFile) args2.push("--guide-file", opts.guideFile);
      else if (opts.guidePrompt?.trim()) args2.push("--guide-prompt", opts.guidePrompt.trim());
      if (opts.confirmProDownload) args2.push("--confirm-pro-download");
      if (opts.start !== void 0) args2.push("--start", String(opts.start));
      if (opts.end !== void 0) args2.push("--end", String(opts.end));
      return args2;
    }
    const modeToSubcommand = {
      "hybrid-lm-studio": "hybrid-ocr",
      "hybrid-production": "hybrid-ocr",
      hybrid: "hybrid-ocr",
      olmocr: "meta-doc-ocr",
      hard: "auto",
      "smart-ocr": "auto"
    };
    const usesAutoMode = ["auto", "mixed", "hard"].includes(mode);
    const subcommand = usesAutoMode ? "auto" : modeToSubcommand[mode] ?? mode;
    const args = [subcommand, "-i", opts.inputPath];
    const outputModes = /* @__PURE__ */ new Set([
      "auto",
      "hybrid-ocr",
      "hybrid-lm-studio",
      "hybrid-production",
      "hybrid",
      "meta-page",
      "meta-page-range",
      "meta-doc-ocr",
      "olmocr",
      "extract",
      "meta-doc",
      "guided-extract"
    ]);
    if (outputModes.has(mode) && opts.outputDir) args.push("-o", opts.outputDir);
    if (usesAutoMode) {
      args.push("--yolo-model", this.yoloModelPath, "--mode", mode, "--dpi", String(Math.max(250, opts.dpi ?? 250)));
    }
    if (opts.emitJson && outputModes.has(mode)) args.push("--emit-combined-json");
    if (opts.guideFile) args.push("--guide-file", opts.guideFile);
    else if (opts.guidePrompt?.trim()) args.push("--guide-prompt", opts.guidePrompt.trim());
    if (opts.imagesDir) args.push("--images-dir", opts.imagesDir);
    if (mode === "meta-page") args.push("--page", "0");
    if (mode === "meta-page-range") args.push("--start", "0", "--emit-md", "--emit-combined-json");
    if (mode === "meta") args.push("--mode", "meta");
    const yoloModes = /* @__PURE__ */ new Set(["auto", "hard", "smart-ocr", "hybrid-ocr", "hybrid-lm-studio", "hybrid-production", "hybrid"]);
    if (yoloModes.has(mode)) args.push("--yolo-model", this.yoloModelPath);
    if (["auto", "hard", "smart-ocr", "hybrid-ocr"].includes(mode)) {
      args.push("--scanned-threshold", String(opts.scannedThreshold ?? 150), "--emit-combined-json");
    }
    if (mode === "guided-extract" && !opts.guidePrompt?.trim() && !opts.guideFile) {
      throw new Error("guided-extract requiere guidePrompt o guideFile");
    }
    if (mode === "guided-extract") args.push("--emit-json");
    const dpiModes = /* @__PURE__ */ new Set([
      "auto",
      "hybrid-ocr",
      "hybrid-lm-studio",
      "hybrid-production",
      "olmocr",
      "guided-extract",
      "meta-doc-ocr",
      "hard",
      "smart-ocr"
    ]);
    if (dpiModes.has(mode)) args.push("--dpi", String(Math.max(250, opts.dpi ?? 250)));
    if ((opts.maxPages ?? 0) > 0 && ["auto", "hybrid-ocr", "hybrid-lm-studio", "hybrid-production", "guided-extract", "hard", "smart-ocr"].includes(mode)) {
      args.push("-m", String(opts.maxPages));
    }
    if ((opts.concurrency ?? 0) > 0 && ["auto", "hybrid-ocr", "hybrid-production"].includes(mode)) {
      args.push("--concurrency", String(opts.concurrency));
    }
    if ((opts.visionProvider === "ollama" || opts.visionProvider === "minimax") && opts.ollamaUrl) args.push("--ollama-url", opts.ollamaUrl);
    if (opts.visionProvider && opts.visionProvider !== "auto") args.push("--vision-provider", opts.visionProvider);
    if (opts.visionProvider === "ollama" && opts.ocrModel) args.push("--ollama-model", opts.ocrModel);
    if (opts.confirmProDownload) args.push("--confirm-pro-download");
    if (opts.start !== void 0) args.push("--start", String(opts.start));
    if (opts.end !== void 0) args.push("--end", String(opts.end));
    return args;
  }
  async exec(args, onOutput, onProgressEvent, signal, timeoutMs) {
    let runTotalPages;
    let lastCurrentPage = 0;
    const monotonicPage = (value) => {
      if (value === void 0) return void 0;
      lastCurrentPage = Math.max(lastCurrentPage, value);
      return lastCurrentPage;
    };
    const handleLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("{") && trimmed.includes('"type"')) {
        try {
          const event = JSON.parse(trimmed);
          if (event.type === "run_started") {
            runTotalPages = event.total;
            lastCurrentPage = 0;
            onProgressEvent?.({ type: "progress", currentPage: 0, totalPages: event.total });
            return;
          }
          if (event.type === "page_finished") {
            onProgressEvent?.({
              type: "progress",
              currentPage: monotonicPage(event.processed ?? event.physical_page),
              totalPages: event.total ?? runTotalPages
            });
            return;
          }
          if (event.type === "run_finished") {
            onProgressEvent?.({ type: "done", currentPage: monotonicPage(event.processed), totalPages: runTotalPages });
            return;
          }
          if (event.type === "progress" || event.type === "done") {
            onProgressEvent?.({
              type: event.type,
              currentPage: monotonicPage(event.currentPage ?? event.current),
              totalPages: event.totalPages ?? event.total
            });
            return;
          }
        } catch {
        }
      }
      onOutput?.(trimmed);
    };
    const res = await this.run(args, { signal, timeoutMs, onLog: handleLine });
    if (!res.ok) {
      throw new Error(`pdfstruct termin\xF3 con c\xF3digo ${res.exitCode}: ${this.summarizeError(res)}`);
    }
  }
  async runWithProgress(args, onOutput, onProgressEvent, signal, timeoutMs) {
    let runTotalPages;
    let lastCurrentPage = 0;
    const handleLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("{") && trimmed.includes('"type"')) {
        try {
          const event = JSON.parse(trimmed);
          if (event.type === "run_started") {
            runTotalPages = event.total;
            lastCurrentPage = 0;
            onProgressEvent?.({ type: "progress", currentPage: 0, totalPages: event.total });
            return;
          }
          if (event.type === "page_finished") {
            lastCurrentPage = Math.max(lastCurrentPage, event.processed ?? event.physical_page ?? 0);
            onProgressEvent?.({ type: "progress", currentPage: lastCurrentPage, totalPages: event.total ?? runTotalPages });
            return;
          }
          if (event.type === "run_finished" || event.type === "done") {
            lastCurrentPage = Math.max(lastCurrentPage, event.processed ?? event.currentPage ?? event.current ?? 0);
            onProgressEvent?.({ type: event.type === "done" ? "done" : "progress", currentPage: lastCurrentPage, totalPages: event.totalPages ?? event.total ?? runTotalPages });
            return;
          }
        } catch {
        }
      }
      onOutput?.(trimmed);
    };
    return this.run(args, { signal, timeoutMs, onLog: handleLine });
  }
};

// services/runner/RagRunner.ts
import * as fs2 from "fs";
var JSON_SUBCMDS = /* @__PURE__ */ new Set(["query", "ingest", "count", "doctor", "list", "serve", "reset"]);
var RagRunner = class extends SubprocessRunner {
  constructor(binaryPath, pdfstructPath, paths, extraEnv = {}) {
    super();
    this.binaryPath = binaryPath;
    this.pdfstructPath = pdfstructPath;
    this.paths = paths;
    this.extraEnv = extraEnv;
  }
  binaryPath;
  pdfstructPath;
  paths;
  extraEnv;
  getBin() {
    return this.binaryPath;
  }
  envExtras() {
    return { ...this.extraEnv, RHS_RAG_PDFSTRUCT_BIN: this.pdfstructPath };
  }
  /**
   * Ejecuta un subcomando del CLI. Si db es "canonical" o "project" usa la DB
   * correspondiente. Si db es undefined, no agrega `--lancedb-dir` (raro; por
   * compatibilidad con flags como `serve` que escuchan en un puerto).
   */
  async runSubcmd(subcmd, args = [], opts = {}) {
    const useJson = opts.json ?? true;
    const finalArgs = [subcmd, ...args];
    if (opts.db) {
      const dbDir = opts.db === "canonical" ? this.paths.canonicalDbDir : this.paths.projectDbDir;
      finalArgs.push("--lancedb-dir", dbDir);
    }
    const wantJson = useJson && JSON_SUBCMDS.has(subcmd);
    return this.run(finalArgs, { json: wantJson, cwd: opts.cwd, onLog: opts.onLog });
  }
  // --- DB de proyecto ---
  async ingest(inputPath, docType, ocr, opts = {}) {
    const args = ["-i", inputPath, "--doc-type", docType];
    if (ocr) args.push("--ocr");
    if (opts.pruneMissing) args.push("--prune-missing");
    return this.runSubcmd("ingest", args, { db: "project" });
  }
  async query(question, topK) {
    const args = ["-q", question];
    if (topK) args.push("-t", String(topK));
    return this.runSubcmd("query", args, { db: "project" });
  }
  async queryChunks(question, db = "project", docIds) {
    const args = ["-q", question, "--chunks-only"];
    if (docIds && docIds.length > 0) {
      for (const id of docIds) args.push("--doc-id", id);
    }
    return this.runSubcmd("query", args, { db });
  }
  async count() {
    return this.runSubcmd("count", [], { db: "project" });
  }
  async doctor() {
    return this.runSubcmd("doctor", [], { db: "project" });
  }
  /** Diagnóstico de la capa canónica; no debe confundirse con la DB del proyecto. */
  async canonicalDoctor() {
    return this.runSubcmd("doctor", [], { db: "canonical" });
  }
  async reset() {
    return this.runSubcmd("reset", [], { db: "project" });
  }
  async list(inputDir) {
    return this.runSubcmd("list", ["-i", inputDir], { db: "project" });
  }
  async ingestDir(inputDir, docType) {
    return this.runSubcmd("ingest", ["-i", inputDir, "--doc-type", docType], { db: "project" });
  }
  // --- Query dual (canónica + proyecto) ---
  async queryDualChunks(question, scopes = {}) {
    const projectDbExists = fs2.existsSync(this.paths.projectDbDir);
    const failed = (error) => ({
      exitCode: -1,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
      ok: false
    });
    const chunksFrom = (result) => result.ok && result.json && Array.isArray(result.json.chunks) ? result.json.chunks : [];
    const queryLayer = async (db, docIds) => {
      let result = await this.queryChunks(question, db, docIds).catch(failed);
      let chunks2 = chunksFrom(result);
      let recovered = false;
      if (scopes.recoverUnscoped && result.ok && chunks2.length === 0 && docIds && docIds.length > 0) {
        result = await this.queryChunks(question, db, []).catch(failed);
        chunks2 = chunksFrom(result);
        recovered = true;
      }
      return { result, chunks: chunks2, recovered };
    };
    const [canonicalQuery, projectQuery] = await Promise.all([
      queryLayer("canonical", scopes.canonicalDocIds),
      projectDbExists ? queryLayer("project", scopes.projectDocIds) : Promise.resolve({
        result: failed(new Error("project RAG database does not exist")),
        chunks: [],
        recovered: false
      })
    ]);
    const canonicalRes = canonicalQuery.result;
    const projectRes = projectQuery.result;
    const chunks = [];
    const canonicalStatus = {
      db: "canonical",
      ok: canonicalRes.ok,
      chunks: 0,
      recoveredUnscoped: canonicalQuery.recovered,
      exitCode: canonicalRes.exitCode,
      ...canonicalRes.ok ? {} : { message: summarizeRagError(canonicalRes) }
    };
    const projectStatus = {
      db: "project",
      ok: projectRes.ok,
      chunks: 0,
      recoveredUnscoped: projectQuery.recovered,
      exitCode: projectRes.exitCode,
      ...projectRes.ok ? {} : { message: summarizeRagError(projectRes) }
    };
    if (canonicalRes.ok) {
      const cs = canonicalQuery.chunks;
      canonicalStatus.chunks = cs.length;
      for (const c of cs) chunks.push({ ...c, db: "canonical" });
    }
    if (projectRes.ok) {
      const cs = projectQuery.chunks;
      projectStatus.chunks = cs.length;
      for (const c of cs) chunks.push({ ...c, db: "project" });
    }
    chunks.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const status = { canonical: canonicalStatus, project: projectStatus };
    return { chunks, retrievalMode: classifyDualRetrievalMode(status), status };
  }
};
function classifyDualRetrievalMode(status) {
  const canonicalHasResults = status.canonical.ok && status.canonical.chunks > 0;
  const projectHasResults = status.project.ok && status.project.chunks > 0;
  if (canonicalHasResults && projectHasResults) return "dual";
  if (canonicalHasResults) return "global_only";
  if (projectHasResults) return "local_only";
  if (!status.canonical.ok && !status.project.ok) return "unavailable";
  return "no_results";
}
function summarizeRagError(res) {
  const errLine = res.stderr.split(/\r?\n/).find((l) => l.startsWith("Error:"));
  if (errLine) return errLine.replace(/^Error:\s*/, "");
  const lastLine = (res.stderr || res.stdout || `exit ${res.exitCode}`).split(/\r?\n/).filter(Boolean).slice(-1)[0];
  return lastLine ?? `exit ${res.exitCode}`;
}

// services/runner/OkfRunner.ts
var OkfRunner = class _OkfRunner extends SubprocessRunner {
  constructor(cliCommand, cliPath, pdfstructBin, yoloModelPath) {
    super();
    this.cliCommand = cliCommand;
    this.cliPath = cliPath;
    this.pdfstructBin = pdfstructBin;
    this.yoloModelPath = yoloModelPath;
  }
  cliCommand;
  cliPath;
  pdfstructBin;
  yoloModelPath;
  static LOCAL_BUNDLE = ".okf-local";
  getBin() {
    return this.cliPath ? this.cliCommand : this.cliCommand || "rhs-okf";
  }
  envExtras() {
    const env = {};
    if (this.pdfstructBin) env.RHS_OKF_PDFSTRUCT_BIN = this.pdfstructBin;
    if (this.yoloModelPath) env.RHS_OKF_YOLO_MODEL = this.yoloModelPath;
    return env;
  }
  async spawn(args) {
    const finalArgs = this.cliPath ? [this.cliPath, ...args] : args;
    return this.run(finalArgs, { json: false });
  }
  /** Llama al CLI con `--json` si lo soporta; cae sin `--json` si lo rechaza. */
  async runJson(args) {
    const first = await this.spawn([...args, "--json"]);
    if (!first.ok && isUnknownJsonOption(first)) return this.spawn(args);
    return first;
  }
  async ingest(workspace, options = {}) {
    const args = ["ingest", workspace, "--bundle-dir", _OkfRunner.LOCAL_BUNDLE];
    if (options.preparedManifestPath) args.push("--prepared-manifest", options.preparedManifestPath);
    return this.runJson(args);
  }
  async reset(workspace) {
    return this.runJson(["reset", workspace, "--bundle-dir", _OkfRunner.LOCAL_BUNDLE, "--yes"]);
  }
  async verify(workspace) {
    return this.runJson(["verify", workspace, "--bundle-dir", _OkfRunner.LOCAL_BUNDLE]);
  }
};
function isUnknownJsonOption(result) {
  const combined = `${result.stdout}
${result.stderr}`.toLowerCase();
  return combined.includes("unknown option") && combined.includes("--json");
}

// services/runner/ObscuraRunner.ts
import * as fs3 from "fs";
import * as path2 from "path";
var ObscuraRunner = class extends SubprocessRunner {
  constructor(binaryPath) {
    super();
    this.binaryPath = binaryPath;
  }
  binaryPath;
  getBin() {
    return this.binaryPath;
  }
  /** Doctor: verifica que el binario existe y responde a `--version`. */
  async doctor(timeoutMs = 15e3) {
    const bundled = path2.isAbsolute(this.binaryPath) ? fs3.existsSync(this.binaryPath) : false;
    const result = {
      binaryPath: this.binaryPath,
      bundled,
      available: false,
      version: null
    };
    try {
      const res = await this.run(["--version"], { json: false, timeoutMs });
      if (res.ok) {
        result.version = res.stdout.trim() || null;
        result.available = result.version !== null;
      } else {
        result.error = res.stderr.trim() || `exit ${res.exitCode}`;
      }
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
    }
    return result;
  }
};
export {
  ObscuraRunner,
  OkfRunner,
  PdfstructRunner,
  RagRunner,
  SubprocessRunner
};
//# sourceMappingURL=smoke-runners.mjs.map

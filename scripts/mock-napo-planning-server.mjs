#!/usr/bin/env node

// Local-only deterministic provider for Napo's versioned-source planning UI
// evidence. It never listens outside loopback and is not shipped in Napo.

import http from 'node:http';

const port = Number(process.argv[2] ?? 18126);
const host = '127.0.0.1';
let requestCount = 0;

function json(res, status, body) {
	res.writeHead(status, { 'content-type': 'application/json' });
	res.end(JSON.stringify(body));
}

function stream(res, payload) {
	res.writeHead(200, {
		'cache-control': 'no-cache',
		'connection': 'keep-alive',
		'content-type': 'text/event-stream',
	});
	res.write(`data: ${JSON.stringify(payload)}\n\n`);
	res.write('data: [DONE]\n\n');
	res.end();
}

function chunk(id, delta, finishReason = null) {
	return {
		id,
		object: 'chat.completion.chunk',
		created: Math.floor(Date.now() / 1000),
		model: 'napo-planning-fixture',
		choices: [{ index: 0, delta, finish_reason: finishReason }],
	};
}

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/v1/models') {
		return json(res, 200, { object: 'list', data: [{ id: 'napo-planning-fixture', object: 'model', owned_by: 'napo-test' }] });
	}
	if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
		return json(res, 404, { error: { message: 'mock planning server: route not found' } });
	}

	let body = '';
	req.setEncoding('utf8');
	req.on('data', chunkValue => { body += chunkValue; });
	req.on('end', () => {
		requestCount += 1;
		let request;
		try {
			request = JSON.parse(body);
		} catch {
			return json(res, 400, { error: { message: 'mock planning server: invalid JSON' } });
		}
		const id = `mock-planning-${requestCount}`;
		const hasToolResult = Array.isArray(request.messages) && request.messages.some(message => message?.role === 'tool');
		if (!hasToolResult) {
			return stream(res, chunk(id, {
				role: 'assistant',
				tool_calls: [{
					index: 0,
					id: 'call-napo-planning-analysis',
					type: 'function',
					function: {
						name: 'positron_execute_code',
						arguments: JSON.stringify({
							language: 'r',
							summary: 'Construir un plan de cobertura a partir de la política versionada',
							code: [
								'policy <- readLines("./Docs/planning-policy.md", warn = FALSE)',
								'baseline_capacity <- as.numeric(sub("baseline_capacity: ", "", policy[startsWith(policy, "baseline_capacity:")]))',
								'target_capacity <- as.numeric(sub("target_capacity: ", "", policy[startsWith(policy, "target_capacity:")]))',
								'gap <- target_capacity - baseline_capacity',
								'plan <- data.frame(action = c("staffing", "training"), units = c(gap * 0.75, gap * 0.25), source_version = "EC-HWF-2026.01")',
								'stopifnot(baseline_capacity == 100, target_capacity == 120, gap == 20, sum(plan$units) == gap)',
								'writeLines("NAPO_PLANNING_OK", "./napo-planning.txt")',
								'cat("NAPO_PLANNING_OK\\n")',
							].join('\n'),
						}),
					},
				}],
			}, 'tool_calls'));
		}
		return stream(res, chunk(id, {
			content: 'El plan se calculó a partir de la política versionada y se verificó en la sesión R viva.',
		}, 'stop'));
	});
});

server.listen(port, host, () => {
	console.log(`mock-napo-planning-server listening on http://${host}:${port}/v1`);
});

function shutdown() {
	server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

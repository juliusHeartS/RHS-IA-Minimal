#!/usr/bin/env node

// Local-only deterministic OpenAI-compatible provider for the Capibara
// positron_execute_code integration test. It never listens outside loopback and never
// writes the workspace; the requested R code performs the controlled write.

import http from 'node:http';

const port = Number(process.argv[2] ?? 18124);
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

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/v1/models') {
		return json(res, 200, { object: 'list', data: [{ id: 'napo-execute-code-fixture', object: 'model', owned_by: 'napo-test' }] });
	}
	if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
		return json(res, 404, { error: { message: 'mock execute_code server: route not found' } });
	}

	let body = '';
	req.setEncoding('utf8');
	req.on('data', chunk => { body += chunk; });
	req.on('end', () => {
		requestCount += 1;
		let request;
		try {
			request = JSON.parse(body);
		} catch {
			return json(res, 400, { error: { message: 'mock execute_code server: invalid JSON' } });
		}
		const hasToolResult = Array.isArray(request.messages) && request.messages.some(message => message?.role === 'tool');
		const id = `mock-execute-code-${requestCount}`;
		if (hasToolResult) {
			return stream(res, {
				id,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: 'napo-execute-code-fixture',
				choices: [{ index: 0, delta: { content: 'El modelo, la simulación y el escenario fueron ejecutados con aprobación dentro del workspace.' }, finish_reason: 'stop' }],
			});
		}
		return stream(res, {
			id,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: 'napo-execute-code-fixture',
			choices: [{
				index: 0,
				delta: {
					role: 'assistant',
					tool_calls: [{
						index: 0,
						id: 'call-napo-execute-code',
						type: 'function',
						function: {
						name: 'positron_execute_code',
							arguments: JSON.stringify({
								language: 'r',
								summary: 'Ejecutar modelo, simulación y escenario de Napo',
								code: [
									'x <- 1:8',
									'y <- 2 + 3 * x',
									'fit <- lm(y ~ x)',
									'set.seed(42)',
									'trajectory <- cumsum(rnorm(100))',
									'scenarios <- data.frame(scenario = c("baseline", "investment"), margin = c(0, 15))',
									'stopifnot(abs(unname(coef(fit)[[2]]) - 3) < 1e-10, length(trajectory) == 100, scenarios$margin[[2]] > scenarios$margin[[1]])',
									'writeLines("NAPO_AGENT_MODELING_OK", "napo-agent-modeling.txt")',
									'cat("NAPO_AGENT_MODELING_OK\\n")',
								].join('\n'),
							}),
						},
					}],
				},
				finish_reason: 'tool_calls',
			}],
		});
	});
});

server.listen(port, host, () => {
	console.log(`mock-napo-execute-code-server listening on http://${host}:${port}/v1`);
});

function shutdown() {
	server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

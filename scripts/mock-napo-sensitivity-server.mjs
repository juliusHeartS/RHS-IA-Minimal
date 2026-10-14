#!/usr/bin/env node

// Local-only deterministic provider for the Napo sensitivity UI evidence.
// It never listens outside loopback and is not part of the shipped product.

import http from 'node:http';

const port = Number(process.argv[2] ?? 18125);
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
		return json(res, 200, { object: 'list', data: [{ id: 'napo-sensitivity-fixture', object: 'model', owned_by: 'napo-test' }] });
	}
	if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
		return json(res, 404, { error: { message: 'mock sensitivity server: route not found' } });
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
			return json(res, 400, { error: { message: 'mock sensitivity server: invalid JSON' } });
		}
		const hasToolResult = Array.isArray(request.messages) && request.messages.some(message => message?.role === 'tool');
		const id = `mock-sensitivity-${requestCount}`;
		if (hasToolResult) {
			return stream(res, {
				id,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: 'napo-sensitivity-fixture',
				choices: [{ index: 0, delta: { content: 'El análisis de sensibilidad fue ejecutado con aprobación en la sesión R viva.' }, finish_reason: 'stop' }],
			});
		}
		return stream(res, {
			id,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: 'napo-sensitivity-fixture',
			choices: [{
				index: 0,
				delta: {
					role: 'assistant',
					tool_calls: [{
						index: 0,
						id: 'call-napo-sensitivity',
						type: 'function',
						function: {
							name: 'positron_execute_code',
							arguments: JSON.stringify({
								language: 'r',
								summary: 'Evaluar sensibilidad de un escenario de Napo',
								code: [
									'baseline <- 100',
									'shock <- c(-0.10, 0, 0.10)',
									'sensitivity <- data.frame(shock = shock, outcome = baseline * (1 + shock))',
									'slope <- (sensitivity$outcome[[3]] - sensitivity$outcome[[1]]) / (shock[[3]] - shock[[1]])',
									'stopifnot(nrow(sensitivity) == 3, sensitivity$outcome[[1]] < sensitivity$outcome[[2]], sensitivity$outcome[[2]] < sensitivity$outcome[[3]], abs(slope - baseline) < 1e-10)',
									'writeLines("NAPO_SENSITIVITY_OK", "napo-sensitivity.txt")',
									'cat("NAPO_SENSITIVITY_OK\\n")',
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
	console.log(`mock-napo-sensitivity-server listening on http://${host}:${port}/v1`);
});

function shutdown() {
	server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

#!/usr/bin/env node

/**
 * Local-only deterministic provider for the Capibara approval E2E.
 *
 * It emits one OpenAI-compatible streaming tool call and never opens a
 * network listener outside loopback. The test workspace is supplied by the
 * caller through the requested tool arguments; this process never writes it.
 */

import http from 'node:http'

const port = Number(process.argv[2] ?? 18123)
const host = '127.0.0.1'
const delayMs = Number(process.env.NAPO_APPROVAL_DELAY_MS ?? 0)
let requestCount = 0

const json = (res, status, body) => {
	res.writeHead(status, { 'content-type': 'application/json' })
	res.end(JSON.stringify(body))
}

const stream = (res, payload) => {
	res.writeHead(200, {
		'cache-control': 'no-cache',
		'connection': 'keep-alive',
		'content-type': 'text/event-stream',
	})
	res.write(`data: ${JSON.stringify(payload)}\n\n`)
	const finish = () => {
		res.write('data: [DONE]\n\n')
		res.end()
	}
	if (delayMs > 0) setTimeout(finish, delayMs)
	else finish()
}

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/v1/models') {
		return json(res, 200, { object: 'list', data: [{ id: 'napo-approval-fixture', object: 'model', owned_by: 'napo-test' }] })
	}

	if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
		return json(res, 404, { error: { message: 'mock approval server: route not found' } })
	}

	let body = ''
	req.setEncoding('utf8')
	req.on('data', chunk => { body += chunk })
	req.on('end', () => {
		requestCount += 1
		let request
		try {
			request = JSON.parse(body)
		} catch {
			return json(res, 400, { error: { message: 'mock approval server: invalid JSON' } })
		}

		const hasToolResult = Array.isArray(request.messages)
			&& request.messages.some(message => message?.role === 'tool')
		const id = `mock-approval-${requestCount}`
		if (request.stream !== true) {
			return json(res, 200, {
				id,
				object: 'chat.completion',
				created: Math.floor(Date.now() / 1000),
				model: 'napo-approval-fixture',
				choices: [{ index: 0, message: { role: 'assistant', content: 'Napo approval fixture' }, finish_reason: 'stop' }],
			})
		}
		if (hasToolResult) {
			return stream(res, {
				id,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: 'napo-approval-fixture',
				choices: [{ index: 0, delta: { content: 'La herramienta fue rechazada o completada según la decisión de la persona usuaria.' }, finish_reason: 'stop' }],
			})
		}

		return stream(res, {
			id,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: 'napo-approval-fixture',
			choices: [{
				index: 0,
				delta: {
					role: 'assistant',
					tool_calls: [{
						index: 0,
						id: 'call-napo-approval',
						type: 'function',
						function: {
							name: 'write_to_file',
							arguments: JSON.stringify({ path: 'napo-approval-test.txt', content: 'NAPO APPROVAL TEST' }),
						},
					}],
				},
				finish_reason: 'tool_calls',
			}],
		})
	})
})

server.listen(port, host, () => {
	console.log(`mock-openai-approval-server listening on http://${host}:${port}/v1 (delay=${delayMs}ms)`)
})

const shutdown = () => server.close(() => process.exit(0))
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

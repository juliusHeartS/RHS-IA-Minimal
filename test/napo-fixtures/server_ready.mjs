import { createServer } from 'node:http';

const port = 8768;
const server = createServer((_request, response) => {
	const body = 'NAPO_DEBUG_SERVER_READY_NODE_OK\n';
	response.writeHead(200, {
		'Content-Type': 'text/plain; charset=utf-8',
		'Content-Length': Buffer.byteLength(body),
	});
	response.end(body);
});

server.listen(port, '127.0.0.1', () => {
	console.log(`listening on port ${port}`);
});

const close = () => server.close(() => process.exit(0));
process.on('SIGINT', close);
process.on('SIGTERM', close);

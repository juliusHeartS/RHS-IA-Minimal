"""Small local server used to exercise Napo's serverReadyAction integration."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


PORT = 8767


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 - required by BaseHTTPRequestHandler
        body = b"NAPO_DEBUG_SERVER_READY_OK\n"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, _format, *_args):
        return


server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
print(f"listening on port {PORT}", flush=True)

try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()

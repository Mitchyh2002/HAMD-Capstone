from urllib import request

from flask import Response
from werkzeug.serving import run_simple
import sys

from Program import application

if __name__ == "__main__":
    app = run_simple('localhost', 5000, application,
           use_reloader=True, use_debugger=True, use_evalex=False)

try:
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            res = Response()
            res.headers['X-Content-Type-Options'] = '*'
            return res
except:
    ...
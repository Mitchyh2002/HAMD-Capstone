from werkzeug.serving import run_simple

from Program import application

run_simple('localhost', 5000, application,
           use_reloader=True, use_debugger=True, use_evalex=True)


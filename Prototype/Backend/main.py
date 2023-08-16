from werkzeug.serving import run_simple

from Program import application

run_simple('localhost', 5000, application,
           use_reloader=False, use_debugger=False, use_evalex=False)


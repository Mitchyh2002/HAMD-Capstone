from werkzeug.serving import run_simple
import sys

from Program import application

def start():
    run_simple('localhost', 5000, application,
           use_reloader=True, use_debugger=True, use_evalex=False)

if __name__ == "__main__":
    start()
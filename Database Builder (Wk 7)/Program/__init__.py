from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
import os

db = SQLAlchemy()
login_manager = LoginManager()
app = Flask(__name__)

to_reload = False

def import_blueprint(moduleName, ModuleFile):
    for file in ModuleFile:
        new_blueprint = __import__(f"Program.Module.{moduleName}.{file.strip('.py')}")
        try:
            app.register_blueprint(eval(f"new_blueprint.Module.{moduleName}.{file.strip('.py')}.blueprint"))
        except ModuleNotFoundError:
            print("Module Doesn't have Blueprint file")

def init_app() -> Flask:
    app.secret_key = '1738'

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:root@127.0.0.1:5432/CapstoneTestDB'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    UPLOAD_FOLDER = '/static/img'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    login_manager.login_view = 'authentication.login'
    login_manager.init_app(app)

    # Allow Bootstrap in HTML Online Server.
    bootstrap = Bootstrap(app)

    db.init_app(app)
    CORS(app)

    # Register all blueprints here

    #TO-DO SQL QUERY ALL ACTIVE MODULES
    walk = next(os.walk('Program/Module'))[1]
    walk.pop(walk.index("__pycache__"))
    for moduleName in walk:
        files =  next(os.walk(f'Program/Module/{moduleName}'))[1:]
        if "__pycache__" in files:
            files.pop(files.index("__pycache__"))
        if len(walk) != 0:
            import_blueprint(moduleName, files[1])

    return app

class AppReloader(object):
    def __init__(self, create_app):
        self.create_app = create_app
        self.app = create_app()

    def get_application(self):
        global to_reload
        if to_reload:
            self.app = self.create_app()
            to_reload = False

        return self.app

    def __call__(self, environ, start_response):
        app = self.get_application()
        return app(environ, start_response)

def reload():
        global to_reload
        to_reload = True
        return "reloaded"

# This application object can be used in any WSGI server
# for example in gunicorn, you can run "gunicorn app"
application = AppReloader(init_app)



from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
import os

# DO NOT EVER CHANGE THIS Variable
# THIS VARIABLE INITALISES A GLOBAL reload variable
to_reload = False

db = SQLAlchemy()

def import_blueprint(app, moduleName, ModuleFile):
    """
    Blueprint importer function, this will scan the module directory for valid blueprints and load them into the system.

    Parameters:
        app (obj): Object referencing the main flask application
        moduleName: string containing module reference (df1)
        ModuleFile: List of files in a given module.

    Returns:
        None

    Exceptions:
        ModuleNotFoundException: Python File doesn't have a blueprint object.

    """
    for file in ModuleFile:
        new_blueprint = __import__(f"Program.Module.{moduleName}.{file.strip('.py')}")
        try:
            app.register_blueprint(eval(f"new_blueprint.Module.{moduleName}.{file.strip('.py')}.blueprint"))
        except ModuleNotFoundError:
            print("Module Doesn't have Blueprint file")


def init_app() -> Flask:

    login_manager = LoginManager()
    app = Flask(__name__)

    app.secret_key = '1738'

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:password@localhost:5000/CapstoneTestDB'
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

    # TO-DO SQL QUERY ALL ACTIVE MODULES
    print(os.getcwdb())
    walk = next(os.walk('Program/Module'))[1]
    for moduleName in walk:
        files = next(os.walk(f'Program/Module/{moduleName}'))[1:]
        if "__pycache__" in files:
            files.pop(files.index("__pycache__"))
        if len(walk) != 0:
            import_blueprint(app, moduleName, files[1])

    return app


class AppReloader(object):
    '''
    Pseudo Application Factory, handles the application reload by manually flaging a system change and reloading application

    Managed by global reload function.
    '''

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
    """
    Function to reload the flask app.

    Parameters:
        None

    Returns:
        None
    """
    global to_reload
    to_reload = True
    return "reloaded"

application = AppReloader(init_app)


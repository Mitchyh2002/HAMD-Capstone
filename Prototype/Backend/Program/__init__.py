import re

from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin
from flask_mail import Mail
import os


# DO NOT EVER CHANGE THIS Variable
#  INITIALISES A GLOBAL reload variable
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
        imp_str = "Program.Module." + str(moduleName) + "." + str(file.replace('.py', ''))
        try:
            new_blueprint = __import__(imp_str)
            bp_str = "new_blueprint.Module." + str(moduleName) + "." + str(file.replace('.py', '')) + ".blueprint"
            app.register_blueprint(eval(bp_str))
        except AttributeError:
            print("Module Doesn't have Blueprint Variable")


def init_app() -> Flask:

    # APP CONFIG
    app = Flask(__name__)

    app.secret_key = '1738'

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:root@localhost:5432/CapstoneTestDB'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['FRONT_END_URL'] = 'http://localhost:3000'

    UPLOAD_FOLDER = '/static/img'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # LOGIN CONFIG
    
    login_manager = LoginManager()
    login_manager.login_view = 'user.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(userID):
       return UserMixin.query.filter_by(token = userID).first()

    # MAIL CONFIG
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    # MAIL LOGIN
    app.config['MAIL_USERNAME'] = 'hamdcapstonetest@gmail.com'
    app.config['MAIL_PASSWORD'] = 'eubbbgwfisedcrlt'
    app.config['MAIL_DEFAULT_SENDER'] = 'hamdcapstonetest@gmail.com'
    
    app.mail = Mail(app)
    
    # Allow Bootstrap in HTML Online Server.
    bootstrap = Bootstrap(app)

    db.init_app(app)
    CORS(app)

    # Register all blueprints here

    # TO-DO SQL QUERY ALL ACTIVE MODULES
    cwd = os.getcwd() + "\\Prototype\\Backend"
    if os.path.exists(cwd):
        os.chdir(os.getcwd() + "\\Prototype\\Backend")

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


def export_key():
    return application.app.config["SECRET_KEY"]

def export_mail_sender():
    return application.app.config["MAIL_DEFAULT_SENDER"]

def export_mail():
    return application.app.mail


def export_front_end_link():
    return application.app.config["FRONT_END_URL"]

application = AppReloader(init_app)

from Program.OS import dir_tree, convert_to_imports
from sqlalchemy.exc import IntegrityError
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, delete

from Program import db

def create_db(modules=None):

    '''
    Insert Tables into the database, if no-modules are specified re-build the entire database.

    Paramaters:
        modules (list): Python list containing strings for modules to be added to the database.
            Default: None, if modules is none rebuild database

    Returns:
        None
    '''

    url = f"postgresql+psycopg2://root:root@127.0.0.1:5432/CapstoneTestDB"

    if modules is not None:
        engine = create_engine(url)
        engine.connect()

        for module in modules:
            __import__(module)
        db.metadata.create_all(engine, checkfirst=True)

    else:
        for module in convert_to_imports(dir_tree("Program\DB\Models")):
            __import__(module)

        engine = create_engine(url)
        engine.connect()

        db.metadata.drop_all(engine)
        db.metadata.create_all(engine)
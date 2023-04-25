from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy import create_engine, delete
from Program.OS import dir_tree, convert_to_imports

db = declarative_base()


def query_db():
    '''
    Database connection with all valid tables initalised, this function is to ensure that the entire DB, can be queried
    and when importing tables the system won't drop the entire db.

    Parameters:
        None

    Returns:
        engine (obj): object containing a connection to the DB, this shoule be used for imports & queries only
    '''

    for module in convert_to_imports(dir_tree("Program.DB.Models")):
        __import__(module)

    url = f"postgresql+psycopg2://postgres:root@127.0.0.1:5432/CapstoneTestDB"
    engine = create_engine(url)
    engine.connect()

    return engine


def create_db(modules=None):

    '''
    Insert Tables into the database, if no-modules are specified re-build the entire database.

    Paramaters:
        modules (list): Python list containing strings for modules to be added to the database.
            Default: None, if modules is none rebuild database

    Returns:
        None
    '''

    if modules is not None:
        for module in modules:
            __import__(module)
    else:
        for module in convert_to_imports(dir_tree("Program.DB.Models")):
            __import__(module)
    url = f"postgresql+psycopg2://postgres:root@127.0.0.1:5432/CapstoneTestDB"
    engine = create_engine(url)
    engine.connect()

    db.metadata.drop_all(engine)
    db.metadata.create_all(engine)


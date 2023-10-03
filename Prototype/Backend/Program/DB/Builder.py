import psycopg2.errorcodes
from Program.OS import dir_tree, convert_to_imports
from sqlalchemy.exc import IntegrityError
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, delete, text, TIMESTAMP, DATETIME
import re
from Program import db

url = 'postgresql+psycopg2://postgres:root@127.0.0.1:5432/CapstoneTestDB'

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

def add_column(table_rows):
    '''
    Add Column to Existing table in DB.

    This function is jank, but creates a fake column based on the new_rows variable, then creates a sql query to add to DB.

    Inputs:
        List of Dictionary TableName & valid python code for a sqlalchemy Columns

    Returns None - Adds Column to table in DB.
    '''
    engine = create_engine(url)
    with engine.connect() as conn:
        i = 0
        for tbl in table_rows:
            if tbl == {}:
                continue
            table_name = list(tbl.keys())[0]
            if len(tbl[table_name]) == 0:
                continue # No New Rows in File
            for row in [x.strip() for x in tbl[table_name]]:
                varPattern = '[A-Za-z]+.(?= =)'
                evalPattern = '(?<= = ).+'
                column_name = re.findall(varPattern, row)[0]
                ColumnInfo = re.findall(evalPattern, row)[0]
                new_row = eval(ColumnInfo)
                column_type = new_row.type
                default = new_row.default
                foreign_keys = list(new_row.foreign_keys)
                if default is None:
                    default = ''
                else:
                    default = f"DEFAULT '{new_row.default.arg}'"
                if str(column_type) == 'DATETIME':
                    column_type = 'TIMESTAMP'
                try:
                    conn.execute(text('ALTER TABLE %s ADD COLUMN %s %s %s' % (table_name, column_name, column_type, default)))
                except:
                    return "An Unknown Error Occured when addign Column to table please Check you Table Files in Module"
                if len(foreign_keys) == 0:
                    foreign_keys = ''
                else:
                    for key in foreign_keys:
                        split_key = key.target_fullname.split(".")
                        conn.execute(text(f"ALTER TABLE {table_name} ADD CONSTRAINT FK_{column_name} FOREIGN KEY ({column_name})"
                                       f" REFERENCES {split_key[0]} ({'.'.join(split_key[1:])})"))
                if new_row.unique is not None:
                    conn.execute(text(f"ALTER TABLE {table_name} ADD UNIQUE ({column_name})"))
                conn.commit()

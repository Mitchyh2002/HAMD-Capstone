from create_db import sys_create
from sqlalchemy import create_engine
import sqlalchemy.exc

def db_conn():
    db_conn_string = input("Please Enter DB Connection String")

    with open("Program/DB/Builder.py", "r") as db_file_read:
        content = db_file_read.readlines()
        for i, line in enumerate(content):
            if 'url = ' in line:
                content.pop(i)
                content.insert(i, f"url = '{db_conn_string}'\n")
    try:
        engine = create_engine(db_conn_string)
        engine.connect()
    except sqlalchemy.exc.ArgumentError:
        print(f"Unable to Parse SQL Alchemy String from {db_conn_string}, please try Again")
        return db_conn()
    except sqlalchemy.exc.OperationalError:
        print(f"Unable to Connect to Database from URL {db_conn_string}, please try Again")
        return db_conn()

    with open("Program/DB/Builder.py", "w") as db_file_write:
        db_file_write.writelines(content)

    return db_conn_string

if __name__ == "__main__":
    db_conn()
    sys_create()
    print("System Setup Please Run Main")
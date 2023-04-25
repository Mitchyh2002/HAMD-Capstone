from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy import create_engine, delete
import os

db = declarative_base()

Tables = os.listdir(os.getcwd() + r"/Program/DB/Models")
Tables.remove("__pycache__")

for Table in Tables:
    __import__(f"Program.DB.Models.{Table[0:-3]}")

url = f"postgresql+psycopg2://postgres:root@127.0.0.1:5432/CapstoneTestDB"
engine = create_engine(url)
engine.connect()

def create_db():

    db.metadata.drop_all(engine)
    db.metadata.create_all(engine)


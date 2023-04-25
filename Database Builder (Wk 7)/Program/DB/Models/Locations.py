from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import *
from Program.DB import db

class Location(db):
    __tablename__ = "Locations"
    id = Column(Integer, primary_key=True)
    region = Column(String(60), unique=True)

from Program.DB import db
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import *


class Users(db):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)


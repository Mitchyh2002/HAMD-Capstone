from Program.DB import db 
from sqlalchemy import Column, ForeignKey 
from sqlalchemy.types import *
 
 
class df1_quiz(db):
	__tablename__ = 'prototypemodule_quiz'
	id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
	UserID = Column(Integer, unique=True)

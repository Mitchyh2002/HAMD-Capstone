from Program.DB import db 
from sqlalchemy import Column, ForeignKey 
from sqlalchemy.types import * 
 
 
class prototypemodule_hives(db):
	__tablename__ = 'prototypemodule_hives'
	id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
	UserID = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True)
	HiveName = Column(String(60), nullable=False)
	HiveLocation = Column(String(60), ForeignKey('Locations.region', ondelete='CASCADE'), unique=True)

from flask_security import RoleMixin
from sqlalchemy.ext.mutable import MutableList

from Program import db
from Program.ResponseHandler import on_error

class refAdminRoles(db.Model, RoleMixin):
    __tablename__ = "ref.AdminRoles"
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    userRead = db.Column(db.Boolean, nullable=False)
    userWrite = db.Column(db.Boolean, nullable=False)
    adminRead = db.Column(db.Boolean, nullable=False)
    adminWrite = db.Column(db.Boolean, nullable=False)
    adminUpload = db.Column(db.Boolean, nullable=False)
    adminAdmin = db.Column(db.Boolean, nullable=False)


def initRefTable():

    db.session.add_all([
        refAdminRoles(id=0, name='User', description='Base user level permissions', userRead=True, userWrite=True, adminRead=False,adminWrite=False,adminUpload=False,adminAdmin=False),
        refAdminRoles(id=1, name='Admin', description='Admin level that allows user management', userRead=True, userWrite=True, adminRead=True,adminWrite=True,adminUpload=False,adminAdmin=False),
        refAdminRoles(id=2, name='SuperAdmin', description='Admin level that allows module management and admin management', userRead=True, userWrite=True, adminRead=True,adminWrite=True,adminUpload=True,adminAdmin=True)]
        )
        
    db.session.commit()
        
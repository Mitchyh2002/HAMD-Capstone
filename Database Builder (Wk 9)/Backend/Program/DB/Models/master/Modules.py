from Program import db

class Module(db.Model):
    __tablename__ = "modules"
    prefix = db.Column(db.String(4), primary_key=True)
    displayName = db.Column(db.String)
    moduleKey = db.Column(db.CHAR(32))
    status = db.Column(db.Boolean)


def create_module(prefix, displayName, moduleKey, status):
    created_module = Module()
    created_module.prefix = prefix
    created_module.displayName = displayName
    created_module.moduleKey = moduleKey
    created_module.status = status

    return created_module

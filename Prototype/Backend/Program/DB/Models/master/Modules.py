from Program import db
from Program.ResponseHandler import on_error

class Module(db.Model):
    __tablename__ = "modules"
    prefix = db.Column(db.String(3), primary_key=True)
    displayName = db.Column(db.String)
    moduleKey = db.Column(db.CHAR(32))
    status = db.Column(db.Boolean)

    def toJSON(self, is_query=False):
        '''
        QOL function to convert OBJ to a valid JSON file. If is for query only return prefix & display name.

        Paramaters:
            is_query (Bool): True, if sending to front end, default False.

        returns:
            Dict Representation of OBJ
        '''
        if is_query:
            return {"prefix": self.prefix,
                    "displayName": self.displayName.strip()}
        return {
            "prefix": self.prefix,
            "displayName": self.prefix.strip(),
            "moduleKey": self.moduleKey.strip(),
            "status": self.status
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

def create_module(prefix, displayName, moduleKey, status):
    created_module = Module()
    created_module.prefix = prefix
    created_module.displayName = displayName
    created_module.moduleKey = moduleKey
    created_module.status = status

    return created_module

def JSONtoModule(JSON):
    '''
    Function to convert JSON to Module.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Module OBJECT

    Returns:
        created_module (Module): Returns a valid Module Object
    '''

    try:
        created_module = Module()
        created_module.prefix = JSON["prefix"]
        created_module.displayName = JSON["displayName"]
        created_module.moduleKey = JSON["moduleKey"]
        created_module.status = JSON["status"]
    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_module

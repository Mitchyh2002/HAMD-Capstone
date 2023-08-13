from Program import db
from Program.ResponseHandler import on_error

class moduleAccess(db.Model):
    __tablename__ = "moduleAccess"
    moduleAccessID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    modulePrefix = db.Column(db.String(3), db.ForeignKey('modules.prefix'))
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'))

    def toJSON(self):
        '''
        QOL function to convert OBJ to a valid JSON file.

        returns:
            Dict Representation of OBJ
        '''
        return {"id": self.moduleAccessID,
                "groupID": self.modulePrefix,
                "userID": self.userID}

    def insert(self):
        db.session.add(self)
        db.session.commit()


def create_moduleAccess(modulePrefix, userID):
    created_moduleAccess = moduleAccess()
    created_moduleAccess.modulePrefix = modulePrefix
    created_moduleAccess.userID = userID

    return created_moduleAccess

def JSONtomoduleAccess(JSON):
    '''
    Function to convert JSON to Group.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Group OBJECT

    Returns:
        created_group (Group): Returns a valid Module Object
    '''

    try:
        created_moduleAccess = moduleAccess()
        created_moduleAccess.modulePrefix = JSON["modulePrefix"]
        created_moduleAccess.userID = JSON["userID"]

    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_moduleAccess
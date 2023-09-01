from Program import db
from Program.ResponseHandler import on_error

class Group(db.Model):
    __tablename__ = "grp_group"
    groupID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    displayName = db.Column(db.String(200), nullable=False)
    securityLevel = db.Column(db.Integer, default=1)

    def toJSON(self):
        '''
        QOL function to convert OBJ to a valid JSON file.

        returns:
            Dict Representation of OBJ
        '''
        return {"id": self.groupID,
                "DisplayName": self.displayName,
                "securityLevel": self.securityLevel
                }


    def insert(self):
        db.session.add(self)
        db.session.commit()


def create_group(DisplayName, securityLevel=None):
    created_group = Group()
    created_group.displayName = DisplayName
    created_group.securityLevel = securityLevel
    if securityLevel == None:
        created_group.securityLevel = 1

    return created_group

def JSONtoGroup(JSON):
    '''
    Function to convert JSON to Group.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Group OBJECT

    Returns:
        created_group (Group): Returns a valid Module Object
    '''

    try:
        created_group = Group()
        created_group.DisplayName = JSON["DisplayName"]
        created_group.securityLevel = JSON.get["securityLevel"]

    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_group
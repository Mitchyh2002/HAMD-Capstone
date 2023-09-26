from Program import db
from Program.ResponseHandler import on_error

class userGroup(db.Model):
    __tablename__ = "grp_userGroup"
    userGroupID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    groupID = db.Column(db.Integer, db.ForeignKey('grp_group.groupID'),nullable=False)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)

    def toJSON(self):
        '''
        QOL function to convert OBJ to a valid JSON file.

        returns:
            Dict Representation of OBJ
        '''
        return {"groupID": self.groupID,
                "userID": self.userID}

    def insert(self):
        db.session.add(self)
        db.session.commit()


def create_userGroup(groupID, userID):
    created_userGroup = userGroup()
    created_userGroup.groupID = groupID
    created_userGroup.userID = userID

    return created_userGroup

def JSONtoGroup(JSON):
    '''
    Function to convert JSON to Group.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Group OBJECT

    Returns:
        created_group (Group): Returns a valid Module Object
    '''

    try:
        created_userGroup = userGroup()
        created_userGroup.groupID = JSON.get["groupID"]
        created_userGroup.userID = JSON.get["userID"]

    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_userGroup
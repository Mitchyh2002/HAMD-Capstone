from Program import db
from Program.ResponseHandler import on_error

class moduleGroups(db.Model):
    __tablename__ = "grp_moduleGroups"
    moduleGroupID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    module_prefix = db.Column(db.String(3), db.ForeignKey('modules.prefix'), nullable=False)
    groupID = db.Column(db.Integer, db.ForeignKey('grp_group.groupID'), nullable=False)

    def toJSON(self):
        '''
        QOL function to convert OBJ to a valid JSON file.

        returns:
            Dict Representation of OBJ
        '''
        return {
                "module_prefix": self.module_prefix,
                "groupID": self.groupID}

    def insert(self):
        db.session.add(self)
        db.session.commit()


def create_moduleGroup(groupID, module_prefix):
    created_moduleGroup = moduleGroups()
    created_moduleGroup.module_prefix = module_prefix
    created_moduleGroup.groupID = groupID

    return created_moduleGroup

def JSONtoGroup(JSON):
    '''
    Function to convert JSON to Group.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Group OBJECT

    Returns:
        created_group (Group): Returns a valid Module Object
    '''

    try:
        created_moduleGroup = moduleGroups()
        created_moduleGroup.module_prefix = JSON["module_prefix"]
        created_moduleGroup.groupID = JSON["groupID"]
    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_moduleGroup

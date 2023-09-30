from Program import db
from Program.ResponseHandler import on_error
from datetime import datetime

class ModuleSecurity(db.Model):
    __tablename__ = "mst_ModuleSecurity"
    ModuleSecurityID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    modulePrefix = db.Column(db.String(3), db.ForeignKey('modules.prefix'), nullable=False)
    pageName = db.Column(db.String(100), nullable=False)
    pageCode = db.Column(db.String(6), nullable=False)
    description = db.Column(db.String(255))
    SecurityLevel = db.Column(db.Integer, nullable=False)
    PostDate = db.Column(db.DateTime, default=datetime.now())


    def toJSON(self):
        '''
        QOL function to convert OBJ to a valid JSON file.

        returns:
            Dict Representation of OBJ
        '''
        return {"modulePrefix":self.modulePrefix,
                "pageName": self.pageName,
                "pageCode": self.pageCode,
                "securityLevel": self.SecurityLevel,
                "description": self.description}

    def insert(self):
        db.session.add(self)
        db.session.commit()


def create_moduleAccess(userID, modulePrefix,pageCode,pageName,SecurityLevel, description=''):
    created_securityLevel = ModuleSecurity()
    created_securityLevel.modulePrefix = modulePrefix
    created_securityLevel.pageCode =pageCode
    created_securityLevel.pageName = pageName
    created_securityLevel.SecurityLevel = SecurityLevel
    created_securityLevel.description = description

    return created_securityLevel

def JSONtomoduleAccess(JSON):
    '''
    Function to convert JSON to Group.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a Group OBJECT

    Returns:
        created_group (Group): Returns a valid Module Object
    '''

    try:
        created_securityLevel = ModuleSecurity()
        created_securityLevel.modulePrefix = JSON["modulePrefix"]
        created_securityLevel.pageCode = JSON["pageCode"]
        created_securityLevel.pageName = JSON["pageName"]
        created_securityLevel.SecurityLevel = JSON["SecurityLevel"]
        created_securityLevel.description = JSON.get("description")

    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_securityLevel

def init_masterPages():
    page1 = create_moduleAccess(1,'mst','1','Plugins',5, "Show All Modules")
    page2 = create_moduleAccess(1,'mst','2','Add Plugin',7, "Add Plugin To System")
    page3 = create_moduleAccess(1, 'mst','3','Users',5, "Show All Users")
    page4 = create_moduleAccess(1, 'mst', '3.1', 'Add User', 5, "Add User to System")
    page1.insert()
    page2.insert()
    page3.insert()
    page4.insert()
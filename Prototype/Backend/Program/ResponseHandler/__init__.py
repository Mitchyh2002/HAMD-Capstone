import json
import jwt
from Program import export_key


def on_error(error_code, error_message):
    return {"Success": False,
            "StatusCode": error_code,
            "Message": error_message}

def on_success(data):
    return {
        "Success": True,
        "StatusCode": 200,
        "Values": data
    }

def not_configured():
    return {
        "Success": True,
        "StatusCode": 1001,
        "Values": "System Not Configured"
    }



def userFunctionAuthorisations(Auth_Header, adminLvl, modulePrefix):
    from Program.DB.Models.grp.userGroups import userGroup
    from Program.DB.Models.grp.Groups import Group
    from Program.DB.Models.grp.moduleGroups import moduleGroups
    from Program.DB.Models.mst.moduleAccess import moduleAccess

    if Auth_Header == None or 'null' in Auth_Header:
        return on_error(400, "Auth Header Not Provided")
    try:
        user = bearer_decode(Auth_Header)
    except Exception as e:
        return on_error(400, str(e))
    if user['Success'] == False:
        return user
    user = user['Values']
    userGroupsIDS = [group.groupID for group in userGroup.query.filter_by(userID=user['userID']).all()]
    if userGroupsIDS != []:
        groups = Group.query.filter(Group.groupID.in_(userGroupsIDS)).all()
        for group in groups:
            modules = moduleGroups.query.filter_by(groupID=group.groupID).all()
            for module in modules:
                if module.module_prefix == modulePrefix and group.securityLevel == adminLvl:
                    return True
    if adminLvl >= 5:
        visibleModules = moduleAccess.query.filter_by(userID=user['userID'], modulePrefix=modulePrefix).first()
        if visibleModules == None:
            return on_error(401, "You do not have access to the function")

    if user['adminLevel'] < adminLvl:
        return on_error(401, "You do not have access to the function")
    return True


def bearer_decode(Auth_Header, algorithms=["HS256"]):
    from Program.DB.Models.mst.User import User

    if Auth_Header is None:
        return on_error(400, "Token Not Sent")
    if 'null' in Auth_Header:
        return on_error(400, "Token Not Sent")
    if 'Bearer ' in Auth_Header:
        Auth_Header = Auth_Header.split('Bearer ')[1]



    try:
        decoded_data = jwt.decode(jwt=Auth_Header,
                                  key=export_key(),
                                  algorithms=algorithms)
    except jwt.ExpiredSignatureError:
        return on_error(403, "Invalid Token, This Token Has Expired")
    except ValueError:
        return on_error(403, "Invalid Token, Not Enough Segments")
    except jwt.exceptions.DecodeError:
        return on_error(403, "Invalid Token, Not Enough Segments")
    user = User.query.filter_by(email=decoded_data.get('email')).first()
    if user is None:
        return on_error(400, "User Does Not Exist")
    return on_success(user.toJSON())
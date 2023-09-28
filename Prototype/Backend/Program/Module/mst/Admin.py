from datetime import datetime
from flask import Blueprint, request
try:
    from sqlalchemy import Update
    from sqlalchemy import select as Select
except ImportError:
    from sqlalchemy import select as Select
    from sqlalchemy import update as Update

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.ResponseHandler import on_error, on_success
from Program.OS import userFunctionAuthorisations, bearer_decode
from Program.Module.mst.User import emailIsValid, firstNameIsValid, dateOfBirthIsValid, phoneNumberIsValid, QuerySelectUser

blueprint = Blueprint('admin', __name__, url_prefix="/mst/admin")

TESTING = True

@blueprint.route('/getAllUsers', methods=['GET', 'OPTIONS'])
def getAllUsers():
    if request.method == 'OPTIONS':
        return on_success("Pre-flight request")
    
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if not accessGranted:
        return accessGranted

    adminUser = adminReturn(user_bearer)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")
    
    return [User.toJSON() for User in User.query.filter(User.adminLevel < adminUser['adminLevel']).all()]

@blueprint.route('/getUser/<userID>', methods=['GET'])
def getUser(userID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
     
    if not accessGranted:
        return accessGranted
    
    adminUser = adminReturn(user_bearer, userID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    return [User.toJSON() for User in Select(User).where(User.userID == userID).first()]
    
@blueprint.route('/updateUser/<ID>', methods=['POST', 'OPTIONS'])
def updateUser(ID):
    if request.method == 'OPTIONS':
        return on_success("Pre-flight request")
    
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if not accessGranted:
        return accessGranted

    adminUser = adminReturn(user_bearer, ID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    input = request.values
    inputEmail = input.get('email')
    inputFirstName = input.get('firstName')
    inputDateOfBirth = input.get('dateOfBirth')
    inputPhoneNumber = input.get('phoneNumber')

    targetUser = User.query.filter(User.userID == ID).first()
    if inputEmail is not None and inputEmail != "" and emailIsValid(inputEmail):
        inputEmail = inputEmail.lower()
        uniqueEmail = QuerySelectUser(inputEmail)
        if type(uniqueEmail).__name__ == "user" and uniqueEmail.userID != ID:
            return on_error(14, "Email is already taken")

        targetUser.email = inputEmail

    if inputFirstName is not None and inputFirstName != "" and firstNameIsValid(inputFirstName):
        targetUser.firstName = inputFirstName

    if inputDateOfBirth is not None and inputDateOfBirth != "" and dateOfBirthIsValid(inputDateOfBirth):
        targetUser.dateOfBirth = inputDateOfBirth

    if inputPhoneNumber is not None and inputPhoneNumber != "" and phoneNumberIsValid(inputPhoneNumber):

        uniquePhone = QuerySelectUser(inputPhoneNumber, False)
        if type(uniquePhone).__name__ == "user" and uniqueEmail.userID != ID:
            return on_error(53, "Phone Number is already taken.")

        targetUser.phoneNumber = inputPhoneNumber

    db.session.add(targetUser)
    db.session.commit()
    return on_success("User has been updated")

@blueprint.route('/updateLevel/<ID>', methods=['POST', 'OPTIONS'])
def updateUserLevel(ID):
    if request.method == 'OPTIONS':
        return on_success("Pre-flight request")
    
    if request.values.get('adminLevel') != '':
        user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
        accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
        
        if not accessGranted:
            return accessGranted

        adminUser = adminReturn(user_bearer, ID)
        if len(adminUser) == 3:
            return on_error(402, "User does not have access to make changes")
        
        
        targetUser = User.query.filter(User.userID == ID).first()
        desired_level = int(request.values.get('adminLevel'))
        
        if ID == adminUser['userID']:
            return on_error(1, "Cannot modify your own permissions")

        if desired_level > adminUser['adminLevel']:
            return on_error(2, "Cannot give a user greater permissions than you have")

        targetUser.adminLevel = desired_level
        db.session.add(targetUser)
        db.session.commit()
        return on_success("User level has been changed")
    
    return on_success("User Level not changed")

@blueprint.route('/resetUserPassword/<ID>', methods=['POST'])
def resetUserPassword(ID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if accessGranted == False:
        return accessGranted

    adminUser = adminReturn(user_bearer, ID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    targetUser = Select(User).where(userID = ID)
    if type(targetUser).__name__ == "user":
        input = request.values
        inputPass = input.get('password')

        if inputPass == "" or inputPass is None:
            return on_error(20, "Password is required, please enter a password")
        
        targetUser.changePassword(inputPass)
        return on_success("Password changed")
    else:
        return on_error(62, "Account is not valid")    

@blueprint.route('/adminCheckForRoutes')
def adminCheck():
    if request.method == 'OPTIONS':
        return on_success("pre-flight request")
    
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    auth = userFunctionAuthorisations(user_bearer, 5, 'mst')
    if (auth):
        return on_success("Admin level satisfied")
    else:
        return auth


def adminReturn(auth_header, targetUser=0):
    user = bearer_decode(auth_header)
    user = user['Values']

    if targetUser != 0:
        level_required = adminLevelRequired(targetUser)
        if user['adminLevel'] < level_required:
            return on_error(401, "You do not have access to the function")

    return user

def adminLevelRequired(ID):
    return (User.query.filter(User.userID == ID).first()).adminLevel
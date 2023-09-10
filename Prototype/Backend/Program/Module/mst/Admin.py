from datetime import datetime
from flask import Blueprint, request
try:
    from sqlalchemy import Select, Update
except ImportError:
    from sqlalchemy import select as Select
    from sqlalchemy import update as Update

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.ResponseHandler import on_error, on_success
from Program.OS import userFunctionAuthorisations, bearer_decode
from Program.Module.mst.User import emailIsValid, firstNameIsValid, dateOfBirthIsValid, phoneNumberIsValid, QuerySelectUser

blueprint = Blueprint('admin', __name__, url_prefix="/admin")

TESTING = True

@blueprint.route('/getAllUsers', methods=['GET'])
def getAllUsers():
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if accessGranted == False
        return accessGranted

    adminUser = adminReturn(user_bearer)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")
    
    return [User.toJSON() for User in Select(User).where(User.adminLevel < adminUser['adminLevel']).all()]

@blueprint.route('/getUser/<userID>', methods=['GET'])
def getUser(userID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
     
    if accessGranted == False:
        return accessGranted
    
    adminUser = adminReturn(user_bearer, userID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    return [User.toJSON() for User in Select(User).where(User.userID == userID).first()]
    
@blueprint.route('/updateUser/<userID>', methods=['POST'])
def updateUser(userID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if accessGranted == False:
        return accessGranted

    adminUser = adminReturn(user_bearer, userID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    input = request.values
    inputEmail = input.get('email')
    inputFirstName = input.get('firstName')
    inputDateOfBirth = input.get('dateOfBirth')
    inputPhoneNumber = input.get('phoneNumber')

    targetUser = Select(User).where(User.userID = userID)
    if not (inputEmail is None and emailIsValid(inputEmail)):

        uniqueEmail = QuerySelectUser(inputEmail)
        if type(uniqueEmail).__name__ == "user" and uniqueEmail.userID != userID:
            return on_error(14, "Email is already taken")

        targetUser.email = inputEmail

    if not (inputFirstName is None and firstNameIsValid(inputFirstName)):
        targetUser.firstName = inputFirstName

    if not (inputDateOfBirth is None and dateOfBirthIsValid(inputDateOfBirth)):
        targetUser.dateOfBirth = inputDateOfBirth

    if not (inputPhoneNumber is None and phoneNumberIsValid(inputPhoneNumber)):

        uniquePhone = QuerySelectUser(inputPhoneNumber, False)
        if type(uniquePhone).__name__ == "user" and uniqueEmail.userID != userID:
            return on_error(53, "Phone Number is already taken.")

        targetUser.phoneNumber = inputPhoneNumber

    Update(User).where(User.userID = userID).values(email=targetUser.email, firstName=targetUser.firstName, dateOfBirth=targetUser.dateOfBirth, phoneNumber=targetUser.phoneNumber)
    db.session.commit()
    return on_success("User has been updated")

@blueprint.route('/updateLevel/<userID>', methods=['POST'])
def updateUserLevel(userID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
    
    if accessGranted == False:
        return accessGranted

    adminUser = adminReturn(auth_header, userID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")
    
    
    targetUser = Select(User).where(User.userID = userID)
    desired_level = request.values.get('adminLevel')
    
    if userID == adminUser['userID']:
        return on_error(1, "Cannot modify your own permissions")

    if desired_level > adminUser['adminLevel']:
        return on_error(2, "Cannot give a user greater permissions than you have")

    Update(User).where(User.userID = userID).values(adminLevel=desired_level)
    return on_success("User level has been changed")

@blueprint.route('/resetUserPassword/<userID>', methods=['POST'])
def resetUserPassword(userID):
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')

    if accessGranted == False:
        return accessGranted

    adminUser = adminReturn(auth_header, userID)
    if len(adminUser) == 3:
        return on_error(402, "User does not have access to make changes")

    targetUser = Select(User).where(User.userID = userID)
    if type(user).__name__ == "user":
        input = request.values
        inputPass = input.get('password')

        if inputPass == "" or inputPass is None:
            return on_error(20, "Password is required, please enter a password")
        
        targetUser.changePassword(inputPass)
        return on_success("Password changed")
    else:
        return on_error(62, "Account is not valid")    

def adminReturn(auth_header, targetUser=0):
    user = bearer_decode(auth_header)
    user = user['Values']

    if targetUser == 0:
        level_required = adminLevelRequired(targetUser)
        if user['adminLevel'] < level_required:
            return on_error(401, "You do not have access to the function")

    return user

def adminLevelRequired(userID):
    return level_required = Select(adminLevel).where(User.userID = userID).first()
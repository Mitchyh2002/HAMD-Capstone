import datetime

import bcrypt
from Program.ResponseHandler import on_error, on_success, bearer_decode, userFunctionAuthorisations
from flask import Blueprint, render_template, request, session, redirect, url_for

from Program.DB.Builder import db
from Program.DB.Models.mst.User import User
from Program.DB.Models.mst.Karma import Karma, create_karma
from Program.DB.Models.mst.Module import Module
from Program.DB.Models.mst.User import PasswordHash

blueprint = Blueprint('karma', __name__, url_prefix="/mst/karma")

@blueprint.route('/getKarma', methods=['POST', 'GET'])
def get_user_karma():
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 1, 'mst')
    accessingUser = bearer_decode(user_bearer)
    if accessGranted != True:

        return accessGranted
    module_prefix = request.values.get('modulePrefix')
    user_id = request.values.get('userID')
    if user_id == None:
        return on_error(3, "Request is missing UserID key, please ensure you are sending a valid userID")
    try:
        if float(user_id) % 1 != 0.0:
            return on_error(7, "UserID must be a valid number")
        user_id = int(user_id)
    except:
        return on_error(7, "UserID must be a valid number")

    selectedUser = User.query.filter_by(userID=user_id).first()
    if selectedUser is None:
        return on_error(4, f"Selected User {user_id}, cannot be found, please try again")
    if accessingUser['Values']['adminLevel'] < 5:
        if selectedUser.userID != accessingUser['Values']['userID']:
            return on_error(6, "User Credentials <5 can only view their own Karma")

    if module_prefix is None:
        return on_success({
            "userID": int(user_id),
            "totalKarma": selectedUser.totalKarma
        })
    else:
        if len(module_prefix) != 3:
            return on_error(2, f"Module Prefix {module_prefix} is invalid, modulePrefix must be 3 charachters in length")
        selectedModule = Module.query.filter_by(prefix=module_prefix).first()
        if selectedModule is None:
            return on_error(5, f"Selected Module {module_prefix}, cannot be found, please try again")
        assignedKarma = Karma.query.filter_by(karmaRecipient=user_id, modulePrefix=module_prefix).all()
        totalKarma = 0
        if len(assignedKarma) != 0:
            totalKarma = sum([row.karmaGiven for row in assignedKarma])
        return on_success({
                "userID": int(user_id),
                "module": module_prefix,
                "totalKarma": totalKarma
            })

def is_number(number):
    try:
        number = int(number)
        return True
    except ValueError:
        return False

@blueprint.route('/giveKarma', methods=['POST'])
def assign_user_karma():
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = accessGranted = userFunctionAuthorisations(user_bearer, 1, 'mst')
    if accessGranted != True:
        return accessGranted
    userID = request.values.get('userID')
    if userID == None:
        return on_error(2, "Request is missing UserID key, please ensure you are sending a valid userID")
    try:
        if float(userID) % 1 != 0.0:
            return on_error(7, "UserID must be a valid number")
        user_id = int(userID)
    except:
        return on_error(7, "UserID must be a valid number")

    modulePrefix = request.values.get('modulePrefix')
    if modulePrefix == None:
        return on_error(2, "Request is missing modulePrefix key, please ensure you are sending a valid module prefix")
    selectedModule = Module.query.filter_by(prefix=modulePrefix).first()
    if selectedModule is None:
        return on_error(5, f"Selected Module {modulePrefix}, cannot be found, please try again")

    modulePass = request.values.get('modulePassword')
    if modulePass == None:
        return on_error(2, "Module Password is not Specified")

    storedHash = selectedModule.moduleKey
    storedHash = storedHash[2:-1]
    storedHash = storedHash.encode('utf-8')
    inputBytes = modulePass.encode('utf-8')
    if not bcrypt.checkpw(inputBytes, storedHash):
        return on_error(7, "Incorrect Module Password Required")

    selectedUser = User.query.filter_by(userID=userID).first()
    if selectedUser is None:
        return on_error(4, f"Selected User {userID}, cannot be found, please try again")

    karmaGiven = request.values.get('Amount')
    if karmaGiven is None:
        return on_error(2, "Request is missing Amount key, please ensure you are sending the karma Amount to be assigned")
    if not is_number(karmaGiven):
        return on_error(3, "Amount Must be a Valid Integer Value")
    reason = request.values.get('Reason')
    if reason is None:
        return on_error(2, "Request is missing reason key, please ensure you are a valid reason for karma assignment")
    if len(reason) > 200:
        return on_error(6, "Karma Reason Must be less than 200 characters long")

    newKarma = create_karma(userID, modulePrefix, karmaGiven, reason)
    newKarma.insert()

    #Assign to Total Karma
    selectedUser.totalKarma += int(karmaGiven)
    db.session.commit()

    return on_success(newKarma.toJSON())

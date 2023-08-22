import datetime

from Program.ResponseHandler import on_error, on_success
from flask import Blueprint, render_template, request, session, redirect, url_for

from Program.DB.Builder import db
from Program.DB.Models.mst.User import User
from Program.DB.Models.mst.Karma import Karma, create_karma
from Program.DB.Models.mst.Module import Module

blueprint = Blueprint('karma', __name__, url_prefix="/mst/karma")

def get_user_karma(user_id, module_prefix=None):
    if module_prefix is None:
        selectedUser = User.query.filter_by(userID=user_id).first()
        if selectedUser is None:
            return on_error(2, f"Selected User {user_id}, cannot be found, please try again")
        return on_success({
            "userID": user_id,
            "totalKarma": selectedUser.totalKarma
        })
    else:
        if len(module_prefix) != 3:
            return on_error(2, f"Module Prefix {module_prefix} is invalid, modulePrefix must not be longer than 3 "
                               f"charachters")
        selectedModule = Module.query.filter_by(prefix=module_prefix).first()
        if selectedModule is None:
            return on_error(2, f"Selected Module {module_prefix}, cannot be found, please try again")
        assignedKarma = Karma.query.filter_by(karmaRecipient=user_id, modulePrefix=module_prefix).all()
        totalKarma = 0
        if len(assignedKarma) != 0:
            totalKarma = sum([row.karmaGiven for row in assignedKarma])
        return on_success({
                "userID": user_id,
                "module": module_prefix,
                "totalKarma": totalKarma
            })

def is_number(number):
    try:
        number = int(number)
        return True
    except ValueError:
        return False
def assign_user_karma(request):
    modulePrefix = request.values.get('modulePrefix')
    selectedModule = Module.query.filter_by(prefix=modulePrefix).first()
    if selectedModule is None:
        return on_error(2, f"Selected Module {modulePrefix}, cannot be found, please try again")

    userID = request.values.get('userID')
    selectedUser = User.query.filter_by(userID=userID).first()
    if selectedUser is None:
        return on_error(2, f"Selected User {userID}, cannot be found, please try again")

    karmaGiven = request.values.get('Amount')
    if karmaGiven is None:
        return on_error(3, "Request is missing Amount key, please ensure you are sending the karma Amount to be assigned")
    if not is_number(karmaGiven):
        return on_error(3, "Amount Must be a Valid Integer Value")
    reason = request.values.get('Reason')
    if reason is None:
        return on_error(3, "Request is missing reason key, please ensure you are a valid reason for karma assignment")
    if len(reason) > 200:
        return on_error(3, "Karma Reason Must be less than 200 characters long")

    newKarma = create_karma(userID, modulePrefix, karmaGiven, reason)
    newKarma.insert()

    #Assign to Total Karma
    selectedUser.totalKarma += int(karmaGiven)
    db.session.commit()

    return on_success(newKarma.toJSON())

@blueprint.route('/', methods=['POST', 'GET'])
def karma_handler():
    userID = request.values.get('userID')
    if userID == None:
        return on_error(3, "Request is missing UserID key, please ensure you are sending a valid userID")
    modulePrefix = request.values.get('modulePrefix')
    if request.method == 'GET':
        modulePrefix = request.values.get('modulePrefix')
        return get_user_karma(userID, modulePrefix)
    elif request.method == 'POST':
        return assign_user_karma(request)


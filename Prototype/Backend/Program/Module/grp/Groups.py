from datetime import datetime
from flask import Blueprint, request
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import select

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.DB.Models.mst.Modules import Module
from Program.DB.Models.grp.userGroups import userGroup, create_userGroup
from Program.DB.Models.grp.Groups import Group, create_group
from Program.DB.Models.grp.moduleGroups import mouduleGroups, create_moduleGroup
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('grp_Group', __name__, url_prefix="/grp/group")

@blueprint.route('/getall', methods=['GET'])
def get_all_groups():
    return [group.toJSON() for group in Group.query.all()]


@blueprint.route('/', methods=['GET', 'POST'])
def base_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Group Information (see get_group function)
        IF Request is a POST Request - Create a New Group  (see create_group function)
        Any other requests will return a -1 errore.
    '''
    if request.method not in ['GET', 'POST']:
        return on_error(-1, "Incorrect Request Type, request should be POST")
    elif request.method == 'GET':
        groupID = request.values.get("groupID")
        return get_group(groupID)
    elif request.method == 'POST':
        return new_group(request.values)

def get_group(groupID):
    ''' Return Group Details for a given group.
     Inputs:
        groupID (integer) - GroupID reference in table

    Returns:
        JSON Representation of Specified Group

    Errors:
        2 - GroupID does match an existing group.
     '''
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")
    return (Group.query.filter_by(groupID=groupID).first()).toJSON()

def new_group(inputs):
    groupName = inputs.get("groupName")
    if groupName == "":
        return on_error(3, "Group Name Cannot Be Blank")
    if len(groupName) > 200:
        return on_error(4, "Group Name cannot be longer than 200 characters")

    users = inputs.get("users")
    modules = inputs.get("modules")

    group_generated = create_group(groupName)
    group_generated.insert()
    GroupID = group_generated.groupID
    if users != "":
        add_group_users(GroupID, users)
    if modules != "":
        add_group_modules(GroupID, modules)

    return on_success({"group":group_generated,
                       "users": users,
                       "modules": modules})


@blueprint.route('/modules', methods=['GET', 'POST'])
def modules_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Modules assigned to a given group (see get_group_modules function)
        IF Request is a POST Request - Add Module/Modules to a group  (Assign a Module to A group add_group_modules function)
        Any other requests will return a -1 errore.
    '''
    if request.method not in ['GET', 'POST']:
        return on_error(-1, "Incorrect Request Type, request should be POST")
    inputs = request.values
    if len(request.values) == 0:
        inputs = request.json
    if request.method == 'GET':
        groupID = inputs.get("groupID")
        return get_group_modules(groupID)
    elif request.method == 'POST':
        return add_group_modules(request)

def get_group_modules(groupID):
    ''' Returns all Modules Assigned to a given group
        Inputs:
            GroupID (int) - ID representating a group in the DB
        Returns:
            ModuleName & Prefix for all modules in the specified group.
    '''
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")
    modules = [module.module_prefix for module in mouduleGroups.query.filter_by(groupID=groupID).all()]
    return on_success([module.toJSON(True) for module in Module.query.filter(Module.prefix.in_(modules)).all()])

def add_group_modules(request):
    pass

@blueprint.route('users')
def user_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Users assigned to a given group (see get_group_users function)
        IF Request is a POST Request - Add Users to a group  (see add_group_users function)
        Any other requests will return a -1 errore.
    '''
    if request.method not in ['GET', 'POST']:
        return on_error(-1, "Incorrect Request Type, request should be POST")
    elif request.method == 'GET':
        groupID = request.values.get("groupID")
        return get_group_users(groupID)
    elif request.method == 'POST':
        return add_group_users(request)

def get_group_users(groupID):
    pass

def add_group_users(request):
    pass

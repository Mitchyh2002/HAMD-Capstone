from datetime import datetime
from flask import Blueprint, request
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import select

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.DB.Models.mst.Module import Module
from Program.DB.Models.grp.userGroups import userGroup, create_userGroup
from Program.DB.Models.grp.Groups import Group, create_group
from Program.DB.Models.grp.moduleGroups import moduleGroups, create_moduleGroup
from Program.ResponseHandler import on_error, on_success
from Program.OS import dir_tree, convert_to_imports, bearer_decode, userFunctionAuthorisations

blueprint = Blueprint('grp_Group', __name__, url_prefix="/grp/group")

@blueprint.route('/getall', methods=['GET'])
def get_all_groups():
    ''' Get All Groups in System'''
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
    if accessGranted != True:
        return accessGranted
    return on_success([group.toJSON() for group in Group.query.all()])



@blueprint.route('/', methods=['GET', 'POST', 'DELETE', 'PUT'])
def base_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Group Information (see get_group function)
        IF Request is a POST Request - Create a New Group  (see create_group function)
        Any other requests will return a -1 errore.
    '''
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
    if accessGranted != True:
        return accessGranted
    if request.method != "POST":
        groupID = request.values.get("groupID")
        if groupID == None:
            groupID = request.form.get('groupID')
            if groupID == None:
                return on_error(3, "GroupID Cannot Be Blank")
        try:
            if float(groupID) % 1 != 0.0:
                return on_error(5, "Group ID is not a valid Integer Value")
        except:
            return on_error(5, "Group ID is not a valid Integer Value")

    if request.method == 'GET':
        return get_group(groupID)
    elif request.method == 'POST':
        return new_group(request.values)
    elif request.method == 'DELETE':
        return remove_group(request.values)
    elif request.method == 'PUT':
        return update_group(request.values)

def update_group(values):
    groupID = request.values.get("groupID")
    if groupID == None:
        return on_error(3, "group ID value no Specified")
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")

    groupName = values.get("groupName")
    if groupName == None:
        groupName = selected_group.displayName
    else:
        if len(groupName) > 200:
            return on_error(4, "Group Name cannot be longer than 200 characters")
    securityLevel = values.get("securityLevel")

    if securityLevel == None:
        securityLevel = selected_group.securityLevel
    try:
        if float(securityLevel) % 1 != 0.0:
            return on_error(6, "Security level must be a number")
    except:
        return on_error(6, "Security level must be a number")
    selected_group.displayName = groupName
    selected_group.securityLevel = securityLevel
    db.session.commit()
    return on_success(selected_group.toJSON())



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
    return on_success((Group.query.filter_by(groupID=groupID).first()).toJSON())

def new_group(inputs):
    groupName = inputs.get("groupName")
    if groupName == "":
        return on_error(3, "Group Name Cannot Be Blank")
    if len(groupName) > 200:
        return on_error(4, "Group Name cannot be longer than 200 characters")

    users = inputs.get("users")
    modules = inputs.get("modules")
    securityLevel = inputs.get("securityLevel")
    try:
        if float(securityLevel) % 1 != 0.0:
            return on_error(5, "Security Level must be a valid Integer")
    except:
        return on_error(5, "Security Level must be a valid Integer")
    group_generated = create_group(groupName,securityLevel)
    group_generated.insert()
    GroupID = group_generated.groupID

    return on_success(group_generated.toJSON())

def remove_group(inputs):
    groupID = inputs.get("groupID")
    if groupID is None:
        on_error(3, "Group ID is Not Specified")
    selected_group = Group.query.filter_by(groupID=groupID)
    if selected_group.first() is None:
        return on_error(2, "Specified Group Does Not Exist")
    selected_group.delete()
    db.session.commit()
    return on_success([])

@blueprint.route('/modules', methods=['GET', 'POST', 'DELETE'])
def modules_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Modules assigned to a given group (see get_group_modules function)
        IF Request is a POST Request - Add Module/Modules to a group  (Assign a Module to A group add_group_modules function)
        Any other requests will return a -1 error.
    '''
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
    if accessGranted != True:
        return accessGranted
    inputs = request.values
    groupID = inputs.get("groupID")
    if groupID == None:
        groupID = request.form.get('groupID')
        if groupID == None:
            return on_error(3, "GroupID Cannot Be Blank")
    try:
        if float(groupID) % 1 != 0.0:
            return on_error(6, 'groupID must be a valid number value')
    except:
        return on_error(6, 'groupID must be a valid number value')
    if request.method == 'GET':
        return get_group_modules(groupID)
    elif request.method == 'POST':
        module_prefix = inputs.get("modulePrefix")
        if module_prefix == None:
            return on_error(3, "module_prefix Cannot Be Blank")
        elif len(module_prefix) != 3:
            return on_error(3, "module_prefix must be 3 charachters long")
        return add_group_modules(groupID, module_prefix)
    elif request.method == 'DELETE':
        module_prefix = inputs.get("modulePrefix")
        if module_prefix == None:
            return on_error(3, "module_prefix Cannot Be Blank")
        elif len(module_prefix) != 3:
            return on_error(4, "module_prefix must be 3 charachters long")
        return remove_group_modules(groupID, module_prefix)

def get_group_modules(groupID):
    ''' Returns all Modules Assigned to a given group
            GroupID (int) - ID representating a group in the DB
        Returns:
            ModuleName & Prefix for all modules in the specified group.
    '''
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")

    modules = [module.module_prefix for module in moduleGroups.query.filter_by(groupID=groupID).all()]
    return on_success([module.toJSON(True) for module in Module.query.filter(Module.prefix.in_(modules)).all()])

def add_group_modules(groupID, module_prefix):
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")
    selected_module = Module.query.filter_by(prefix=module_prefix).first()
    # If Conn Exists Remove it
    moduleGroups.query.filter_by(groupID=groupID,module_prefix=module_prefix).delete()
    if selected_module is None:
        return on_error(2, "Specified Module Does Not Exist")

    new_moduleGroup = create_moduleGroup(groupID, module_prefix)
    new_moduleGroup.insert()

    db.session.commit()
    return on_success(new_moduleGroup.toJSON())

def remove_group_modules(groupID, module_prefix):
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")
    selected_module = Module.query.filter_by(prefix=module_prefix).first()
    if selected_module is None:
        return on_error(2, "Specified Module Does Not Exist")
    # If Conn Exists Remove it
    moduleGroups.query.filter_by(groupID=groupID,module_prefix=module_prefix).delete()
    db.session.commit()
    return on_success([])

@blueprint.route('users', methods=['GET', 'POST', 'DELETE'])
def user_route_handler():
    ''' Function to Route Requests for Group Information:
        IF Request is a GET Request - Get Users assigned to a given group (see get_group_users function)
        IF Request is a POST Request - Add Users to a group  (see add_group_users function)
        Any other requests will return a -1 errore.
    '''
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 5, 'mst')
    if accessGranted != True:
        return accessGranted
    inputs = request.values
    groupID = inputs.get("groupID")
    if groupID == None:
        groupID = request.form.get("groupID")
        if groupID is None:
            return on_error(3, "GroupID Cannot Be Blank")
    try:
        if float(groupID) % 1 != 0.0:
            return on_error(6, "groupID is not a valid number")
    except:
        return on_error(6, "groupID is not a valid number")
    userID = 0
    if request.method != 'GET':
        userID = inputs.get("userID")
        if userID == None:
            return on_error(3, "UserID cannot Be Blank")
        try:
            if float(userID) % 1 != 0.0:
                return on_error(7, "UserID is not a valid number")
        except:
            return on_error(7, "UserID is not a valid number")
    if request.method == 'GET':
        return get_group_users(groupID)
    elif request.method == 'POST':
        userID = inputs.get("userID")
        return add_group_users(groupID, userID)
    elif request.method == 'DELETE':
        return remove_group_users(groupID, userID)

def get_group_users(groupID):
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")
    users = userGroup.query.filter_by(groupID=groupID).all()
    return on_success([user.toJSON() for user in users])

def add_group_users(groupID, userID):
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")

    selected_user = User.query.filter_by(userID=userID).first()
    if selected_user is None:
        return on_error(2, "Specified User Does Not Exist")
    #If Conn Exists Remove it
    userGroup.query.filter_by(groupID=groupID, userID=userID).delete()
    new_userGroup = create_userGroup(groupID, userID)
    new_userGroup.insert()
    return on_success(new_userGroup.toJSON())

def remove_group_users(groupID, userID):
    selected_group = Group.query.filter_by(groupID=groupID).first()
    if selected_group is None:
        return on_error(2, "Specified Group Does Not Exist")

    selected_user = User.query.filter_by(userID=userID).first()
    if selected_user is None:
        return on_error(2, "Specified User Does Not Exist")
    #If Conn Exists Remove it
    userGroup.query.filter_by(groupID=groupID, userID=userID).delete()
    db.session.commit()

    return on_success([])
import os
from Program import export_key

from Program.ResponseHandler import on_error, on_success
from Program.DB.Models.mst.User import User
from Program.DB.Models.grp.Groups import Group
from Program.DB.Models.grp.moduleGroups import moduleGroups
from Program.DB.Models.mst.ModuleSecurity import ModuleSecurity, JSONtomoduleAccess
from Program.DB.Models.grp.userGroups import userGroup
from Program.DB.Models.mst.Module import Module, create_module

import jwt

def dir_tree(start_path, tableUpdate=False):
    """
    Re-Usable Function to get the localpaths of all files from a given starting directory.

    Parameters:
        start_path (str): String containing the starting directory to scan all files. This also is the local path.

    Returns:
        dirtree (list): List containing string variables containing the filepath for all files in start_folder.
        empty list: If Start Path Does Not Exist return empty list
    """
    if os.path.exists(start_path):
        dirtree = []
        root, dirs, files = next(os.walk(start_path))
        for dir in dirs:
            to_append = dir_tree(rf"{start_path}\{dir}")
            if to_append != []:
                dirtree = dirtree + to_append
        for file in files:
            dirtree.append(rf"{start_path}\{file}")
        return dirtree
    return []


def convert_to_imports(dir_tree):
    """
    Converts a list of filepaths into valid python import directories

    Parameters:
        Parameters:
        start_path (str): list containing filepaths to be converted. if file isn't a .py file it will be ignored.
    Returns:
        imports (list): List containing string variables containing a valid import package.

    """
    imports = []
    for file in dir_tree:
        filename, extension = os.path.splitext(file)
        filename = str(filename)
        if extension == ".py":
            filename = (filename.replace("\\", "."))
            imports.append(filename.replace("/", "."))
    return imports

def userFunctionAuthorisations(Auth_Header, adminLvl, modulePrefix):
    if Auth_Header == None:
        return on_error(400, "Auth Header Not Provided")
    user = bearer_decode(Auth_Header)
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
    if user['adminLevel'] < adminLvl:
        return on_error(401, "You do not have access to the function")
    return True


def bearer_decode(Auth_Header, algorithms=["HS256"]):
    if Auth_Header in ['null','',None]:
        return on_error(400, "Token Not Sent")
    if 'Bearer ' in Auth_Header:
        Auth_Header = Auth_Header.split('Bearer ')[1]



    try:
        decoded_data = jwt.decode(jwt=Auth_Header,
                                  key=export_key(),
                                  algorithms=algorithms)
    except jwt.ExpiredSignatureError:
        return on_error(403, "Invalid Token, This Token Has Expired")
    user = User.query.filter_by(email=decoded_data.get('email')).first()
    return on_success(user.toJSON())

if __name__ == "__main__":
    ff = convert_to_imports(dir_tree(
        rf"{os.getcwd()}\\test"))
    pass

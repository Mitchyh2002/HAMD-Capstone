import os
from Program import export_key

from Program.ResponseHandler import on_error, on_success
from Program.DB.Models.mst.User import User
from Program.DB.Models.grp.Groups import Group
from Program.DB.Models.grp.moduleGroups import moduleGroups
from Program.DB.Models.mst.moduleAccess import moduleAccess
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


if __name__ == "__main__":
    ff = convert_to_imports(dir_tree(
        rf"{os.getcwd()}\\test"))
    pass

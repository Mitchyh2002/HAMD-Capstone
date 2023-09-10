import os.path
import subprocess
from sqlalchemy import create_engine
import sqlalchemy.exc
import re
from flask import Blueprint, render_template, request, session, redirect, url_for
from Program.ResponseHandler import on_error, on_success

from Program.DB.Models.mst.Setup import mst_Setup, JSONtoConfig
from Program.DB.Models.grp.userGroups import userGroup
from Program.DB.Models.grp.Groups import Group
from Program.DB.Models.grp.moduleGroups import moduleGroups

from Program import reload, db
from Program.OS import dir_tree, convert_to_imports, bearer_decode, userFunctionAuthorisations

blueprint = Blueprint('setup', __name__, url_prefix="/mst/config")

TESTING = True

@blueprint.route('/')
def setup_handler():
    if request.method == 'GET':
        return get_config_settings()
    elif request.method == 'POST':
        return update_config_settings()
    else:
        return on_error(405, "Invalid Method Request")
def get_config_settings():
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')
    if user_bearer is None:
        user_bearer = request.values.get('HTTP_AUTHORIZATION')
    accessGranted = userFunctionAuthorisations(user_bearer, 7, 'mst')
    if accessGranted != True:
        return accessGranted
    config_info = mst_Setup.query.first()
    if config_info == None:
        return on_success(None)
    else:
        return on_success(config_info.toJSON())

def check_db_url(db_conn_string):
    """
    Function to confirm that the DB is able to be setup

    Returns None

    Error Codes:
        1 - Invalid SQL Alchemy String
        2 - Unable to Connect to DB
    """
    try:
        engine = create_engine(db_conn_string)
        engine.connect()
    except sqlalchemy.exc.ArgumentError:
        return on_error(1, f"Unable to Parse SQL Alchemy String from {db_conn_string}, please try Again")

    except sqlalchemy.exc.OperationalError:
        return on_error(2, f"Unable to Connect to Database from URL {db_conn_string}, please try Again")

def update_db(db_conn_string):
    """
    Update the DB file to insert new connection URL

    Returns None

    Error Codes:
        1 - Invalid SQL Alchemy String
        2 - Unable to Connect to DB
    """
    with open("Program/DB/Builder.py", "r") as db_file_read:
        content = db_file_read.readlines()
        for i, line in enumerate(content):
            if 'url = ' in line:
                content.pop(i)
                content.insert(i, f"url = '{db_conn_string}'\n")

    with open("Program/DB/Builder.py", "w") as db_file_write:
        db_file_write.writelines(content)

def check_hex_code(hex_code):
    if hex_code is None:
        return on_error(1, "Hex Code not Specified")
    if len(hex_code) != 7:
        return on_error(1, "Invalid Hex Code Specified")
    if hex_code[0] != "#":
        return on_error(1, "Invalid Hex Code Specified")

    try:
        code1 = hex_code[1:3]
        code2 = hex_code[3:5]
        code3 = hex_code[5:7]

        code1 = int(code1, 16)
        code2 = int(code2, 16)
        code3 = int(code3, 16)
    except ValueError:
        return on_error(1, "Invalid Hex Code Specified")

    if code1 > 255:
        return on_error(2, "Hex Value Cannot be greater than 255")
    if code2 > 255:
        return on_error(2, "Hex Value Cannot be greater than 255")
    if code3 > 255:
        return on_error(2, "Hex Value Cannot be greater than 255")

    return f"rgba({code1}, {code2}, {code3});"



def update_config_settings(request):
    configs = request.method.values
    configs = {}

    db_url = configs["DatabaseURL"]
    if db_url != '':
        update_db = check_db_url(db_url)
        if update_db is not None:
            return update_db
    configs["DatabaseURL"] = db_url
    registration_email = configs["RegistrationEmail"]
    configs.pop("DatabaseURL")
    configs.pop("RegistrationEmail")

    colours = ["font1", "font2", "black", "white", "header", "navbar", "subnav"]
    font1 = request.values.get("font1")
    font2 = request.values.get("font2")
    mst_dir = os.getcwd()
    os.chdir("../../../")
    current_settings = mst_Setup.query.first()
    with open('Front-End-Current/src/App.css', "r") as Styling:
        content = Styling.readlines()
        for colour in colours:
            selected_colour = request.values.get(colour)
            if selected_colour == None:
                if current_settings == None:
                    return on_error(2, f"Missing Setting for {colour}")
                continue
            rgb_colour = check_hex_code(colour)
            if 'rgb' not in rgb_colour:
                return rgb_colour
            pattern = f'--{colour}: rgba[\(0-9, ]+\);'
            replace_str = f'--{colour}: {rgb_colour}'
            re.sub(pattern, replace_str, content)
            configs[colour] = selected_colour
        if font1 is not None:
            pattern = f'--font1: rgba[\(0-9, ]+\);'
            replace_str = f"--font1: {font1}, serif;"
            re.sub(pattern, replace_str, content)
            configs["font1"] = font1
        if font2 is not None:
            pattern = f'--font2: rgba[\(0-9, ]+\);'
            replace_str = f"--font2: {font2}, sans-serif;"
            re.sub(pattern, replace_str, content)
            configs["font2"] = font1

    with open('Front-End-Current/src/App.css', "w") as Styling:
        Styling.write(content)
    if current_settings == None:
        config = JSONtoConfig(configs)
        if config != None:
            return config
        update_db(db_url)
        config.insert()
    else:
        update_db(db_url)
        success = current_settings.merge(configs)
        if not success:
            return success

    new_settings = mst_Setup.query.first()
    return on_success(new_settings.toJSON())

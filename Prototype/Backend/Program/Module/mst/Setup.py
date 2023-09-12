import os.path
import subprocess
from os.path import splitext

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


def check_image(file, fileName,  settings_exist=True):
    if file is None:
        if settings_exist:
            return True
        else:
            return on_error(1, "Image not Specified for inital startup")
    if splitext(file.filename)[1] != 'png':
        return on_error(2, 'Image Uploaded must be a png file')

    if file.filename != fileName:
        return on_error(3, f"File {file.filename} must be named FileName")
    return True


def update_config_settings(request):
    configs = request.values
    current_settings = mst_Setup.query.first()

    final_configs = {}
    db_url = configs.get("DatabaseURL")
    if db_url != None:
        update_db = check_db_url(db_url)
        if update_db is not None:
            return update_db
    final_configs["DatabaseURL"] = db_url
    registration_email = configs.get("RegistrationEmail")
    welcomeText = request.values.get("welcomeTest")

    colours = ["black", "white", "header", "navbar", "subnav"]
    font1 = request.values.get("font1")
    font2 = request.values.get("font2")
    mst_dir = os.getcwd()
    os.chdir("../")

    with open(os.getcwd() + '/Front-End-Current/src/App.css', "r") as Styling:
        content = Styling.read()
        for colour in colours:
            selected_colour = request.values.get(colour)
            if selected_colour is None:
                if current_settings is None:
                    os.chdir(mst_dir)
                    return on_error(2, f"Missing Setting for {colour}")
                continue
            rgb_colour = check_hex_code(selected_colour)
            if 'rgb' not in rgb_colour:
                os.chdir(mst_dir)
                return rgb_colour

            if colour == 'subnav':
                pattern = f'--subnav40: rgba[\(0-9, .]+\);'
                replace_str = f'--subnav40: {rgb_colour[:-2]}, 0.4);'
                content = re.sub(pattern, replace_str, content)
            if colour == 'navbar':
                pattern = f'--navbar70: rgba[\(0-9, .]+\);'
                replace_str = f'--navbar70: {rgb_colour[:-2]}, 0.7);'
                content = re.sub(pattern, replace_str, content)
                pattern = f'--navbar50: rgba[\(0-9, .]+\);'
                replace_str = f'--navbar50: {rgb_colour[:-2]}, 0.5);'
                content = re.sub(pattern, replace_str, content)
            if colour == 'header':
                pattern = f'--header70: rgba\([0-9, .]+\);'
                replace_str = f'--header70: {rgb_colour[:-2]}, 0.7);'
                content = re.sub(pattern, replace_str, content)

            pattern = f'--{colour}: rgba[\(0-9, ]+\);'
            replace_str = f'--{colour}: {rgb_colour}'
            content = re.sub(pattern, replace_str, content)
            final_configs[colour] = selected_colour


        if font1 is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for font1")
        else:
            pattern = f'--font1: \'[A-Za-z0-9]+\', [a-zA-Z0-9\-\_]+;'
            replace_str = f"--font1: {font1}, serif;"
            content = re.sub(pattern, replace_str, content)
            final_configs["font1"] = font1
        if font2 is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for font2")
        else:
            pattern = f'--font2: \'[A-Za-z0-9]+\', [a-zA-Z0-9\-\_]+;'
            replace_str = f"--font2: {font2}, sans-serif;"
            content = re.sub(pattern, replace_str, content)
            final_configs["font2"] = font1

        if welcomeText is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for font1")
        else:
            pattern = '--welcomeText: ".+";'
            replace_str = f'--welcomeText: "{welcomeText};'
            content = re.sub(pattern, replace_str, content)
            final_configs["welcomeText"] = font1

        logo = request.files.get("logo")
        loginImage = request.files.get("loginImage")
        bee = request.files.get("loginImage")

        if logo is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Logo Image")
            else:
                logo_success = check_image(logo)
                if not logo_success: return logo_success

        if loginImage is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Login Image")
        else:
            loginImage_success = check_image(loginImage)
            if not loginImage_success: return loginImage_success

        if bee is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Miscellaneous Image")
        else:
            bee_success = check_image(bee)
            if not bee_success: return bee_success



    with open('Front-End-Current/src/App.css', "w") as Styling:
        Styling.write(content)
    if current_settings == None:
        final_configs = JSONtoConfig(final_configs)
        if db_url is not None:
            success = update_db(db_url)
            if success is not None:
                return success

        final_configs.insert()
    else:
        if db_url is not None:
            success = update_db(db_url)
            if success is not None:
                return success
        success = current_settings.mergeConfig(final_configs)
        if not success:
            return success

    new_settings = mst_Setup.query.first()
    os.chdir(mst_dir)
    return on_success(new_settings.toJSON())


@blueprint.route('/', methods=["GET", "POST"])
def setup_handler():
    if request.method == 'GET':
        return get_config_settings()
    elif request.method == 'POST':
        return update_config_settings(request)
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

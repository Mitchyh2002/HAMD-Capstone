import os.path
import subprocess
from os.path import splitext

from sqlalchemy import create_engine
import sqlalchemy.exc
import re
from flask import Blueprint, render_template, request, session, redirect, url_for
from Program.ResponseHandler import on_error, on_success, bearer_decode, userFunctionAuthorisations


from Program import reload, db
from Program.DB.Models.mst.Setup import mst_Setup, JSONtoConfig
from Program.DB.Models.mst.Setup import mst_Setup, JSONtoConfig
from Program.OS import dir_tree, convert_to_imports

blueprint = Blueprint('setup', __name__, url_prefix="/mst/config")

TESTING = True


def check_hex_code(hex_code):
    if hex_code is None:
        return on_error(3, "Hex Code not Specified")
    if len(hex_code) != 7:
        return on_error(4, "Invalid Hex Code Specified")
    if hex_code[0] != "#":
        return on_error(4, "Invalid Hex Code Specified")

    try:
        code1 = hex_code[1:3]
        code2 = hex_code[3:5]
        code3 = hex_code[5:7]

        code1 = int(code1, 16)
        code2 = int(code2, 16)
        code3 = int(code3, 16)
    except ValueError:
        return on_error(4, "Invalid Hex Code Specified")

    if code1 > 255:
        return on_error(4, "Hex Value Cannot be greater than 255")
    if code2 > 255:
        return on_error(4, "Hex Value Cannot be greater than 255")
    if code3 > 255:
        return on_error(4, "Hex Value Cannot be greater than 255")

    return f"rgba({code1}, {code2}, {code3});"


def check_image(file, fileType, settings_exist=True):
    if file is None:
        if settings_exist:
            return True
        else:
            return on_error(1, "Image not Specified for inital startup")
    if splitext(file.filename)[1] != fileType:
        return on_error(5, f'Image Uploaded must be a {fileType} file')

    return True


def update_config_settings(request):
    configs = request.values
    current_settings = mst_Setup.query.first()

    final_configs = {}
    db_url = configs.get("databaseURL")
    if db_url in ['', None]:
        db_url = configs.get("DatabaseURL")

    if db_url not in [None, '']:
        db_valid = check_db_url(db_url)
        if db_valid is not None:
            return db_valid
    if db_url in [None, ''] and configs == None:
        return on_error(2, f"Missing Setting for databaseURL")
    final_configs["DatabaseURL"] = db_url
    registration_email = configs.get("RegistrationEmail")
    welcomeText = request.values.get("welcomeText")

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
            pattern = f'--font1: [A-Za-z0-9]+, [a-zA-Z0-9\-\_]+;'
            replace_str = f"--font1: {font1}, serif;"
            content = re.sub(pattern, replace_str, content)
            final_configs["font1"] = font1
        if font2 is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for font2")
        else:
            pattern = f'--font2: [A-Za-z0-9]+, [a-zA-Z0-9\-\_]+;'
            replace_str = f"--font2: {font2}, sans-serif;"
            content = re.sub(pattern, replace_str, content)
            final_configs["font2"] = font2

        if welcomeText is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for welcomeText")
        else:
            if len(welcomeText) > 200:
                return on_error(8, "welcomeText Cannot be more than 200 characters.")
            pattern = '--welcomeText: ".+";'
            replace_str = f'--welcomeText: "{welcomeText}";'
            content = re.sub(pattern, replace_str, content)
            final_configs["welcomeText"] = welcomeText
        websiteName = request.values.get('websiteName')
        if websiteName is None:
            if current_settings is None:
                os.chdir(mst_dir)
                return on_error(2, f"Missing Setting for websiteName")
        else:
            if len(websiteName) > 200:
                return on_error(8, "Website Name Cannot be more than 200 characters.")
            pattern = '--mainTitle: ".+";'
            replace_str = f'--mainTitle: "{websiteName}";'
            content = re.sub(pattern, replace_str, content)
            final_configs["websiteName"] = websiteName

        terms = request.files.get("terms")
        if terms is None:
            if current_settings is None:
                final_configs['terms'] = ''
        elif terms.filename == '':
            if current_settings is None:
                final_configs['terms'] = ''
        else:
            if check_image(terms, '.txt') != True:
                os.chdir(mst_dir)
                return check_image(terms, '.txt')
            terms_dir = 'Front-End-Current/public/terms.txt'
            final_configs['terms'] = terms_dir
            terms.save(terms_dir)


        logo = request.files.get("logoImage")
        loginImage = request.files.get("loginImage")
        bee = request.files.get("landingImage")

        final_configs["logoImage"] = ''
        final_configs["loginImage"] = ''
        final_configs["landingImage"] = ''

        if logo is None:
            if current_settings is None:
                final_configs["logo"] = ''
        elif logo.filename == '':
            if current_settings is None:
                final_configs["logo"] = ''
        else:
            logo_success = check_image(logo,'.png')
            if logo_success != True:
                os.chdir(mst_dir)
                return logo_success
            logo_dir = f'/Front-End-Current/public/logo.png'
            logo_dir2 = f'../public/logo.png'
            pattern = '--logo: url\("\/public\/.*"\);'
            replace_str = f'--logo: url("{logo_dir2}");'
            content = re.sub(pattern, replace_str, content)
            logo.save(os.getcwd() + logo_dir)
            final_configs["logoImage"] = logo_dir

        if loginImage is None:
            if current_settings is None:
                final_configs["loginImage"] = ''
        elif loginImage.filename == '':
             if current_settings is None:
                 final_configs["loginImage"] = ''
        else:
            loginImage_success = check_image(loginImage,'.jpg')
            if loginImage_success != True:
                os.chdir(mst_dir)
                return loginImage_success
            login_dir = f'/Front-End-Current/public/login-image.jpg'
            login_dir2 = f'../public/login-image.jpg'
            pattern = '--loginImage: url\("..\/public\/.*"\);'
            replace_str = f'--loginImage: url("{login_dir2}");'
            content = re.sub(pattern, replace_str, content)
            loginImage.save(os.getcwd() + login_dir)
            final_configs["loginImage"] = login_dir

        if bee is None:
            if current_settings is None:
                final_configs["landingImage"] = ''
        elif bee.filename == '':
            if current_settings is None:
                final_configs["landingImage"] = ''
        else:
            bee_success = check_image(bee, '.jpg')
            if bee_success != True:
                os.chdir(mst_dir)
                return bee_success
            bee_dir2 = f'../public/landing-image.jpg'
            bee_dir = f'/Front-End-Current/public/landing-image.jpg'
            pattern = '--landingImage: url\("..\/public\/.*"\);'
            replace_str = f'--landingImage: url("{bee_dir2}");'
            content = re.sub(pattern, replace_str, content)
            bee.save(os.getcwd() + bee_dir)
            final_configs["landingImage"] = bee_dir

    with open('Front-End-Current/src/App.css', "w") as Styling:
        Styling.write(content)

    if current_settings == None:
        final_OBJ = JSONtoConfig(final_configs)
        if db_url is not None:
            os.chdir(mst_dir)
            success = update_db(db_url)
            if success is not None:
                return success

            final_OBJ.insert()
            return on_success(final_OBJ.toJSON())
    else:
        if db_url is not None:
            os.chdir(mst_dir)
            success = update_db(db_url)
            if success is not None:
                return success
        success = current_settings.mergeConfig(final_configs)
        if not success:
            os.chdir(mst_dir)
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
    accessGranted = userFunctionAuthorisations(user_bearer, 9, 'mst')
    if accessGranted != True:
        return accessGranted
    config_info = mst_Setup.query.first()
    if config_info == None:
        return on_success( {
            "DatabaseURL": '',
            "font1": '',
            "font2": '',
            "black": '',
            "white": '',
            "header": '',
            "navbar": '',
            "subnav": '',
            "welcomeText": '',
            "terms": '',
            "logo": '',
            "landingImage": '',
            "loginImage": '',
            'websiteName': ''
        })
    else:
        print(config_info.toJSON())
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
                break

    with open("Program/DB/Builder.py", "w") as db_file_write:
        db_file_write.writelines(content)

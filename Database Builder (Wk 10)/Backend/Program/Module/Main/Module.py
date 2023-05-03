import os.path
from flask import Blueprint, render_template, request, session, redirect, url_for
import time
import zipfile
import shutil
import ast
from Program.ResponseHandler import on_error, on_success
from os.path import splitext
from os import mkdir
from re import search

from Program.DB.Models.master.Modules import Module, create_module

from Program import reload, db
from Program.OS import dir_tree, convert_to_imports

#from Program.DB.Models.master.Modules import Module, create_module
from sqlalchemy.orm import Session

blueprint = Blueprint('main', __name__, url_prefix="/module")

TESTING = True

def scan_file(in_file):
    '''
    Function To Scan a python file for correct syntax & imports.

    Parameters:
        in_file (File): Object containing a file connection to be read.

    Returns:
        None - If file passes all checks
        Error Packet - File doesn't pass a check

    '''

    modules = []
    if in_file == []:
        return 0
    lines = in_file.readlines()
    try:
        in_file.seek(0)
        ast.parse(in_file.read())
    except SyntaxError:
        return on_error(12, f"Syntax Error Found in {os.path.basename(in_file.name)}")

    regex_dict = {"from": "(?<=from ).+(?= import)",
                  "__import__": """(?<=__import__\(['"]).+(?=['"]\))""",
                  "import": "(?<=import ).+"}
    for line in lines:
        line = str(line)
        line = line.strip("b'")
        line = line.strip(r"\r\n")
        if 'from' in line:
            modules.append(search(regex_dict["from"], line)[0])
        elif "__import__" in line:
            modules.append(search(regex_dict["__import__"], line)[0])
            pass
        elif "import" in line:
            modules.append(search(regex_dict["import"], line)[0])
        elif "os." in line:
            return on_error(11, "Restricted Module found in application")
        elif "subproccess." in line:
            return on_error(11, "Restricted Module found in application")

    in_file.seek(0)
    with open(r'Program\templates\whitelisted_modules.txt') as whitelist:
        lines = whitelist.read()
        for module in modules:
            module = module.split(".")[0]
            res = search(f"{module}(?=\n)|{module}.+(?=\n)", lines)

            if res is None:
                return on_error(11, "Restricted Module found in application")
        return 0



def QueryInsertModule(new_module: Module):
    #If Module Exists Drop it
    existing_modules = Module.query.filter_by(prefix=new_module.prefix).delete()
    from Program import db

    db.session.add(new_module)
    db.session.commit()

@blueprint.route('/getactive')
def get_plugins():
    '''
    Get Request that returns all active modules.

    Paramaters:
        None

    Returns:
        Success JSON, containing the Module Prefix & Display Name of all active modules.
    '''
    if request.method == "GET":
        valid_modules = []
        for module in Module.query.filter(Module.status == True).all():
            valid_modules.append(module.toJSON(True))
        return on_success(valid_modules)
    return on_error(-1, "Incorrect RequestType Please make a POST REQUEST")


@blueprint.route('/')
def Hello_World():
    return """<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>File Upload Example</title>
  </head>
  <body>
    <h1>File Upload Example</h1>
    <form action="/module/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" id="file">
      <br><br>
      <input type="submit" value="Upload File" name="submit">
    </form>
  </body>
</html> """

@blueprint.route('/upload', methods=['GET', 'POST'])
def upload_module():
    '''
    API Endpoint to process a Module in a compressed zip file.

    This will add the tables to the DB & New endpoints to the application.
    '''
    if request.method == 'POST':
        dl_file = request.files['fileToUpload']
        modulename = dl_file.filename.strip(".zip")
        if TESTING:
            try:
                shutil.rmtree(f"Program/Module/{modulename}")
            except:
                x = 0
            try:
                shutil.rmtree(f"Program/DB/Models/{modulename}")
            except:
                x = 0
        if splitext(dl_file.filename)[1] != ".zip":
            return 'File is not a zip file'
        with zipfile.ZipFile(dl_file, 'r') as zip_ref:
            zip_ref.extractall("Program\Temp_Module")
        temp_dir = "Program\Temp_Module\\"

        API_Files = dir_tree(rf"{temp_dir}{modulename}\Backend")
        TableFiles = dir_tree(rf"{temp_dir}{modulename}\Tables")

        API_outdir = rf"Program\Module\{modulename}"
        Table_outdir = rf"Program\DB\Models\{modulename}"
        if os.path.exists(API_outdir) or os.path.exists(Table_outdir):
            shutil.rmtree(temp_dir)
            return on_error(1, "Module Already Exists")

        for file in API_Files:
            with open(file) as api_file:
                scan_result = scan_file(api_file)
                if scan_result: #If Scan returns an Error
                    api_file.close()
                    shutil.rmtree(temp_dir)
                    return scan_result

        for file in TableFiles:
            with open(file) as table_file:
                scan_result = scan_file(table_file)
                if scan_result: #If Scan returns an Error
                    api_file.close()
                    shutil.rmtree(temp_dir)
                    return scan_result

        # All Modules are Valid, now move to the correct directories.
        shutil.move(f"{temp_dir}{modulename}\Backend", API_outdir.strip(modulename))
        os.rename(f"{API_outdir.strip(modulename)}\Backend", f"{API_outdir.strip(modulename)}/df1")

        shutil.move(f"{temp_dir}{modulename}\Tables", Table_outdir)

        shutil.rmtree(temp_dir)

        # Upload Tables to Database
        tables = convert_to_imports(dir_tree(Table_outdir))

        from Program.DB.Builder import create_db
        create_db(tables)

        new_Module = create_module(str(modulename), "Discussion Forum", "Test123", True)
        QueryInsertModule(new_Module)

        # Reload Flask to initialise blueprints for backend
        reload()

        return new_Module.toJSON()
    return on_error(-1, "Incorrect Request Type, request should be POST")

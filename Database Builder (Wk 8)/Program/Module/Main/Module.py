import copy
import os.path
from flask import Blueprint, render_template, request, session, redirect, url_for
import time
import zipfile
import shutil

from os.path import splitext
from os import mkdir
from re import search

from Program import reload
from Program.OS import dir_tree, convert_to_imports

blueprint = Blueprint('main', __name__)


def scan_file(in_file):
    modules = []
    if in_file == []:
        return 0
    lines = in_file.readlines()
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
            return "Critical Module found in application"
        elif "subproccess." in line:
            return "Critical Module found in application"

    in_file.seek(0)
    with open(r'Program\templates\whitelisted_modules.txt') as whitelist:
        lines = whitelist.read()
        for module in modules:
            module = module.split(".")[0]
            res = search(f"{module}(?=\n)|{module}.+(?=\n)", lines)

            if res is None:
                return "Restricted Import added {module}, please contact system admin if you believe this is an error"
        return 0


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
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="fileToUpload" id="fileToUpload">
      <br><br>
      <input type="submit" value="Upload File" name="submit">
    </form>
  </body>
</html>
  """


@blueprint.route('/time')
def get_current_time():
    return {'time': time.time()}

@blueprint.route('/upload', methods=['GET', 'POST'])
def upload_module():
    '''
    API Endpoint to process a Module in a compressed zip file.

    This will add the tables to the DB & New endpoints to the application.
    '''

    if request.method == 'POST':
        dl_file = request.files['fileToUpload']
        modulename = dl_file.filename.strip(".zip")
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
            return "Module Already Exists"

        for file in API_Files:
            with open(file) as api_file:
                if scan_file(api_file):
                    return "<h1> Module unable to Upload<h1>"
        for file in TableFiles:
            with open(file) as table_file:
                if scan_file(table_file):
                    return "<h1> Table unable to Upload<h1>"

        # All Modules are Valid, now move to the correct directories.
        shutil.move(f"{temp_dir}{modulename}\Backend", API_outdir.strip(modulename))
        os.rename(f"{API_outdir.strip(modulename)}\Backend", f"{API_outdir.strip(modulename)}/df1")

        shutil.move(f"{temp_dir}{modulename}\Tables", Table_outdir)

        shutil.rmtree(temp_dir)

        # Upload Tables to Database
        tables = convert_to_imports(dir_tree(Table_outdir))
        from Program.DB import create_db
        create_db(tables)

        # Reload Flask to initialise blueprints for backend
        reload()

        return 'File uploaded successfully!'

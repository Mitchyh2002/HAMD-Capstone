import os.path
from flask import Blueprint, render_template, request, session, redirect, url_for
import time
import zipfile
import shutil
import re
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

def scan_file(in_file, modulename, TableScan= False):
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



def QueryInsertModule(new_module: Module, test=False):
    #If Module Exists Drop it
    existing_modules = Module.query.filter_by(prefix=new_module.prefix).delete()
    from Program import db

    db.session.add(new_module)
    db.session.commit()

@blueprint.route('/getactive')
def get_active_plugins():
    '''
    Get Request that returns all active modules.

    Parameters:
        None

    Returns:
        Success JSON, containing the Module Prefix & Display Name of all active modules.
        Error Packet, Request.Method is not GET, code -1
    '''
    if request.method == "GET":
        valid_modules = []
        for module in Module.query.filter(Module.status == True).all():
            valid_modules.append(module.toJSON(True))
        return on_success(valid_modules)
    return on_error(-1, "Incorrect RequestType Please make a POST REQUEST")

def get_all_plugins():
    '''
       Get Request that returns all modules

       Parameters:
           None

       Returns:
           A List containing all modules
       '''
    return [Module.toJSON() for Module in Module.query.all()]

@blueprint.route('/')
def Hello_World():
    return "<h1> Hello World </h1>"



def front_end_installation(temp_dir, module_name, master_dir):

    with open(f"{temp_dir}\Main.js") as MainJS:
        content = MainJS.read()
        pattern = r'\bexport\s+default\s+function\s+(\w+)\s*\('
        functionName = re.match(pattern, content).group(1)

    os.chdir("../")
    os.chdir("./Front-End-Current/src/")
    front_end_dir = os.getcwd()
    frontEnd_outdir = rf"{front_end_dir}\modules\{module_name}"

    with open(front_end_dir + r".\\moduledefs.js", "r") as file:
        content = file.read()
        imports = ""
        pattern = r"\/\/REGEX_START\n([\s\S]*?)\/\/REGEX_END"
        module_definitions = re.search(pattern, content).group(1)
        module_definitions = module_definitions.splitlines()
        i = 0
        for line in module_definitions:
            if line == '//IMPORT_END':
                import_pos = i
            if line == '}':
                last_pos = i
            i = i + 1
        module_definitions.insert(import_pos, f'import {functionName} from "./modules/{module_name}/main.js";')
        module_definitions[last_pos] = module_definitions[last_pos] + ","
        module_definitions.insert(last_pos + 1, f"    {module_name}: {functionName}") # LEAVE 4 SPACES FOR SYNTAX :3
        new_content = re.sub(pattern, '', content)
        new_content = new_content
        module_definitions.append("//REGEX_END")
        module_definitions.insert(0, "//REGEX_START")

    shutil.move(rf"{master_dir}\Program\Temp_Module\{module_name}\Front End", frontEnd_outdir)

    with open(front_end_dir + r".\\moduledefs.js", "w") as file:
        file.writelines(line + '\n' for line in (module_definitions + new_content.splitlines()))

    os.chdir(master_dir)
    return True

def back_end_installation(API_Files, temp_dir, modulename, backend_outdir):
    if os.path.exists(backend_outdir):
        shutil.rmtree(temp_dir)
        return on_error(1, "Module Already Exists")

    for file in API_Files:
        with open(file) as api_file:
            scan_result = scan_file(api_file, modulename)
            if scan_result:  # If Scan returns an Error
                api_file.close()
                shutil.rmtree(temp_dir)
                return scan_result
    return True


def table_installation(TableFiles, temp_dir, modulename, Table_outdir):
    if os.path.exists(Table_outdir):
        shutil.rmtree(temp_dir)
        return on_error(1, "Module Already Exists")

    for file in TableFiles:
        with open(file) as table_file:
            scan_result = scan_file(table_file, modulename, True)
            if scan_result:  # If Scan returns an Error
                table_file.close()
                shutil.rmtree(temp_dir)
                return scan_result
    return True


@blueprint.route('/upload', methods=['GET', 'POST'])
def upload_module():
    '''
    API Endpoint to process a Module in a compressed zip file.

    This will add the tables to the DB & New endpoints to the application.
    '''
    if request.method == 'POST':
        master_dir = os.getcwd()
        dl_file = request.files['fileToUpload']
        modulename = dl_file.filename.strip(".zip")
        if splitext(dl_file.filename)[1] != ".zip":
            return 'File is not a zip file'
        with zipfile.ZipFile(dl_file, 'r') as zip_ref:
            zip_ref.extractall("Program\Temp_Module")

        temp_dir = "Program\Temp_Module\\"

        API_Files = dir_tree(rf"{temp_dir}{modulename}\Backend")
        api_outdir = f"Program/Module/{modulename}"
        TableFiles = dir_tree(rf"{temp_dir}{modulename}\Tables")
        Table_outdir = rf"Program\DB\Models\{modulename}"
        FrontEndDir = rf"{temp_dir}{modulename}\Front End"

        if API_Files != []:
            back_end_success = back_end_installation(API_Files, temp_dir, modulename, api_outdir)
            if not back_end_success:
                return back_end_success

        if TableFiles != []:
            table_success = table_installation(TableFiles, temp_dir, modulename, Table_outdir)
            if not table_success:
                return table_success

        API_outdir = rf"Program\Module\{modulename}"

        front_end_success = front_end_installation(FrontEndDir, modulename, master_dir)

        # All Modules are Valid, now move to the correct directories, If they exist
        if API_Files != []:
            shutil.move(f"{temp_dir}{modulename}\Backend", API_outdir.strip(modulename))
            os.rename(f"{API_outdir.strip(modulename)}\Backend", f"{API_outdir.strip(modulename)}/{modulename}")

        if Table_outdir != []:
            shutil.move(f"{temp_dir}{modulename}\Tables", Table_outdir)

        if not front_end_success:
            shutil.rmtree(f"Program/Module/{modulename}")
            shutil.rmtree(f"Program/DB/Models/{modulename}")
            shutil.rmtree(temp_dir)
            return front_end_success

        # Upload Tables to Database
        tables = convert_to_imports(dir_tree(Table_outdir))
        from Program.DB.Builder import create_db

        create_db(tables)

        new_Module = create_module(str(modulename), "Discussion Forum", "Test123", True)
        QueryInsertModule(new_Module)
        os.chdir(master_dir)
        shutil.rmtree(f"Program/Temp_Module")
        # Reload Flask to initialise blueprints for backend
        reload()

        return on_success(new_Module.toJSON(True))
    return on_error(-1, "Incorrect Request Type, request should be POST")


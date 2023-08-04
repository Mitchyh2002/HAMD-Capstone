import os.path
import subprocess

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

def scan_file(in_file, modulename, TableScan= False, update=True):
    '''
    Function To Scan a python file for correct syntax & imports.

    Parameters:
        in_file (File): Object containing a file connection to be read.

    Returns:
        None - If file passes all checks
        Error Packet - File doesn't pass a check

    Error Codes:
        10 - TableName not declared with modulename prefix
        11 - Restriced Module Found in Python Files
        12 - Syntax Error Found in Python Files
        20 - Missing Datatables
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
    if TableScan:
        pattern = rf'(?<=__tablename__ = [\'"]).*(?=[\'"])'
        matches = re.findall(pattern, '\n'.join(lines))
        for match in matches:
            if f"{modulename}_" not in match:
                return on_error(10, "Tablename Doesnt doesn't start with modulename")
        if update:
            if os.path.exists(f"Program/DB/Models/{modulename}/{os.path.basename(in_file.name)}"):
                with open(f"Program/DB/Models/{modulename}/{os.path.basename(in_file.name)}") as ref_file:
                    alt_lines = ref_file.readlines()
                    for line in alt_lines:
                        if line in lines:
                            lines.remove(line)
                    if lines != []:
                        return on_error(20, "Table is missing content on Update, Please ensure datatables are not missing")

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

    """ Function to Improt Module into DB
        if Module exists delete itself if gotten this far into system
    """
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

@blueprint.route('get_all')
def get_all_plugins():
    '''
       Get Request that returns all modules

       Parameters:
           None

       Returns:
           A List containing all modules
       '''
    return [Module.toJSON(True) for Module in Module.query.all()]

@blueprint.route('/')
def Hello_World():
    return "<h1> Hello World </h1>"

def front_end_installation(temp_dir, module_name, master_dir, update=False):
    """ Main Function to Facilitate the installation of Front End Components
        1. Confirm Main.JS exists and pull export function name
        2. Write the amended Moduledefs.JS file with new imports
        3. If Logo File exists rename and push to main app
        4. Push front-end files to front-end & write the module-defs file

    Returns None

    On Error:
            Error 16 - When Updating Module, the Main.JS export function has changed, this must stay the same to protect other modules.
            Error 15 - Main.JS Does Not Exist
            Error 14 - Export Function Not Found in Main.JS
            Error 10 - Module Name is not appended to the front of export function
    """
    if os.path.exists(f"{temp_dir}\Main.js") == False:
        return on_error(15, "Front-End Missing Main.js file")

    with open(f"{temp_dir}\Main.js") as MainJS:
        content = MainJS.read()
        pattern = r'(?<=export default function ).*(?=\()'
        functionName = re.findall(pattern, content)[0]
        if functionName is None:
            return on_error(14, "Cannot Find Default Export Function Name in main.js file")
        if f"{module_name}_" not in functionName:
            return on_error(10, "Module Name not in main Front-End Function Name")

    os.chdir("../")

    os.chdir("./Front-End-Current/src/")
    front_end_dir = os.getcwd()
    frontEnd_outdir = rf"{front_end_dir}\modules\{module_name}"
    frontEnd_logodir = rf"{front_end_dir}\logos"

    # Write new Module Def Files
    with open(front_end_dir + r".\\moduledefs.js", "r") as file:
        content = file.read()
        imports = ""
        pattern = r"\/\/REGEX_START\n([\s\S]*?)\/\/REGEX_END"
        module_definitions = re.search(pattern, content).group(1)
        module_definitions = module_definitions.splitlines()
        i = 0
        for line in module_definitions:
            if update and module_name in line:
                pattern = "(?<=import ).*(?= from)"
                old_functionName = re.findall(pattern, line)[0]
                if functionName != old_functionName:
                    return on_error(16, f"Main.js Export default function name changed, please change back to {old_functionName}")
                else:
                    break
            if line == '//IMPORT_END':
                import_pos = i
            if line == '}':
                last_pos = i
            i = i + 1
        if not update:
            module_definitions.insert(import_pos, f'import {functionName} from "./modules/{module_name}/main.js";')
            module_definitions[last_pos] = module_definitions[last_pos] + ","
            module_definitions.insert(last_pos + 1, f"    {module_name}: {functionName}") # LEAVE 4 SPACES FOR SYNTAX :3
            new_content = re.sub(pattern, '', content)
            new_content = new_content
            module_definitions.append("//REGEX_END")
            module_definitions.insert(0, "//REGEX_START")
    if os.path.exists(f"{master_dir}/Program/Temp_Module/{module_name}/logo.svg"):
        if os.path.exists(f"{master_dir}/Program/Temp_Module/{module_name}/{module_name}.svg"):
            os.remove(f"{master_dir}/Program/Temp_Module/{module_name}/{module_name}.svg")

        os.rename(f"{master_dir}/Program/Temp_Module/ts1/logo.svg", f"{master_dir}/Program/Temp_Module/ts1/{module_name}.svg")

        if os.path.exists(f"frontEnd_logodir/{module_name}.svg"):
            os.remove(front_end_installation)
        shutil.move(f"{master_dir}/Program/Temp_Module/{module_name}/{module_name}.svg", frontEnd_logodir)

    if update:
        shutil.rmtree(frontEnd_outdir)
    shutil.move(rf"{master_dir}\Program\Temp_Module\{module_name}\Front End", frontEnd_outdir)

    if not update:
        with open(front_end_dir + r".\\moduledefs.js", "w") as file:
            file.writelines(line + '\n' for line in (module_definitions + new_content.splitlines()))

    os.chdir(master_dir)
    return True

def back_end_installation(API_Files, temp_dir, modulename, backend_outdir, update=False):
    """
    Function for Back-End installation.
        1. Check if blueprint directory already exists
        2. Scan Each file is safe to import into system

    Returns True - On Success

    Error Codes None (See Scan_file Function)
    """
    if os.path.exists(backend_outdir) and not update:
        shutil.rmtree(temp_dir)
        return on_error(3, "BluePrint Already Exists")

    for file in API_Files:
        with open(file) as api_file:
            scan_result = scan_file(api_file, modulename)
            if scan_result:  # If Scan returns an Error
                api_file.close()
                shutil.rmtree(temp_dir)
                return scan_result
    return True


def table_installation(TableFiles, temp_dir, modulename, Table_outdir, update=False):
    """
    Function for Table installation.
        1. Check if Table directory already exists
        2. Scan Each Table file is safe to import into system

    Returns True - On Success

    Error Codes None (See Scan_file Function)
    """
    if os.path.exists(Table_outdir) and not update:
        shutil.rmtree(temp_dir)
        return on_error(2, "Table Already Exists")

    for file in TableFiles:
        with open(file) as table_file:
            scan_result = scan_file(table_file, modulename, True, update)
            if scan_result:  # If Scan returns an Error
                table_file.close()
                shutil.rmtree(temp_dir)
                return scan_result
    return True

def get_module(prefix):
    """
    Get module relevant based on the given module prefix

    returns Module obj on success else None
    """
    Modules = Module.query.filter(Module.prefix == prefix).all()
    return Modules

@blueprint.route('UpdateReference')
def update_module_ref():
    """ API Endpoint to update display name & Logo for database

        Returns Updated Module

        On Error:
            Error Code 16 - Incorrect Password Given
    """
    from Program import db
    save_dir = os.getcwd()
    modulePrefix = request.values.get('prefixName')
    ModulePass = request.values.get('modulePass')
    displayName = request.values.get('displayName')
    dl_file = request.files['logo']
    old_module = Module.query.filter(Module.prefix == modulePrefix)
    if old_module.moduleKey == ModulePass:
        values = {"displayName": displayName}
        if dl_file != '':
            os.chdir("../")
            os.chdir("./Front-End-Current/src/")
            dl_file.save(f'./logo/{modulePrefix}.svg')
            values["logo"] = f"./logo/{modulePrefix}.svg"
        Module.query.filter(Module.prefix == modulePrefix).update(values)
        db.session.commit()
        os.chdir(save_dir) # Reset to Base CWD
    else:
        return on_error(16, "Incorrect Module Password entered")

@blueprint.route('/upload', methods=['GET', 'POST'])
def upload_module():
    '''
    API Endpoint to process a Module in a compressed zip file.

    This will add the tables to the DB & New endpoints to the application.

    Returns:
        Error Code 1: Module Already Exists
        Error Code 2: Table Already Exists
        Error Code 3: Blueprint Already Exists
        Error Code 10 - TableName not declared with modulename prefix
        Error Code 11 - Restriced Module Found in Python Files
        Error Code 12 - Syntax Error Found in Python Files
        Error Code 16 - Module Pass does not match.\
        Error Code 17 - No Module Uploaded
        On Success - Return new_module Module As Json
    '''
    if request.method in ['POST', 'UPDATE']:
        update = request.method == 'UPDATE'

        master_dir = os.getcwd()
        dl_file = request.files['fileToUpload']
        if dl_file == '':
            return on_error(17, 'No Module Uploaded, please Upload a File')
        modulename = dl_file.filename.strip(".zip")
        DisplayName = request.values['displayName']
        ModulePass = request.values['modulePass']# TODO When User Auth Done, Encrypt module pass
        module = get_module(modulename)

        if module != [] and not update:
            return on_error(1, f"Module {modulename}, Already Exists")
        elif update and module != []:
            if module.moduleKey != ModulePass:
                return on_error(16, "Error Updating Module, Module Pass Is Incorrect")

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
        logo_path = ""
        if os.path.exists(f"Program/Temp_Module/{modulename}.svg"):
            logo_path = f'/logos/{modulename}.svg'

        if API_Files != []:
            back_end_success = back_end_installation(API_Files, temp_dir, modulename, api_outdir, update=update)
            if back_end_success is not True:
                return back_end_success

        if TableFiles != []:
            table_success = table_installation(TableFiles, temp_dir, modulename, Table_outdir, update=update)
            if table_success is not True:
                return table_success

        API_outdir = rf"Program\Module\{modulename}"

        front_end_success = front_end_installation(FrontEndDir, modulename, master_dir, update=update)

        # All Modules are Valid, now move to the correct directories, If they exist
        if API_Files != []:
            if update:
                shutil.rmtree("{API_outdir.strip(modulename)}/{modulename}")
            shutil.move(f"{temp_dir}{modulename}\Backend", API_outdir.strip(modulename))
            os.rename(f"{API_outdir.strip(modulename)}\Backend", f"{API_outdir.strip(modulename)}/{modulename}")

        if TableFiles != []:
            if update:
                shutil.rmtree(Table_outdir)
            shutil.move(f"{temp_dir}{modulename}\Tables", Table_outdir)
            tables = convert_to_imports(dir_tree(Table_outdir))
            from Program.DB.Builder import create_db

            create_db(tables)

        if front_end_success is not True:
            if os.path.exists(f"Program/Module/{modulename}"):
                shutil.rmtree(f"Program/Module/{modulename}")
            if os.path.exists(f"Program/DB/Models/{modulename}"):
                shutil.rmtree(f"Program/DB/Models/{modulename}")
            shutil.rmtree(temp_dir)
            return front_end_success
        # Upload Tables to Database


        new_Module = create_module(str(modulename),DisplayName, ModulePass, True, logo_path)
        new_Module = create_module(str(modulename),DisplayName, ModulePass, True, logo_path)
        QueryInsertModule(new_Module)
        os.chdir(master_dir)

        shutil.rmtree(f"Program/Temp_Module")
        # Reload Flask to initialise blueprints for backend
        reload()
        return on_success(new_Module.toJSON(True))
    return on_error(-1, "Incorrect Request Type, request should be POST")


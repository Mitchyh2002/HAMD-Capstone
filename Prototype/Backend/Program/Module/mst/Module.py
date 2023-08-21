import os.path
import subprocess

from flask import Blueprint, render_template, request, session, redirect, url_for
from flask_login import login_required
import time
import zipfile
import shutil
import re
import ast
from Program.ResponseHandler import on_error, on_success
from os.path import splitext
from os import mkdir
from re import search

from Program.DB.Models.mst.Modules import Module, create_module
from Program.DB.Models.mst.User import PasswordHash, User
from Program.DB.Models.mst.moduleAccess import moduleAccess, create_moduleAccess
from Program import reload, db
from Program.OS import dir_tree, convert_to_imports

#from Program.DB.Models.mst.Modules import Module, create_module
from sqlalchemy.orm import Session

blueprint = Blueprint('module', __name__, url_prefix="/module")

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
        21 - Incorrect Keys.txt format
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
    routes = []
    is_blueprint = False
    for line in lines:
        line = str(line)
        line = line.strip("b'")
        line = line.strip(r"\r\n")
        if "os." in line:
            return on_error(11, "Restricted Module found in application")
        elif "subproccess." in line:
            return on_error(11, "Restricted Module found in application")
        elif 'from' in line:
            modules.append(search(regex_dict["from"], line)[0])
        elif "__import__" in line:
            modules.append(search(regex_dict["__import__"], line)[0])
            pass
        elif "import" in line:
            modules.append(search(regex_dict["import"], line)[0])
        if 'lueprint =' in line:
            is_blueprint = True
            urlPattern = f'(?<=url_prefix="\/){modulename}(?=/)'
            blueprintPattern = f'(?<=Blueprint\(\\\'){modulename}(?=)'
            url_check = re.findall(urlPattern, line)
            blueprint_check = re.findall(blueprintPattern, line)
            if len(blueprint_check) == 0:
                return on_error(4, f"First Variable in Blueprint must contain {modulename}_")
            if len(url_check) == 0:
                return on_error(4, f"url_prefix must start with module prefix")
        if update:
            if "@blueprint.route" in line:
                line = line.strip()
                line = line.split("@blueprint.route('")[1]
                routes.append(line)

    if TableScan:
        pattern = rf'(?<=__tablename__ = [\'"]).*(?=[\'"])'
        matches = re.findall(pattern, '\n'.join(lines))
        for match in matches:
            if f"{modulename}_" not in match:
                return on_error(10, "Tablename Doesnt doesn't start with modulename")
        if update:
            new_rows = {}
            if os.path.exists(f"Program/DB/Models/{modulename}/{os.path.basename(in_file.name)}"):
                with open(f"Program/DB/Models/{modulename}/{os.path.basename(in_file.name)}") as ref_file:
                    alt_lines = ref_file.readlines()
                    file_difference = set(alt_lines).difference(set(lines))
                    if len(file_difference) != 0:
                            return on_error(20, "Table is missing content on Update, Please ensure datatables are not missing")
                    new_rows[match] = set(lines).difference(set(alt_lines))
    in_file.seek(0)
    keys = {}
    if os.path.exists('Program\Temp_Module\keys.txt'):
        with open(os.path.exists('Program\Temp_Module\keys.txt')) as key_pairs:
            lines = key_pairs.readlines()
            for line in lines:
                line = line.split(":")
                if len(line) == 2:
                    keys[line[0]] = PasswordHash.new(line[1]).hash
                else:
                    on_error(21, "keys.txt lines be in the following format {moduleprefix}:{modulepassword}")



    with open(r'Program\templates\whitelisted_modules.txt') as whitelist:
        whitelisted_modules = whitelist.read()
        whitelisted_modules = whitelisted_modules.splitlines()
        for module in modules:
            split_module = module.split(".")
            if "Program.DB" in module:
                module_key = keys.get(split_module[3])
                if module_key == None:
                    on_error(11, "Restricted Module found in application, module not found in keys.txt")
                else:
                    db_module = split_module[3]
                    module = get_module(split_module[3])
                    if module.moduleKey != module_key:
                        return on_error(11, "Restricted Module found in application, incorrect password in keys.txt")

            elif split_module[0] not in whitelisted_modules:
                return on_error(11, "Restricted Module found in application")
    if update and not TableScan:
        existing_routes = []
        fileName = in_file.name.split("\\")[-1]
        if os.path.exists(f'Program/Module/{modulename}/{fileName}'):
            with open(f'Program/Module/{modulename}/{fileName}') as curr_file:
                curr_lines = curr_file.readlines()
                for line in curr_lines:
                    if '@blueprint.route' in line:
                        line = line.strip()
                        line = line.split("@blueprint.route('")[1]
                        existing_routes.append(line)
                    if 'blueprint =' in line:
                        urlPattern2 = f'(?<=url_prefix="\/){modulename}(?=/)'
                        blueprintPattern2 = f'(?<=Blueprint\(\\\'){modulename}(?=)'
                        url_check2 = re.findall(urlPattern2, line)
                        blueprint_check2 = re.findall(blueprintPattern2, line)
                        if len(blueprint_check) == 0:
                            return on_error(4, f"Blueprints First Variable in Blueprint must contain {modulename}_")
                        if len(url_check) == 0:
                            return on_error(4, f"url_prefix must start with module prefix")
                        if url_check != url_check2:
                            return on_error(4, f"endpoint url has been changed in file {fileName}")
                        if blueprint_check2 != blueprint_check:
                            return on_error(4, f"Blueprints First Variable has been changed in file {fileName}")
            for route in existing_routes:
                if route not in routes:
                    missing_routes = list(set(existing_routes).difference(set(routes)))
                    missing_routes = [route.strip().split("'")[0] for route in missing_routes]
                    return on_error(5, f"Routes {missing_routes} are missing from {fileName}.")
    if update and TableScan:
        return 0, new_rows
    return 0


def QueryInsertModule(new_module: Module):

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

@blueprint.route('getall')
def get_all_plugins():
    '''
       Get Request that returns all modules

       Parameters:
           None

       Returns:
           A List containing all modules
       '''
    return [Module.toJSON(True) for Module in Module.query.all()]

def check_files(temp_dir, module_prefix):
    '''
    Check Old and New content for correct files, 
    
    If any Key files are missing return error code 4 else None
    '''
    if os.path.exists(f'Program/DB/Models/{module_prefix}'):
        table_dir = temp_dir + f'{module_prefix}/Tables'
        if not os.path.exists(table_dir):
            return on_error(4, "Tables Are Missing From Module, Please ensure existing plugin content is in .zip file")
        existing_content = [x.split(f'Program/DB/Models/{module_prefix}')[1] for x in dir_tree(f'Program/DB/Models/{module_prefix}', True)]
        new_content = [x.split(f'Program\\Temp_Module\\{module_prefix}/Tables')[1] for x in dir_tree(table_dir, True)]

        if list(set(existing_content).difference(set(new_content))) != []:
            return on_error(4, "Tables Are Missing From Module, Please ensure existing plugin content is in .zip file")

    if os.path.exists(f'Program/Module/{module_prefix}'):
        if not os.path.exists(temp_dir + f'{module_prefix}/Backend'):
            return on_error(4, "Tables Are Missing From Module, Please ensure existing plugin content is in .zip file")
        existing_content = dir_tree(f'Program/Module/{module_prefix}')
        new_content = [x.split(f'Program\\Temp_Module\\{module_prefix}/Backend')[1] for x in dir_tree(table_dir, True)]

        blueprints = []
        for file in existing_content:
            with open(file) as check_file:
                content = check_file.read()
                blueprintPattern = f'blueprint = Blueprint'
                matches = re.findall(blueprintPattern, content)
                if matches != []:
                    blueprints.append(file.split(f'Program/Module/{module_prefix}')[1])

        if list(set(existing_content).difference(set(new_content))) != []:
            return on_error(4, "Blueprints Are Missing From Module, Please ensure existing plugin content is in .zip file")
    return None



def front_end_installation(temp_dir, module_name, master_dir, update=False):
    """ mst Function to Facilitate the installation of Front End Components
        1. Confirm mst.JS exists and pull export function name
        2. Write the amended Moduledefs.JS file with new imports
        3. If Logo File exists rename and push to main app
        4. Push front-end files to front-end & write the module-defs file

    Returns None

    On Error:
            Error 16 - When Updating Module, the mst.JS export function has changed, this must stay the same to protect other modules.
            Error 15 - mst.JS Does Not Exist
            Error 14 - Export Function Not Found in mst.JS
            Error 10 - Module Name is not appended to the front of export function
    """
    if os.path.exists(f"{temp_dir}\Main.js") == False:
        return on_error(15, "Front-End Missing mst.js file")
    imports = []
    with open(f"{temp_dir}\Main.js") as MainJS:
        content = MainJS.read()
        pattern = r'(?<=export default function).*(?=\()|(?<=export function ).*(?=\()'
        functionName = re.findall(pattern, content)
        if functionName is None:
            return on_error(14, "Cannot Find Default Export Function Name in main.js file")
        pattern_2 = fr'(?<=const ){module_name}_pages(?= )'
        page_name = re.findall(pattern_2, content)
        imports = ", ".join(functionName + page_name)

        if f"{module_name}_" not in functionName[0]:
            return on_error(10, "Module Name not in main Front-End Function Name")

    os.chdir("../")
    front_end_dir = os.getcwd() + "\\Front-End-Current\\src"
    frontEnd_outdir = rf"{front_end_dir}\modules\{module_name}"
    frontEnd_logodir = rf"{front_end_dir}\logos"

    # Write new Module Def Files
    with open(front_end_dir + r".\\moduledefs.js", "r") as file:
        content = file.read()
        pattern = r"\/\/REGEX_START\n([\s\S]*?)\/\/REGEX_END"
        module_definitions = re.search(pattern, content).group(1)
        module_definitions = module_definitions.splitlines()
        i = 0
        module_flag = False
        Directory_flag = False
        for line in module_definitions:
            if update and module_name in line:
                pattern = "(?<=import { ).*(?= } from)"
                old_functionName = re.findall(pattern, line)[0]
                if functionName[0] != old_functionName:
                    os.chdir(master_dir)
                    return on_error(16, f"mst.js Export default function name changed, please change back to {old_functionName}")
                else:
                    break
            if line == '//IMPORT_END':
                import_pos = i

            if line == "export const Modules = {":
                module_flag = True
            if line == "export const Directory = {":
                Directory_flag = True
            if line == '}':
                if module_flag == True:
                    module_last_pos = i
                    module_flag = False
                if Directory_flag == True:
                    directory_last_pos = i + 1


            i = i + 1
        if not update:
            if page_name != []:
                page_name = page_name[0]
            module_definitions.insert(import_pos, 'import { '+imports+' } from "./modules/'+module_name+'/main.js";')
            module_definitions[module_last_pos] = module_definitions[module_last_pos] + ","
            module_definitions.insert(module_last_pos + 1, f"    {module_name}: {functionName[0]}")
            module_definitions[directory_last_pos] = module_definitions[directory_last_pos] + ","
            module_definitions.insert(directory_last_pos + 1, f"    {module_name}: {page_name}")
            # LEAVE 4 SPACES FOR SYNTAX :3
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
    new_rows = []
    for file in TableFiles:
        with open(file) as table_file:
            if not update:
                scan_result = scan_file(table_file, modulename, True, update)
            else:
                scan_result, file_additions = scan_file(table_file, modulename, True, update)
                new_rows.append(file_additions)
            if scan_result:  # If Scan returns an Error
                table_file.close()
                shutil.rmtree(temp_dir)
                return scan_result
    if not update:
        return True
    return True, new_rows

def get_module(prefix):
    """
    Get module relevant based on the given module prefix

    returns Module obj on success else None
    """
    Modules = Module.query.filter(Module.prefix == prefix).first()
    return Modules


    #If Conn Exists Delete it
    moduleAccess.query.filter_by(modulePrefix=modulePrefix, userID=userID).delete()
    created_moduleAccess = create_moduleAccess(modulePrefix, userID)
    created_moduleAccess.insert()

    return on_success(created_moduleAccess.toJSON())

@blueprint.route('ModuleAccess', methods=['POST', 'DELETE'])
def Module_Access_Control():
    userID = request.values.get("userID")
    modulePrefix = request.values.get("modulePrefix")
    if userID is None:
        return on_error(3, "UserID is not specified")
    if modulePrefix is None:
        return on_error(3, "modulePrefix is not specified")
    elif len(modulePrefix) > 3:
        return on_error(3, "ModulePrefix Cannot be more than 3 charachters")
    selected_user = User.query.filter_by(userID=userID).first()
    selected_module = Module.query.filter_by(prefix=modulePrefix).first()
    if selected_module == None:
        return on_error(2, "Specified Module does Not Exist")
    if selected_user == None:
        return on_error(2, "Specified User does Not Exist")

    if request.method == 'POST':
        moduleAccess.query.filter_by(modulePrefix=modulePrefix, userID=userID).delete()
        return give_user_access(userID, modulePrefix)
    else:
        return remove_user_access(userID, modulePrefix)

def give_user_access(userID, modulePrefix):
    '''
    Give A User access to view a specific module in the Database

    Inputs:
        userID (int) - Integer representation of the userID
        modulePrefix (str) - 3 Char string for a given module

    returns:
        ModuleAccess Object containing userID & Module info
    '''
    created_module_access = create_moduleAccess(userID, modulePrefix)
    created_module_access.insert()

    return on_success(created_module_access.toJSON())

def remove_user_access(userID, modulePrefix):
    moduleAccess.query.filter_by(modulePrefix=modulePrefix, userID=userID).delete()

    return on_success([])


@blueprint.route('updatereference', methods=['POST'])
def update_module_ref():
    """ API Endpoint to update display name & Logo for database

        Returns Updated Module

        On Error:
            Error Code 16 - Incorrect Password Given
    """
    from Program import db
    save_dir = os.getcwd()
    modulePrefix = request.values.get('modulePrefix')
    ModulePass = request.values.get('modulePass')
    displayName = request.values.get('displayName')
    if displayName == None or ModulePass == None or modulePrefix == None:
        return on_error(3, "Missing Key Inputs, please check request is sending correct parameters")
    dl_file = ''
    if len(request.files) != 0:
        dl_file = request.files['logo']
    old_module = Module.query.filter(Module.prefix == modulePrefix).first()
    if old_module.moduleKey.strip() == ModulePass:
        values = {"displayName": displayName}
        if dl_file != '':
            os.chdir("../")
            os.chdir("./Front-End-Current/src/")
            dl_file.save(f'./logo/{modulePrefix}.svg')
            values["logo"] = f"./logo/{modulePrefix}.svg"
        Module.query.filter(Module.prefix == modulePrefix).update(values)
        db.session.commit()
        os.chdir(save_dir) # Reset to Base CWD
        return on_success((Module.query.filter(Module.prefix == modulePrefix).first()).toJSON(True))
    else:
        return on_error(16, "Incorrect Module Password entered")

@blueprint.route('activate', methods=["POST"])
def activate_module():
    from Program import db
    modulePrefix = request.values.get('modulePrefix')
    if Module.query.filter(Module.prefix == modulePrefix).first() is None:
        return on_error(3, "Specified Module Does Not Exist")

    Module.query.filter(Module.prefix == modulePrefix).update(dict(status=True))
    db.session.commit()
    return (Module.query.filter(Module.prefix == modulePrefix).first()).toJSON(True)

@blueprint.route('deactivate', methods=["POST"])
def deactivate_module():
    modulePrefix = request.values.get('modulePrefix')
    if Module.query.filter(Module.prefix == modulePrefix).first() is None:
        return on_error(3, "Specified Module Does Not Exist")

    Module.query.filter(Module.prefix == modulePrefix).update(dict(status=False))

    db.session.commit()
    return (Module.query.filter(Module.prefix == modulePrefix).first()).toJSON(True)


@blueprint.route('/upload', methods=['GET', 'POST', 'OPTIONS'])
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
        Error Code 18 - Missing Key Paramaters
        On Success - Return new_module Module As Json
    '''
    if request.method in ['POST', 'OPTIONS']:
        #update = request.values.get('update') == True
        update = True
        master_dir = os.getcwd()
        dl_file = request.files['fileToUpload']
        if dl_file.filename == '':
            return on_error(17, 'No Module Uploaded, please Upload a File')
        modulename = dl_file.filename.strip(".zip")
        DisplayName = request.values.get('displayName')
        ModulePass = request.values.get('modulePass')
        if '' in [DisplayName, ModulePass]:
            return on_error(18, "Display Name or Module Password is Missing, Please confirm they are entered correctly")
        module = get_module(modulename)

        if module != [] and not update:
            return on_error(1, f"Module {modulename}, Already Exists")
        elif update and module != []:
            if module.moduleKey.strip() != ModulePass:
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

        if update:
            file_check = check_files(temp_dir, modulename)
            if file_check is not None:
                return file_check
        if os.path.exists(f"Program/Temp_Module/{modulename}.svg"):
            logo_path = f'/logos/{modulename}.svg'

        if API_Files != []:
            back_end_success = back_end_installation(API_Files, temp_dir, modulename, api_outdir, update=update)
            if back_end_success is not True:
                return back_end_success

        if TableFiles != []:
            if not update:
                table_success = table_installation(TableFiles, temp_dir, modulename, Table_outdir, update=update)
            else:
                table_success, new_rows = table_installation(TableFiles, temp_dir, modulename, Table_outdir, update=update)
            if table_success is not True:
                return table_success

        API_outdir = rf"Program\Module\{modulename}"

        front_end_success = front_end_installation(FrontEndDir, modulename, master_dir, update=update)

        # All Modules are Valid, now move to the correct directories, If they exist
        if API_Files != []:
            if update:
                if os.path.exists(f"{API_outdir.strip(modulename)}/{modulename}"):
                    shutil.rmtree(f"{API_outdir.strip(modulename)}/{modulename}")
            shutil.move(f"{temp_dir}{modulename}\Backend", API_outdir.strip(modulename))
            os.rename(f"{API_outdir.strip(modulename)}\Backend", f"{API_outdir.strip(modulename)}/{modulename}")

        if TableFiles != []:
            if update:
                if os.path.exists(Table_outdir):
                    shutil.rmtree(Table_outdir)
            shutil.move(f"{temp_dir}{modulename}\Tables", Table_outdir)
            Table_outdir = dir_tree(Table_outdir)
            tables = convert_to_imports(Table_outdir)

            from Program.DB.Builder import create_db, add_column
            if not update:
                create_db(tables)
            elif new_rows != []:
                add_column(new_rows)

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


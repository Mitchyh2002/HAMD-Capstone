import os
import re
os.chdir(r"C:\Users\\nuble\OneDrive - Queensland University of Technology\Capstone\Prototype\Backend\Program\Module\Main\\")
os.chdir("../../../..")
os.chdir("./Front-End-Current/src/")
beast = os.getcwd()

module_definitions = ""
with open(beast + r".\\moduledefs2.js", "r") as file:
    content = file.read()
    imports = """import test from "./modules/ModuleExample/main.js";
import Test2 from "./modules/ModuleTest2/main.js";
import upload from "./modules/UploadPlugin/main.js";
import React from "react";

//Defintion of components, correlates the module id of the database to the component
export const Components = {
    mst: upload,
    df2: test,
    df3: Test2
}"""
    pattern = r"\/\/REGEX_START\n([\s\S]*?)\/\/REGEX_END"
    module_definitions = re.sub(pattern, imports, content)
    pass

with open(beast + r".\\moduledefs2.js", "w") as file:
    file.write(module_definitions)
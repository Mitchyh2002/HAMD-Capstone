import copy
import os.path

from flask import Blueprint, render_template, request, session, redirect, url_for
import time
from os.path import splitext
from os import mkdir
from re import search
from Program import reload

blueprint = Blueprint('main', __name__)


def scan_file(in_file):
    modules = []
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
    return """
  <head>
    <meta charset="UTF-8">
    <title>Upload Form</title>
  </head>
  <body>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Folder Upload Example</title>
  </head>
  <body>
    <h1>Folder Upload Example</h1>
    <form>
      <input type="file" name="fileToUpload" id="fileToUpload" multiple>
      <br><br>
      <button type="button" onclick="uploadFiles()">Upload Files</button>
    </form>

    <script>
      function uploadFiles() {
        const files = document.getElementById("fileToUpload").files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        fetch("/upload", {
          method: "POST",
          body: formData,
        })
        .then(response => response.text())
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error(error);
        });
      }
    </script>
  </body>
</html>"""


@blueprint.route('/time')
def get_current_time():
    return {'time': time.time()}


@blueprint.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['files']
        if splitext(file.filename)[1] != ".py":
            return 'File Failed to Upload'
        if scan_file(file):
            return "<h1> Failed to Upload<h1>"
        outdir = f"Program/Module/df1"
        if not os.path.exists(outdir):
            mkdir(outdir)
        else:
            return "Module Already Exists"
        outfile = outdir + "/" + file.filename
        file.save(outfile)
        import_module = outfile.replace("/", ".").strip(".py")

        reload()

        return 'File uploaded successfully!'

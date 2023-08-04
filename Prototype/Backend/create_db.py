from Program.DB.Builder import create_db
from Program.DB.Models.master.Modules import *
from Program.Module.Main.Module import scan_file
from Program import init_app
from Program.DB.Models.master.Modules import Module, create_module
from Program.Module.Main.Module import QueryInsertModule


from werkzeug.serving import run_simple

if __name__ == "__main__":
    create_db()

    app = init_app()
    app.config.update({
        "TESTING": True
    })
    client = app.test_client()

    new_module = create_module("mst", "UploadModule", "Test234", True, '')
    with app.app_context():
        new_module.insert()
from Program.DB.Builder import create_db
from Program.DB.Models.grp.Groups import create_group
from Program import init_app
from Program.DB.Models.mst.Modules import Module, create_module
from Program.Module.mst.Module import QueryInsertModule


from werkzeug.serving import run_simple

if __name__ == "__main__":
    create_db()

    app = init_app()
    app.config.update({
        "TESTING": True
    })
    client = app.test_client()

    new_module = create_module("mst", "UploadModule", "Test234", True, '')
    grp_module = create_module("grp", "Group management", "Test234", True, '')
    grp = create_group('Default')
    with app.app_context():
        new_module.insert()
        grp_module.insert()
        grp.insert()
from Program.DB.Builder import create_db
from Program import init_app
from Program.DB.Models.mst.Modules import create_module
from Program.DB.Models.grp.Groups import create_group
if __name__ == "__main__":
    create_db()

    app = init_app()
    app.config.update({
        "TESTING": True
    })
    client = app.test_client()

    new_module = create_module("mst", "UploadModule", "HowardHamlin", True, '')
    grp_module = create_module("mgm", "GroupManagement", "JamesMcgill", False, '')

    default_group = create_group('Default')

    with app.app_context():
        new_module.insert()
        default_group.insert()
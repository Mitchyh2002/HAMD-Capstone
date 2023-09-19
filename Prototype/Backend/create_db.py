from Program.DB.Builder import create_db
from Program.DB.Models.grp.Groups import create_group
from Program import init_app
from Program.DB.Models.mst.Module import Module, create_module
from Program.Module.mst.Module import QueryInsertModule
from Program.DB.Models.mst.User import PasswordHash, create_user
from Program.DB.Models.mst.ModuleSecurity import init_masterPages
from werkzeug.serving import run_simple

def sys_create():
    create_db()

    app = init_app()
    app.config.update({
        "TESTING": True
    })
    client = app.test_client()


    new_module = create_module("mst", "Master Module", PasswordHash.new("M_STER@aaa").hash, True, '')
    grp_module = create_module("grp", "Group management", PasswordHash.new("GroupMDL").hash, False, '')
    user = create_user('sysAdmin@BeeAware.com', 'SYSAdmin', "@SySadmin!", '2000', None, 7)
    
    grp = create_group('Default')
    with app.app_context():
        new_module.insert()
        grp_module.insert()
        grp.insert()
        user.insert()
        init_masterPages()

if __name__ == "__main__":
    sys_create()
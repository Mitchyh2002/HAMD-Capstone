import datetime

from Program.DB.Builder import create_db
from Program.DB.Models.grp.Groups import create_group
from Program import init_app
from Program.DB.Models.mst.Module import Module, create_module
from Program.DB.Models.mst.moduleAccess import moduleAccess, create_moduleAccess
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


    new_module = create_module("mst", "Platform Administration", PasswordHash.new("M_STER@aaa").hash, True, '')
    grp_module = create_module("grp", "Group management", PasswordHash.new("GroupMDL").hash, False, '')
    masterUser = create_user('sysAdmin@BeeAware.com', 'SYSAdmin', "@SySadmin!", '2000', None, 9)
    testUser = create_user('test@test.com', 'testUser', 'testUser', '2000', None, 1)
    testUser2 = create_user('test2@test.com', 'testUser', 'testUser', '2000', None, 5)
    testUser2.confirmed = True
    testUser2.confirmedDate = datetime.date.today()
    testUser.confirmed = True
    testUser.confirmedDate = datetime.date.today()
    masterUser.confirmed = True
    testUser.confirmedDate = datetime.date.today()

    userAccess = create_moduleAccess(masterUser.userID, 'mst')
    grp1 = create_group('Default')
    grp2 = create_group('Test Group')
    with app.app_context():
        new_module.insert()
        grp_module.insert()
        grp1.insert()
        grp2.insert()
        masterUser.insert()
        testUser.insert()
        testUser2.insert()
        init_masterPages()
        userAccess.insert()

if __name__ == "__main__":
    sys_create()
from datetime import datetime
from flask import Blueprint, request
try:
    from sqlalchemy import Select
except ImportError:
    from sqlalchemy import select as Select

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('admin', __name__, url_prefix="/admin")

TESTING = True

@blueprint.route('/getActiveUsers')
def getActiveUsers():
    return on_success(True)

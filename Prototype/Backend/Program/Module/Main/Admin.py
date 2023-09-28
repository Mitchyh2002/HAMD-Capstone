from datetime import datetime
from flask import Blueprint, request
from sqlalchemy import Select

from Program import db
from Program.DB.Models.master.User import User, JSONtoUser
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('admin', __name__, url_prefix="/admin")

TESTING = True

@blueprint.route('/getActiveUsers')
def getActiveUsers():
    return on_success(True)

import os.path
from flask import Blueprint, render_template, request, session, redirect, url_for
from datetime import datetime
from Program.ResponseHandler import on_success
from sqlalchemy.orm import Session

blueprint = Blueprint('time', __name__, url_prefix="/")

@blueprint.route('/time')
def time():
    return on_success(datetime.now().strftime(("%H:%M:%S")))

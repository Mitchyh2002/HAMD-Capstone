import time

from flask import Blueprint

blueprint = Blueprint('testmodule3', __name__, url_prefix='/testmodule3')

@blueprint.route('/time')
def get_current_time():
    return {'time': time.time()}


@blueprint.route('/hello', methods=['GET', 'POST'])
def hello_world():
        return 'Hello World'

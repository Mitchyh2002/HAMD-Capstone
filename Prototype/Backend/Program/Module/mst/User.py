import bcrypt

from datetime import datetime
from flask import Blueprint, request, render_template
from flask_login import current_user, login_user, logout_user, login_required
try:
    from sqlalchemy import Select
except ImportError:
    from sqlalchemy import select as Select

from Program import db, export_front_end_link
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.Module.mst.Confirmation import generate_confirmation_token, send_email, confirm_token
from Program.ResponseHandler import on_error, on_success, bearer_decode, userFunctionAuthorisations

blueprint = Blueprint('user', __name__, url_prefix="/mst/user")

TESTING = True

@blueprint.route('/getAccount/', methods=['OPTIONS'])
def handle_options():
    #print("Handling OPTIONS request")
    return on_success("Pre-flight Accepted")

@blueprint.route('/getAccount/', methods=['GET'])
def getAccount():
    user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')

    if user_bearer == None or 'null' in user_bearer:
        return on_error(400, "Auth Header Not Provided")
    
    user = bearer_decode(user_bearer)['Values']
    selectedUser = User.query.filter_by(userID=user['userID']).first()
    user['totalKarma'] = selectedUser.totalKarma
    return on_success(user)

@blueprint.route('/changePassword', methods=['POST', 'OPTIONS'])
def changePassword():
    if request.method == 'OPTIONS':
        return handle_options()
    else:
        user_bearer = request.headers.environ.get('HTTP_AUTHORIZATION')

        if user_bearer == None or 'null' in user_bearer:
            return on_error(400, "Auth Header Not Provided")

        user = bearer_decode(user_bearer)['Values']
        user = User.query.filter_by(userID=user['userID']).first()

        input = request.values
        oldPassword = input.get('currentPassword')
        if oldPassword == "" or oldPassword is None:
            return on_error(20, "Password is required, please enter a password")
        inputBytes = oldPassword.encode('utf-8')

        storedHash = user.passwordHash.hash[2:-1]
        storedHash = storedHash.encode('utf-8')
        
        if bcrypt.checkpw(inputBytes, storedHash):
            newPassword = input.get('newPassword')
            if newPassword == "" or newPassword is None:
                return on_error(20, "Password is required, please enter a password")
            user.changePassword(newPassword)
            user.set_id()
            login_user(user)
            return on_success(user.get_id())
        else:
            return on_error(21, "Login details are incorrect")
    
@blueprint.route('/login', methods=['POST'])
def login():
    # Fetching inputs
    input = request.values
    inputPass = input.get('password')
    inputBytes = inputPass.encode('utf-8')
    inputEmail = input.get('email')

    # Validating Inputs
    if inputEmail == "" or inputEmail is None:
        return on_error(10,"Email is empty, please enter your email.")
    elif not emailIsValid(inputEmail):
        return on_error(11, "Email entered is invalid, please enter a valid email address.")
    elif inputPass == "" or inputPass is None:
        return on_error(20, "Password is required, please enter a password")
    else:
        inputEmail = inputEmail.lower()
        # Finding User in database
        user = QuerySelectUser(inputEmail)        
        if user is None:
            return on_error(13, "Email is not yet registered, would you like to register?")
        else:
            # Validating Password
            storedHash = user.passwordHash.hash[2:-1]
            storedHash = storedHash.encode('utf-8')
            if bcrypt.checkpw(inputBytes, storedHash):

                
                if user.adminLevel == 0:
                    return on_error(1, "Account has been suspended")

                if not user.confirmed:
                    return on_error(30, "Please confirm your account")

                
                user.set_id()
                login_user(user)
                return on_success(user.get_id())
            else:
                return on_error(21, "Login details are incorrect, please try again.")
            
    

@blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    current_user.del_id()
    logout_user()
    return on_success("User has successfully been logged out")

@blueprint.route('/register', methods=['POST'])
def register():
    # Fetching Inputs
    input = request.values
    inputEmail = input.get('email')
    inputPass = input.get('password')
    inputFirstName = input.get('firstName')
    inputDateOfBirth = input.get('dateOfBirth')
    inputPhoneNumber = input.get('phoneNumber')
    # Validating Required Inputs
    if inputEmail == "" or inputEmail is None:
        return on_error(10,"Email is empty, please enter your email.")
    elif not emailIsValid(inputEmail):
        return on_error(11, "Email entered is invalid, please enter a valid email address.")
    elif inputPass == "" or inputPass is None:
        return on_error(20, "Password is required, please enter a password")
    elif inputFirstName == ""or inputFirstName is None:
        return on_error(30, "First name is required, please enter your name")
    elif not firstNameIsValid(inputFirstName):
        return on_error(31, "Name entered is invalid, please enter a valid name.")
    elif inputDateOfBirth == "" or inputDateOfBirth is None:
        return on_error(40, "Date of Birth is required, please enter your date of birth")
    elif not dateOfBirthIsValid(inputDateOfBirth):
        return on_error(41, "Date of Birth entered is invalid, please enter a valid date of birth.")
    
    inputEmail = inputEmail.lower()
    # Checking email is Unique
    uniqueEmail = QuerySelectUser(inputEmail)
    if type(uniqueEmail).__name__ == "User":
        return on_error(14, "Email is already registered, would you like to sign in?")
    
    # Validating optional inputs
    if inputPhoneNumber != "" and inputPhoneNumber is not None:
        uniquePhone = QuerySelectUser(inputPhoneNumber, False)
        if type(uniquePhone).__name__ == "User":
            return on_error(54, "Phone Number is already registered, would you like to sign in?")
        if not phoneNumberIsValid(inputPhoneNumber):
            return on_error(51, "Phone number entered is invalid, please enter a valid phone number.")
    
    user = JSONtoUser(input)
    QueryInsertUser(user)

    
    token = generate_confirmation_token(user.email)
    confirm_url = export_front_end_link() + '/Confirm/' + token
    html = render_template('activate.html', confirm_url=confirm_url)
    subject = "Please confirm your email"
    send_email(user.email, subject, html)
    return on_success(token)


def emailIsValid(email):
    if ((email.count('@') != 1) | (email.count('.') == 0)):
        return False
    else:
        return True

def firstNameIsValid(firstName: str):
    if firstName.isalpha():
        return True
    else:
        return False
    
def dateOfBirthIsValid(dateOfBirth:str):
    if (len(dateOfBirth) == 4 
        and (dateOfBirth.startswith("19") or dateOfBirth.startswith("20"))
        and dateOfBirth.isnumeric() 
        and (int(dateOfBirth) + 13 <= datetime.now().year)):
        return True
    else:
        return False

def phoneNumberIsValid(phoneNumber):
    if (len(phoneNumber) == 10 and phoneNumber[0] != "0"):
        return False
    elif (len(phoneNumber) == 12 and phoneNumber[0,3] != "+61"):
        return False
    elif any(not chr.isdigit() for chr in phoneNumber[1:]):
        return False
    else:
        return True

@blueprint.route('/forgotPassword', methods=['POST'])
def forgotPassword():
    input = request.values
    inputEmail = input.get('email').lower()
    user = QuerySelectUser(inputEmail)

    if type(user).__name__ == "User":
        token = generate_confirmation_token(user.email)
        forgot_url = 'http://localhost:3000/resetPassword/' + token
        html = render_template('reset.html', forgot_url=forgot_url)
        subject = "BeeAware Password Reset"
        send_email(user.email, subject, html)
        return on_success(token)
    else:
        return on_success("Account is not valid")
    
@blueprint.route('/resetPassword/<token>', methods=['POST', 'GET'])
def resetPassword(token):
    email = confirm_token(token)
        
    try:
        if not email:
            return on_error(60, "The confirmation link is invalid or has expired.")
        
    except:
        pass

    
    user = QuerySelectUser(email)

    if type(user).__name__ == "User":
        if request.method == 'POST':
            input = request.values
            inputPass = input.get('password')

            if inputPass == "" or inputPass is None:
                return on_error(20, "Password is required, please enter a password")
            
            user.changePassword(inputPass)

            return on_success("Password Changed")
        else:
            return on_success("Token verified")
    else:
        return on_error(62, "Account is not valid")




def QueryInsertUser(new_user: User):
    """ Function to Import User into DB
        if User exists stop
    """
    #If User Exists Stop
    try:

        existing_user = User.query.filter_by(email=new_user.email)

        if type(existing_user).__name__ == "User":
            raise Exception
        db.session.add(new_user)
        db.session.commit()
    except:
        return on_error(19, "User already in system, code failure")
    
def QuerySelectUser(userKey: str, indicator=True):
    if indicator:
        stmt = Select(User).where(User.email == userKey)
    else:
        stmt = Select(User).where(User.phoneNumber == userKey)

    user = db.session.scalar(stmt)
    return user

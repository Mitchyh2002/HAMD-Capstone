import bcrypt

from datetime import datetime
from flask import Blueprint, request
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import select

from Program import db
from Program.DB.Models.mst.User import User, JSONtoUser
from Program.DB.Models.grp.userGroups import userGroup, create_userGroup
from Program.DB.Models.grp.Groups import Group
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('user', __name__, url_prefix="/user")

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
        # Finding User in database
        user = QuerySelectUser(inputEmail)        
        if user is None:
            return on_error(13, "Email is not yet registered, would you like to register?")
        else:
            # Validating Password
            storedHash = user.passwordHash.hash[2:-1]
            storedHash = storedHash.encode('utf-8')
            if bcrypt.checkpw(inputBytes, storedHash):
                login_user(user)
                return on_success(user.toJSON(True))
            else:
                return on_error(21, "Password is incorrect, please try again.")
            
    

@blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return on_success("User has successfully been logged out")

@blueprint.route('/register', methods=['POST'])
def register():
    # Fetching Inputs
    if len(request.values) == 0:
        if len(request.json) == 0:
            return on_error(1, "No Values Sent to via request")
        input = request.json
    else:
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
    
    # Checking email is Unique
    uniqueEmail = QuerySelectUser(inputEmail)
    if type(uniqueEmail).__name__ == "user":
        return on_error(14, "Email is already registered, would you like to sign in?")
    
    # Validating optional inputs
    uniquePhone = QuerySelectUser(inputEmail, False)
    if (uniquePhone != "" and uniquePhone is not None) or uniquePhone is not None:
        uniquePhone = QuerySelectUser(inputPhoneNumber, False)
        if type(uniquePhone).__name__ == "user":
            return on_error(53, "Phone Number is already registered, would you like to sign in?")
        if not phoneNumberIsValid(inputPhoneNumber):
            return on_error(51, "Phone number entered is invalid, please enter a valid phone number.")
    
    user = JSONtoUser(input)
    QueryInsertUser(user)
    QueryInsertGroup(1, user.email)
    return on_success(user.toJSON())



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
    elif (any(not(chr.isDigit() for chr in phoneNumber[1:]))):
        return False
    

def QueryInsertUser(new_user: User):
    """ Function to Import User into DB
        if User exists stop
    """
    #If User Exists Stop
    try:

        existing_user = User.query.filter_by(email=new_user.email)

        if type(existing_user).__name__ == "user":
            raise Exception
        
        db.session.add(new_user)
        db.session.commit()

    except:
        return on_error(19, "User already in system, code failure")

def QueryInsertGroup(group_id, user_email):
    user = User.query.filter_by(email=user_email).first()
    new_userGroup = create_userGroup(group_id, user.userID)
    #If group Conn Exists Delete it
    existingGroup = userGroup.query.filter_by(groupID=group_id, userID=user.userID).delete()
    db.session.add(new_userGroup)
    db.session.commit()

def QuerySelectUser(userKey: str, indicator=True):
    if indicator:
        stmt = select(User).where(User.email == userKey)
    else:
        stmt = select(User).where(User.phoneNumber == userKey)

    user = db.session.scalar(stmt)
    return user
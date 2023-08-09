import json

from flask import Blueprint, render_template, request
from flask_login import current_user, login_user, logout_user, login_required

from Program.DB.Models.master.User import User, PasswordHash, JSONtoUser
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('user', __name__, url_prefix="/user")

TESTING = True

@blueprint.route('/login', methods=['POST'])
def login():
    input = request.values
    inputHash = PasswordHash.new(input.get('password')) 
    inputEmail = input.get('email')
    user = User.query.filter(User.email == inputEmail, User.passwordHash == inputHash)
    print(user)

    if user:
        login_user(user)
        return on_success(User.toJSON(True))
    elif inputEmail == "" or inputEmail is None:
        return on_error(10,"Email is empty, please enter your email.")
    elif inputHash == "" or inputHash is None:
        return on_error(11, "Password cannot be empty, please enter your password.")
    else:
        user = User.query.filter(User.email == inputEmail)
        if user:
            return on_error(20, "Password is incorrect, please try again.")
        else:
            return on_error(30, "Email is not yet registered, would you like to register?")
    

@blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return on_success(1, "User has successfully been logged out")

@blueprint.route('/register', methods=['POST'])
def register():
    input = request.values
    email = input.get('email')
    firstName = input.get('firstName')
    dateOfBirth = input.get('dateOfBirth')
    phoneNumber = input.get('phoneNumber')

    uniqueEmail = User.query.filter(User.email == email)
    uniquePhone = User.query.filter(User.phoneNumber == phoneNumber)    
    if not emailCheck(email):
        return on_error(11, "Email entered is invalid, please enter a valid email address.")
    elif uniqueEmail:
        return on_error(12, "Email already registered, would you like to sign in?")
    elif not firstNameCheck(firstName):
        return on_error(21, "Name entered is invalid, please enter a valid name.")
    elif not dateOfBirthCheck(dateOfBirth):
        return on_error(31, "Date of Birth entered is invalid, please enter a valid date of birth.")
    elif not phoneNumberCheck(phoneNumber):
        return on_error(41, "Phone number entered is invalid, please enter a valid phone number.")
    elif uniquePhone:
        return on_error(42, "Phone number already registered, would you like to sign in?")
    else:
        user = JSONtoUser(input)
    
def emailCheck(email):
    if ((email.count('@') != 1) | (email.count('.') == 0)):
        return False
    else:
        return True

def firstNameCheck(firstName):
    illegal_chr = ['!', '`', '~', '@', '#', '$', '%', '^', '&', '*', '(',')', '_', '=', '+', '[',']','\'','|','{','}','/',';',':','"',',','.','<','>','?']
    if (any((chr.isdigit() or chr in illegal_chr) for chr in firstName)):
        return False
    else:
        return True

def dateOfBirthCheck(dateOfBirth):
    return 1

def phoneNumberCheck(phoneNumber):
    if (len(phoneNumber) == 10 & phoneNumber[0] != "0"):
        return False
    elif (len(phoneNumber) == 12 & phoneNumber[0,3] != "+61"):
        return False
    elif (any(not(chr.isDigit() for chr in phoneNumber[1:]))):
        return False
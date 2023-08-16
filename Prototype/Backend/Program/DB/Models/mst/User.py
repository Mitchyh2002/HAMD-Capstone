import bcrypt

from sqlalchemy import Text, TypeDecorator
from sqlalchemy.orm import validates
from flask_login import UserMixin

from Program import db
from Program.ResponseHandler import on_error

class PasswordHash(object):
    def __init__(self, hash_):
        #assert len(self.hash) == 60, 'bcrypt hash should be 60 chars.'
        self.hash = str(hash_)
        assert self.hash.count('$'), 'bcrypt hash should have 3x "$".'
        self.rounds = int(self.hash.split('$')[2])

    def __eq__(self, candidate):
        if isinstance(candidate, str):
            candidate = candidate.encode('utf-8')
            return bcrypt.hashpw(candidate, self.hash) == self.hash
        return False

    def __repr__(self):
        return '<{}>'.format(type(self).__name__)

    @classmethod
    def new(cls, password, rounds=12):
        if isinstance(password, str):
            password = password.encode('utf-8')
        return cls(bcrypt.hashpw(password, bcrypt.gensalt(rounds)))  
    
class Password(TypeDecorator):
    impl = Text

    def __init__(self, rounds=12, **kwds):
        self.rounds = rounds
        super(Password, self).__init__(**kwds)

    def process_bind_param(self, value, dialect):
        return self._convert(value).hash
    
    def process_result_value(self, value, dialect):
        if value is not None:
            return PasswordHash(value)
        
    def validator(self, password):
        return self._convert(password)
    
    def _convert(self, value):
        if isinstance(value, PasswordHash):
            return value
        elif isinstance(value, str):
            return PasswordHash.new(value, self.rounds)
        elif value is not None:
            raise TypeError('Cannot convert {} to a PasswordHash'.format(type(value)))
        
class User(UserMixin, db.Model):
    __tablename__ = "user"
    userID = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    phoneNumber = db.Column(db.String, unique = True)
    firstName = db.Column(db.String, nullable = False)
    passwordHash = db.Column(Password)
    dateOfBirth = db.Column(db.String, nullable = False)

    def get_id(self):
        return str(self.userID)

    @validates
    def _validate(self, key, password):
        return getattr(type(self), key).type.validator(password)

    def toJSON(self, is_query=False):
        '''
        QOL function to convert OBJ to a valid JSON file. If is for query only return prefix & display name.

        Paramaters:
            is_query (Bool): True, if sending to front end, default False.

        returns:
            Dict Representation of OBJ
        '''
        if is_query:
            return {"userID": self.userID,
                    "email": self.email.strip(),
                    "firstName": self.firstName.strip()}
        if self.phoneNumber is None:
            return {
            "userID": self.userID,
            "email": self.email.strip(),
            "firstName": self.firstName.strip(),
            "passwordHash": self.passwordHash.hash,
            "dateOfBirth": self.dateOfBirth.strip()
        }

        return {
            "userID": self.userID,
            "email": self.email.strip(),
            "phoneNumber": self.phoneNumber.strip(),
            "firstName": self.firstName.strip(),
            "passwordHash": self.passwordHash.hash,
            "dateOfBirth": self.dateOfBirth.strip()
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def setIsAuthenticated(self, bool):
        self._is_authenticated = bool

    def setIsActive(self, bool):
        self._is_active = bool

    def setIsAnonymous(self, bool):
        self._is_anonymous = bool

def create_user(email, firstName, passwordHash, dateOfBirth, phoneNumber=None):
    created_user = User()
    created_user.email = email
    created_user.firstName = firstName
    created_user.passwordHash = passwordHash
    created_user.dateOfBirth = dateOfBirth
    created_user.phoneNumber = phoneNumber
    created_user.setIsAuthenticated(True)
    created_user.setIsActive(True)
    created_user.setIsAnonymous(True)

    return created_user

def JSONtoUser(JSON):
    '''
    Function to convert JSON to User.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a User OBJECT

    Returns:
        created_user (User): Returns a valid User Object
    '''

    try:
        email = JSON.get('email')
        firstName = JSON.get('firstName')
        passwordHash = PasswordHash.new(JSON.get('password'))
        dateOfBirth = JSON.get('dateOfBirth')
        phoneNumber = JSON.get('phoneNumber')

        if phoneNumber is None or phoneNumber == "":
            created_user = create_user(email, firstName, passwordHash, dateOfBirth)
        else:
            created_user = create_user(email, firstName, passwordHash, dateOfBirth, phoneNumber)
    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_user

def export_salt(rounds=12):
    return bcrypt.gensalt(rounds)
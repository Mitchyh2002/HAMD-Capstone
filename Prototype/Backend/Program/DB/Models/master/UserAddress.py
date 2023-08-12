from Program import db
from Program.ResponseHandler import on_error

class UserAddress(db.Model):
    __tablename__ = "userAddress"
    addressID = db.Column(db.Integer, primary_key = True)
    userID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    suburb = db.Column(db.String, nullable = False)
    postCode = db.Column(db.String, nullable = False)

    def toJSON(self, is_query=False):
        '''
        QOL function to convert OBJ to a valid JSON file. If is for query only return prefix & display name.

        Paramaters:
            is_query (Bool): True, if sending to front end, default False.

        returns:
            Dict Representation of OBJ
        '''
        if is_query:
            return {"locationID": self.locationID,
                    "userID": self.userID,
                    "suburb": self.suburb}
        return {
            "locationID": self.locationID,
            "userID": self.userID,
            "suburb": self.suburb,
            "postcode": self.postCode
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

def create_userAddress(userID, suburb, postCode, addressLine1=None, addressLine2=None):
    created_userAddress = UserAddress()
    created_userAddress.userID = userID
    created_userAddress.suburb = suburb
    created_userAddress.postCode = postCode

    return created_userAddress

def JSONtoUserAddress(JSON):
    '''
    Function to convert JSON to UserAddress.

    Parameters:
        JSON (dict): dictonary/JSON object that references all columns in a UserAddress OBJECT

    Returns:
        created_user (User): Returns a valid UserAddress Object
    '''

    try:
        created_userAddress = UserAddress()
        created_userAddress.locationID = JSON["locationID"]
        created_userAddress.userID = JSON["userID"]
        created_userAddress.suburb = JSON["suburb"]
        created_userAddress.postCode = JSON["postCode"]
    except KeyError:
        return on_error(1, "JSON Missing Import Keys, Please confirm that all values are correct")

    return created_userAddress
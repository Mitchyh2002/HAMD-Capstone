import datetime

from Program import db
from Program.ResponseHandler import on_error


class Karma(db.Model):
    __tablename__ = "mst_karma"
    awardID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    karmaRecipient = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    karmaGiven = db.Column(db.Integer, nullable=False)
    modulePrefix = db.Column(db.String(3), db.ForeignKey('modules.prefix'), nullable=False)
    karmaReason = db.Column(db.String(200), nullable=False)
    karmaTimestamp = db.Column(db.DateTime, nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()


    def toJSON(self):
        return {
            "modulePrefix": self.modulePrefix,
            "Amount Given": self.karmaGiven,
            "Assigned To": self.karmaRecipient,
            "Reason": self.karmaReason,
            "Assigned At": self.karmaTimestamp
        }

def create_karma(userID,modulePrefix , karmaGiven, karmaReason):
    createdKarma = Karma()
    createdKarma.karmaRecipient = userID
    createdKarma.karmaGiven = karmaGiven
    createdKarma.modulePrefix = modulePrefix
    createdKarma.karmaReason = karmaReason
    createdKarma.karmaTimestamp = datetime.datetime.now()

    return createdKarma



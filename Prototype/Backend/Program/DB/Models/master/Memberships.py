from Program import db

class Membership(db.Model):
    __tablename__ = "memberships"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    membershipName = db.Column(db.String(25))
    permissionLevel = db.Column(db.Integer)
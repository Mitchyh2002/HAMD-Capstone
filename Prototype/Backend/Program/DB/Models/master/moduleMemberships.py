from Program import db

class moduleMemberships(db.Model):
    __tablename__ = "moduleMemberships"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    module_prefix = db.Column(db.String(3), db.ForeignKey('modules.prefix'))
    membership_id = db.Column(db.Integer, db.ForeignKey('memberships.id'))

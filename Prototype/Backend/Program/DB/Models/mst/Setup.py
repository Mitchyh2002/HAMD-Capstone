from Program import db, export_key
from Program.ResponseHandler import on_error, on_success

class mst_Setup(db.Model):
    __tablename__ = "mst_Setup"
    setupID = db.Column(db.Integer, primary_key=True)
    db_url = db.Column(db.String(2000))
    font1 = db.Column(db.String(2000))
    font2 = db.Column(db.String(2000))
    black = db.Column(db.String(7))
    white = db.Column(db.String(7))
    header = db.Column(db.String(7))
    navbar = db.Column(db.String(7))
    subnav = db.Column(db.String(7))

    def toJSON(self):
        return {
            "db_url": self.db_url,
            "font1": self.font1,
            "font2": self.font2,
            "black": self.black,
            "white": self.white,
            "header": self.header,
            "navbar": self.navbar,
            "subnav": self.subnav
        }
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def mergeConfig(self):
        ...
def JSONtoConfig(json):
    new_setup = mst_Setup()
    try:
        new_setup.db_url = json["db_url"]
        new_setup.font1 = json["font1"]
        new_setup.font2 = json["font2"]
        new_setup.black = json["black"]
        new_setup.white = json["white"]
        new_setup.header = json["header"]
        new_setup.navbar = json["navbar"]
        new_setup.subnav = json["subnav"]
        return new_setup

    except KeyError:
        return on_error(1, "JSON is missing configuration settings")
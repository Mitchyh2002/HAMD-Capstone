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
    terms = db.Column(db.String(1000))
    welcomeText = db.Column(db.String(200))
    websiteName = db.Column(db.String(200))
    logo = db.Column(db.String(200))
    landingImage = db.Column(db.String(200))
    loginImage = db.Column(db.String(200))

    def toJSON(self):
        return {
            "DatabaseURL": self.db_url,
            "font1": self.font1,
            "font2": self.font2,
            "black": self.black,
            "white": self.white,
            "header": self.header,
            "navbar": self.navbar,
            "subnav": self.subnav,
            "welcomeText": self.welcomeText,
            "terms": self.terms,
            "logo": self.logo,
            "landingImage": self.landingImage,
            "loginImage": self.loginImage,
            'websiteName': self.websiteName
        }
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def mergeConfig(self, json):
        new_config = self.toJSON()
        for key in json:
            new_config[key] = json[key]
        new_config = JSONtoConfig(new_config)
        if type(new_config) != mst_Setup:
            return new_config
        mst_Setup.query.delete()
        new_config.insert()

        return True

def JSONtoConfig(json):
    new_setup = mst_Setup()
    try:
        new_setup.setupID = 1
        new_setup.db_url = json["DatabaseURL"]
        new_setup.font1 = json["font1"]
        new_setup.font2 = json["font2"]
        new_setup.black = json["black"]
        new_setup.white = json["white"]
        new_setup.header = json["header"]
        new_setup.navbar = json["navbar"]
        new_setup.subnav = json["subnav"]
        new_setup.welcomeText = json["welcomeText"]
        new_setup.logo = json["logoImage"]
        new_setup.landingImage = json["landingImage"]
        new_setup.loginImage = json["loginImage"]
        new_setup.terms = json["terms"]
        new_setup.websiteName = json['websiteName']
        return new_setup

    except KeyError:
        return on_error(1, "JSON is missing configuration settings")
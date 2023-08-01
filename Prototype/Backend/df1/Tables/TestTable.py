from Program import db
 
 
class df1_quiz(db.Model):
	__tablename__ = 'df1_quiz'
	id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
	UserID = db.Column(db.Integer, unique=True)

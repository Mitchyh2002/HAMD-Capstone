from datetime import datetime, date
from flask import Blueprint, request, render_template, url_for
from flask_mail import Message
from flask_login import current_user, login_required
try:
    from sqlalchemy import Select
except ImportError:
    from sqlalchemy import select as Select

from itsdangerous import URLSafeTimedSerializer

from Program import db, export_key, export_mail, export_mail_sender
from Program.DB.Models.mst.User import export_salt, User
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('confirmation', __name__, url_prefix="/mst/confirm")

TESTING = True
email_salt = export_salt()

def generate_confirmation_token(email):
   serializer = URLSafeTimedSerializer(export_key())
   return serializer.dumps(email, salt=email_salt)

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(export_key())
    try:
        print(export_key())
        print(export_salt())
        email = serializer.loads(
            token,
            salt=email_salt,
            max_age=expiration
        )
    except:
        print("exception")
        return False
    return email

@blueprint.route('/<token>')
def confirm_email(token):
    email = confirm_token(token)
    try:
        if not email:
            return on_error(60, "The confirmation link is invalid or has expired.")
        
    except:
        pass

    user = QuerySelectUser(email)
    if user.confirmed:
        return on_error(61, "Account has already been confirmed. Please Login.")
    else:
        user.confirmed = True
        user.confirmedDate = date.today()
        db.session.add(user)
        db.session.commit()
        return on_success("You have successfully confirmed your account") 
    
@blueprint.route('/resend')
def resend_email():
    input = request.values
    inputEmail = input.get('email')
    user = QuerySelectUser(inputEmail)

    if type(user).__name__ == "user":
        if user.confirmed:
            return on_error(61, "Account has already been confirmed. Please Login")
        else:
            token = generate_confirmation_token(user.email)
            confirm_url = 'http://localhost:3000/Confirm/' + token
            html = render_template('activate.html', confirm_url=confirm_url)
            subject = "Please confirm your email"
            send_email(user.email, subject, html)
    else:
        return on_error(62, "Account is not valid")


def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=export_mail_sender()
    )
    mail = export_mail()
    mail.send(msg)

def QuerySelectUser(userKey: str, indicator=True):
    if indicator:
        stmt = Select(User).where(User.email == userKey)
    else:
        stmt = Select(User).where(User.phoneNumber == userKey)

    user = db.session.scalar(stmt)
    return user
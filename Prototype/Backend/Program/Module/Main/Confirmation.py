from datetime import datetime, date
from flask import Blueprint, request, render_template, url_for
from flask_mail import Message
from flask_login import current_user, login_required
from sqlalchemy import Select
from itsdangerous import URLSafeTimedSerializer

from Program import db, export_key, export_mail, export_mail_sender
from Program.DB.Models.master.User import export_salt, User
from Program.ResponseHandler import on_error, on_success

blueprint = Blueprint('confirmation', __name__, url_prefix="/confirm")

TESTING = True

def generate_confirmation_token(email):
   serializer = URLSafeTimedSerializer(export_key())
   return serializer.dumps(email, salt=export_salt())

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(export_key())
    try:
        email = serializer.loads(
            token,
            salt=export_salt(),
            max_age=expiration
        )
    except:
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
    
@blueprint.route('/unconfirmed')
def unconfirmed_account():
    if current_user.confirmed:
        return on_error(61, "Account has already been confirmed. Please Login")
    else:
        token = generate_confirmation_token(current_user.email)
        confirm_url = url_for('http://localhost:3000/Confirm/', token= token, _external=True)
        html = render_template('activate.html', confirm_url=confirm_url)
        subject = "Please confirm your email"
        send_email(current_user.email, subject, html)


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
from datetime import datetime
from flask import Blueprint, request, Flask
from flask_mail import Message
from flask_login import current_user, login_required
from sqlalchemy import select
from itsdangerous import URLSafeTimedSerializer

from Program import db, export_key, export_mail, export_mail_sender
from Program.DB.Models.mst.User import export_salt, User
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
@login_required
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return on_error(60, "The confirmation link is invalid or has expired.")

    user = QuerySelectUser(email)
    if user.confirmed:
        return on_error(61, "Account has already been confirmed. Please Login.")
    else:
        user.confirmed = True
        user.confirmedDate = datetime.now()
        db.session.add(user)
        db.session.commit()
        return on_success("You have successfully confirmed your account")


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
        stmt = select(User).where(User.email == userKey)
    else:
        stmt = select(User).where(User.phoneNumber == userKey)

    user = db.session.scalar(stmt)
    return user
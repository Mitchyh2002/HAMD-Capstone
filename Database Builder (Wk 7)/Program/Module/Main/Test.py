from flask import Blueprint, render_template, request, session, redirect, url_for

blueprint = Blueprint('fart', __name__)

def test():
    print("Hello World")
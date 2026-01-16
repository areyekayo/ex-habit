from flask_login import LoginManager
from flask import jsonify
from models import User
from config import app

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized_callback():
    return {'message': 'Unauthorized'}, 401


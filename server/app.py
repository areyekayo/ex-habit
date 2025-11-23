#!/usr/bin/env python3
from flask import request
from flask_restful import Resource

from config import app, db, api
from flask_login import login_user, login_required, current_user
from auth import login_manager

from models import User

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter(User.username == username).first()

        if not user or not user.authenticate(password):
            return {'errors': {'login': ['Invalid username or password']}}, 401
        
        if user.authenticate(password):
            login_user(user)
            return user.to_dict, 200


api.add_resource(Login, '/login')
if __name__ == '__main__':
    app.run(port=5555, debug=True)


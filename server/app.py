#!/usr/bin/env python3
from flask import request, make_response
from flask_restful import Resource
from config import app, db, api, ma
from flask_login import login_user, login_required, current_user, logout_user
from auth import login_manager
from models import User, Behavior

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
            login_user(user, remember=True)
            return make_response(user_schema.dump(user), 200)
        
class Logout(Resource):
    @login_required
    def delete(self):
        logout_user()
        return {'message': 'Logged out'}, 204
    
class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
    
    id = ma.auto_field()
    username = ma.auto_field()

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "login",
                values=dict(id="<id>"))
        }
    )

user_schema = UserSchema()

class BehaviorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Behavior
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    type = ma.auto_field()

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "behaviors",
                values=dict(id="<id>", name="<name>", description="<description>", type="<type>")
            )
        }
    )

behavior_schema = BehaviorSchema()
behaviors_schema = BehaviorSchema(many=True)

class Behaviors(Resource):
    def get(self):
        behaviors = Behavior.query.all()

        response = make_response(
            behaviors_schema.dump(behaviors), 200
        )

        return response




api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Behaviors, '/behaviors')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


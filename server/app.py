#!/usr/bin/env python3
from flask import request, make_response
from flask_restful import Resource
from config import app, db, api, ma
from flask_login import login_user, login_required, current_user, logout_user
from auth import login_manager
from models import User, Behavior, Trigger, Entry

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class EntrySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Entry
        load_instance = True
    
    id = ma.auto_field()
    description = ma.auto_field()
    created_timestamp = ma.auto_field()
    trigger_id = ma.auto_field()
    behavior_id = ma.auto_field()
    mood = ma.auto_field()
    reward = ma.auto_field()
    result = ma.auto_field()

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                'entries',
                values=dict(id="<id>")
            )
        }
    )

entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)
    
class TriggerSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Trigger
        load_instance = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    user_id = ma.auto_field()
    entries = ma.Nested(EntrySchema, many=True)

    url = ma.Hyperlinks(
        {
            "self": ma.URLFor(
                "triggers",
                values=dict(id="<id>")
            )
        }
    )

trigger_schema = TriggerSchema()
triggers_schema = TriggerSchema(many=True)    

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
    
    id = ma.auto_field()
    username = ma.auto_field()
    triggers = ma.Nested(TriggerSchema, many=True)

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
                values=dict(id="<id>")
            )
        }
    )

behavior_schema = BehaviorSchema()
behaviors_schema = BehaviorSchema(many=True)

class CurrentUser(Resource):
    @login_required
    def get(self):
        return user_schema.dump(current_user)

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

class Behaviors(Resource):
    def get(self):
        behaviors = Behavior.query.all()

        response = make_response(
            behaviors_schema.dump(behaviors), 200
        )

        return response
    
    @login_required
    def post(self):
        data = request.get_json()
        try:
            behavior = Behavior(
                name=data['name'],
                description=data['description'],
                type=data['type']
            )
            db.session.add(behavior)
            db.session.commit()
            return behavior_schema.dump(behavior), 201
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 400
        
class Triggers(Resource):
    @login_required
    def get(self):
        triggers = Trigger.query.all()
        response = make_response(triggers_schema.dump(triggers), 200)

        return response

class Entries(Resource):
    @login_required
    def get(self):
        entries = Entry.query.all()
        response = make_response(entries_schema.dump(entries), 200)
        return response



api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Behaviors, '/behaviors')
api.add_resource(CurrentUser, '/current_user')
api.add_resource(Triggers, '/triggers')
api.add_resource(Entries, '/entries')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


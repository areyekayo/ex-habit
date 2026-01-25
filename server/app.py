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

entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)

class BehaviorTriggerSchemaWithEntries(ma.SQLAlchemySchema):
    # Behavior > Trigger > Entries Schema
    class Meta:
        model = Trigger
        load_instance = True
    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    user_id = ma.auto_field()

    entries = ma.Method("get_entries_for_behavior")

    def get_entries_for_behavior(self, trigger_obj):
        # Get entries that match this trigger and its parent behavior from context. 
        behavior_obj = self.context.get("behavior")
        if not behavior_obj or not trigger_obj:
            return []
    
        filtered_entries = [e for e in trigger_obj.entries
                            if e.behavior_id == behavior_obj.id
                            and e.trigger_id == trigger_obj.id]
        return entries_schema.dump(filtered_entries)

class BehaviorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Behavior
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    type = ma.auto_field()
    triggers = ma.Method("get_nested_trigger_entries")

    def get_nested_trigger_entries(self, behavior_obj):
        # Function to retrieve triggers with entries that match the parent behavior
        if behavior_obj is None or behavior_obj.triggers is None:
            return []
        triggers = []
        for trigger in behavior_obj.triggers:
            if trigger is None:
                continue
            if trigger.user_id != current_user.id:
                continue
            # Instantiate nested triggers with entries schema, passing the behavior as context
            schema = BehaviorTriggerSchemaWithEntries(context={"behavior": behavior_obj})
            triggers.append(schema.dump(trigger))
        return triggers
    
behavior_schema = BehaviorSchema()
behaviors_schema = BehaviorSchema(many=True)

class TriggerBehaviorSchemaWithEntries(ma.SQLAlchemySchema):
    # Trigger > Behavior > Entries schema
    class Meta:
        model = Behavior
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    type = ma.auto_field()

    entries = ma.Method("get_entries_for_trigger")

    def get_entries_for_trigger(self, behavior_obj):
        # Gets entries that patch this behavior and its parent trigger from context. Current user should already match the trigger.
        trigger_obj = self.context.get("trigger")
        if not trigger_obj:
            return []
        if behavior_obj is None:
            return []
        filtered_entries = [e for e in behavior_obj.entries
                            if e.trigger_id == trigger_obj.id
                            and e.behavior.id == behavior_obj.id]
        return entries_schema.dump(filtered_entries)


class TriggerSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Trigger
        load_instance = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    user_id = ma.auto_field()
    behaviors = ma.Method("get_nested_behavior_entries")

    def get_nested_behavior_entries(self, trigger_obj):
        # Function to get behaviors that match the user and parent trigger
        if trigger_obj is None or trigger_obj.behaviors is None:
            return []
        behaviors = []
        for behavior in trigger_obj.behaviors:
            if behavior is None:
                continue
            # Instantiate nested behaviors with entries schema, passing trigger as context
            schema = TriggerBehaviorSchemaWithEntries(context={"trigger": trigger_obj})
            behaviors.append(schema.dump(behavior))
        return behaviors

trigger_schema = TriggerSchema()
triggers_schema = TriggerSchema(many=True)    

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
    
    id = ma.auto_field()
    username = ma.auto_field()
    triggers = ma.Nested(triggers_schema)
    behaviors = ma.Nested(BehaviorSchema, many=True, attribute="behaviors")

user_schema = UserSchema()

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

        return make_response(behaviors_schema.dump(behaviors), 200)
    
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
    def post(self):
        data = request.get_json()
        try:
            trigger = Trigger(
                name=data['name'],
                description=data['description'],
                user=current_user
            )
            db.session.add(trigger)
            db.session.commit()
            return trigger_schema.dump(trigger), 201
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 400
    
class Entries(Resource):
    @login_required
    def post(self):
        data = request.get_json()
        trigger_id = data.get('trigger')
        trigger = Trigger.query.get(trigger_id)
        if not trigger: return {'error': 'Trigger not found'}, 404
        behavior_id = data.get('behavior')
        behavior = Behavior.query.get(behavior_id)
        if not behavior: return {'error': 'Behavior not found'}, 404

        try:
            entry = Entry(
                description=data['description'],
                result=data['result'],
                reward=data['reward'],
                mood=data['mood'],
                trigger=trigger,
                behavior=behavior
            )
            db.session.add(entry)
            db.session.commit()
            return entry_schema.dump(entry), 201
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 400

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Behaviors, '/behaviors')
api.add_resource(CurrentUser, '/current_user')
api.add_resource(Triggers, '/triggers')
api.add_resource(Entries, '/entries')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
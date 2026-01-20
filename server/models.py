from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin
from sqlalchemy.orm import validates, contains_eager
from sqlalchemy import Enum

from config import db, bcrypt

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    triggers = db.relationship('Trigger', back_populates='user', cascade='all, delete-orphan')
    entries = association_proxy('triggers', 'entry', creator=lambda entry_obj: Trigger(entry=entry_obj))

    @property
    def behaviors(self):
        behaviors = set()
        for trigger in self.triggers:
            for entry in trigger.entries:
                if entry.user.id == self.id:
                    behaviors.add(entry.behavior)
        return list(behaviors)

    def __repr__(self):
        return f"<User '{self.username}', id: {self.id}>"
    
    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8')
        )
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8')
        )
    
class Behavior(db.Model):
    __tablename__ = "behaviors"

    BEHAVIOR_TYPES = ('Health', 'Productivity', 'Finance', 'Social')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    type = db.Column(Enum(*BEHAVIOR_TYPES, name="behavior_type_enum"))

    entries = db.relationship('Entry', back_populates='behavior', cascade='all, delete-orphan')
    triggers = association_proxy('entries', 'trigger', creator=lambda entry_obj: Trigger(entry=entry_obj))

    def __repr__(self):
        return f"<Behavior '{self.name}', id: {self.id}, type: {self.type}, {self.description}, entries: {self.entries}"
    
    @validates('name')
    def validate_name(self, key, name):
        if not (5 <= len(name) <= 100):
            raise ValueError("Name must be between 5 and 100 characters")
        return name
    
class Trigger(db.Model):
    __tablename__ = "triggers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='triggers')
    entries = db.relationship('Entry', back_populates='trigger', cascade='all, delete-orphan')
    behaviors = association_proxy('entries', 'behavior', creator=lambda entry_obj: Behavior(entry=entry_obj))



    def __repr__(self):
        return f"<Trigger '{self.name}', id: {self.id}, description: {self.description}, user_id: {self.user_id}"
    
    @validates('name')
    def validate_name(self, key, name):
        if not (5 <= len(name) <= 100):
            raise ValueError("Name must be between 5 and 100 characters")
        return name

class Entry(db.Model):
    __tablename__ = "entries"

    MOODS = ('Struggling', 'Bad', 'Okay', 'Good', 'Great')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    created_timestamp = db.Column(db.DateTime, server_default=db.func.now())
    reward = db.Column(db.String)
    result = db.Column(db.String)
    mood = db.Column(Enum(*MOODS, name='mood_enum'))

    trigger_id = db.Column(db.Integer, db.ForeignKey('triggers.id'))
    behavior_id = db.Column(db.Integer, db.ForeignKey('behaviors.id'))

    trigger = db.relationship('Trigger', back_populates='entries')
    behavior = db.relationship('Behavior', back_populates='entries')
    user = association_proxy('trigger', 'user', creator=lambda user_obj: Trigger(user=user_obj))

    def __repr__(self):
        return f"<Entry id: {self.id}, {self.created_timestamp}, trigger: {self.trigger.name}, behavior: {self.behavior.name}, user: {self.user.username}"

    @validates('description')
    def validate_description(self, key, description):
        if not (5 <= len(description) <= 500):
            raise ValueError("Description must be between 5 and 500 characters")
        return description
    
    @validates('mood')
    def validate_mood(self, key, mood):
        if mood not in self.MOODS:
            raise ValueError("Mood is invalid value")
        return mood


    





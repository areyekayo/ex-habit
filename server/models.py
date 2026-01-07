from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin
from sqlalchemy.orm import validates

from config import db, bcrypt

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

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

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    type = db.Column(db.String)

    def __repr__(self):
        return f"<Behavior '{self.name}', id: {self.id}, type: {self.type}, {self.description}"
    
    @validates('name')
    def validate_name(self, key, name):
        if not (5 <= len(name) <= 100):
            raise ValueError("Name must be between 5 and 100 characters")
        return name
    






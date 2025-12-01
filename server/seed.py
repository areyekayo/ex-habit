#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Deleting data...")
        User.query.delete()

        print("Creating users...")

        riko = User(username="riko")
        sam = User(username="sam")
        alex = User(username="alex")
        steph = User(username="steph")
        newbie = User(username="newbie")
        
        riko.password_hash = riko.username + 'password'
        sam.password_hash = sam.username + 'password'
        alex.password_hash = alex.username + 'password'
        steph.password_hash = steph.username + 'password'
        newbie.password_hash = newbie.username + 'password'
        users = [riko, sam, alex, steph, newbie]

        db.session.add_all(users)
        db.session.commit()
        print("Seeding done!")


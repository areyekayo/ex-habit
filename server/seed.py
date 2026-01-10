#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User, Behavior

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Deleting data...")
        User.query.delete()
        Behavior.query.delete()

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

        print("Creating behaviors...")
        drinking = Behavior(name="Drinking Alcohol", type="Health", description=fake.sentence())
        smoking = Behavior(name="Smoking", type="Health", description=fake.sentence())
        nail_biting = Behavior(name="Nail Biting", type="Health", description=fake.sentence())
        screen_time = Behavior(name="Screen Time", type="Productivity", description=fake.sentence())
        shopping = Behavior(name="Shopping", type="Finance", description=fake.sentence())
        
        behaviors = [drinking, smoking, nail_biting, screen_time, shopping]



        db.session.add_all(users)
        db.session.add_all(behaviors)
        db.session.commit()
        print("Seeding done!")
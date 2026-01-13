#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User, Behavior, Trigger

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Deleting data...")
        User.query.delete()
        Behavior.query.delete()
        Trigger.query.delete()

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
        over_eating = Behavior(name="Over Eating", type="Health", description=fake.sentence())
        
        behaviors = [drinking, smoking, nail_biting, screen_time, shopping]

        print("Creating triggers...")
        boredom = Trigger(name="Boredom", description=fake.sentence(), user=riko)
        work_stress = Trigger(name="Work Stress", description=fake.sentence(), user=riko)
        father = Trigger(name="My father", description=fake.sentence(), user=riko)
        free_time = Trigger(name="Free Time", description=fake.sentence(), user=sam)
        loud_noises = Trigger(name="Loud Noises", description=fake.sentence(), user=sam)
        neighbor = Trigger(name="Neighbor plays loud music", description=fake.sentence(), user=alex)
        going_out = Trigger(name="Going out with friends", description=fake.sentence(), user=steph)
        boss = Trigger(name="My boss micromanaging me", description=fake.sentence(), user=steph)

        triggers = [boredom, work_stress, father, free_time, loud_noises, neighbor, going_out, boss]


        db.session.add_all(users)
        db.session.add_all(behaviors)
        db.session.add_all(triggers)
        db.session.commit()
        print("Seeding done!")
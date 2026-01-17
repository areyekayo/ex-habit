#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User, Behavior, Trigger, Entry

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Deleting data...")
        User.query.delete()
        Behavior.query.delete()
        Trigger.query.delete()
        Entry.query.delete()


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
        argument = Behavior(name="Argument", type="Social", description=fake.sentence())
        
        behaviors = [drinking, smoking, nail_biting, screen_time, shopping, argument]

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

        print("Creating entries...")
        entry1 = Entry(description=fake.sentence(), reward="Destressed", result="Wasted time", mood="Okay", trigger=boredom, behavior=screen_time)
        entry2 = Entry(trigger=work_stress, behavior=drinking, description=fake.sentence(), reward="Feel relieved", result="Hangover", mood="Bad")
        entry3= Entry(trigger=father, behavior=argument, description=fake.sentence(), reward="Nothing", result="I'm upset", mood="Struggling")
        entry4= Entry(trigger=free_time, behavior=screen_time, mood="Good", description=fake.sentence(), reward="Feel relieved", result="I didn't get anything done")
        entry5 = Entry(trigger=loud_noises, behavior=nail_biting, mood="Bad", description=fake.sentence(), reward="None", result="I'm annoyed")
        entry6 = Entry(trigger=neighbor, behavior=argument, description=fake.sentence(), reward="None", result="Both of us are upset", mood="Bad")
        entry7 = Entry(trigger=boss, behavior=smoking, mood="Okay", description=fake.sentence(), reward="I got away from my boss", result="My throat hurts and I smell like cigarettes")
        entry8 = Entry(trigger=going_out, behavior=drinking, description=fake.sentence(), reward="I had fun with my friends", result="Hangover", mood="Bad")

        entries = [entry1, entry2, entry3, entry4, entry5, entry6, entry7, entry8]


        db.session.add_all(users)
        db.session.add_all(behaviors)
        db.session.add_all(triggers)
        db.session.add_all(entries)
        db.session.commit()
        print("Seeding done!")
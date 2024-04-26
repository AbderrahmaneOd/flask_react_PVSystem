from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
users_collection = db['users']
counters_collection = db['counters']


class User:
    def __init__(self, username, password, firstName, lastName, phone, email, created_at=None, roles=None):
        self.username = username
        self.password = password
        self.roles = roles if roles else ["researcher"]
        self.firstName = firstName
        self.lastName = lastName
        self.phone = phone
        self.email = email
        self.created_at = created_at if created_at else datetime.now().strftime("%d-%m-%Y")

    def save(self):
        user_id = self.get_next_sequence_value('user_id')
        users_collection.insert_one({
            '_id': user_id,
            'username': self.username,
            'password': self.password,
            'roles': self.roles,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'phone': self.phone,
            'email': self.email,
            'created_at': self.created_at
        })

    


    @staticmethod
    def find_by_username(username):
        user_data = users_collection.find_one({'username': username})
        if user_data:
            return User(user_data['username'], user_data['password'], user_data['roles'])
        return None

    @staticmethod
    def get_next_sequence_value(sequence_name):
        sequence_document = counters_collection.find_one_and_update(
            {'_id': sequence_name},
            {'$inc': {'sequence_value': 1}},
            upsert=True,
            return_document=True
        )
        return sequence_document['sequence_value']

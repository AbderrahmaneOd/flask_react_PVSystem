from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
users_collection = db['users']

class User:
    def __init__(self, username, password, firstName, lastName, phone, email, roles=None):
        self.username = username
        self.password = password
        self.roles = roles if roles else ["researcher"]
        self.firstName = firstName
        self.lastName = lastName
        self.phone = phone
        self.email = email

    def save(self):
        users_collection.insert_one({
            'username': self.username,
            'password': self.password,
            'roles': self.roles,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'phone': self.phone,
            'email': self.email
        })

    @staticmethod
    def find_by_username(username):
        user_data = users_collection.find_one({'username': username})
        if user_data:
            return User(user_data['username'], user_data['password'], user_data['roles'])
        return None

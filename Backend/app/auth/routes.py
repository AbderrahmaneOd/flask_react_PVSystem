from app.auth import bp
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
users_collection = db['users']

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    roles = data.get('roles', ["researcher"])  # Default roles to researcher if not provided

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(password)
    
    # Create User
    new_user = User(
        username=username,
        password=hashed_password,
        roles=roles,
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        phone=data.get('phone'),
        email=data.get('email')
    )
    new_user.save()
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=username)

    # Construct the response manually
    response = {
        "access_token": access_token,
        "username": user['username'],
        "roles": user['roles']
    }

    return jsonify(response), 200

@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    user_roles = user['roles']
    return jsonify(logged_in_as=current_user, roles=user_roles), 200

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        user = users_collection.find_one({'username': current_user})
        if 'admin' not in user['roles']:
            return jsonify({'message': 'Admin role required'}), 403
        return fn(*args, **kwargs)
    return wrapper

@bp.route('/admin-protected', methods=['GET'])
@admin_required
def admin_protected():
    return jsonify(message='This is an admin protected endpoint'), 200
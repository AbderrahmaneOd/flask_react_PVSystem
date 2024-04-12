from app.upload import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
from io import StringIO
from bson import ObjectId 
import csv
from datetime import datetime, timedelta

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
files_collection = db['files']


@bp.route('/files', methods=['POST'])
def get_files():
    # Get the username from the request data
    data = request.get_json()
    username = data.get('username')
    
    # Retrieve data from MongoDB
    cursor = files_collection.find({'username': username}, {'_id' : 0, 'username' : 0 })
    files_data = list(cursor)  # Convert cursor to a list of dictionaries

    # Return the data in JSON format
    return jsonify(files_data)



@bp.route('/delete', methods=['GET'])
def delete_files():
    files_collection.delete_many({})
    return jsonify({'message': 'Data deleted in MongoDB'})



@bp.route('/upload', methods=['POST'])
def upload_test():
    # Get the uploaded file
    uploaded_file = request.files['file']
    
    # Get the username from the request data
    username = request.form['username']
    
    # Read the uploaded CSV file into a pandas DataFrame
    df = pd.read_csv(uploaded_file)

    # Drop the first column (Unnamed column)
    df = df.iloc[:, 1:]

    # Add the username column to the DataFrame
    df['username'] = username

    # Convert DataFrame to list of dictionaries
    data = df.to_dict(orient='records')

    # Insert data into MongoDB
    files_collection.insert_many(data)

    return jsonify({'message': 'Data stored in MongoDB'})
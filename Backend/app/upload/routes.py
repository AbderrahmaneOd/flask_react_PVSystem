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

@bp.route('/v2/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']

    if file.filename == '':
        return 'No selected file', 400

    # Save the uploaded file to a location
    # For example, to save in the current directory with the same name
    # file.save(file.filename)

    # Read CSV data from the request
    csv_data = file.stream.read().decode("utf-8")  # Read data from file stream
    csv_stream = StringIO(csv_data)  # Convert to StringIO object for pandas

     # Convert CSV to JSON
    csv_data = pd.read_csv(csv_stream)

    # Fill missing values with 0
    #csv_data.fillna(0, inplace=True)

    
    json_data = csv_data.to_dict(orient='records')

    # Replace ObjectId objects with their string representation
    for record in json_data:
        for key, value in record.items():
            if isinstance(value, ObjectId):
                record[key] = str(value)

    # Insert JSON data into MongoDB
    files_collection.insert_many(json_data)

    # Return success message with inserted IDs
    return jsonify({'message': 'Data stored in MongoDB'})

@bp.route('/upload', methods=['POST'])
def upload_csv():

    if 'file' not in request.files:
        return 'No file part', 400
    
    file = request.files['file']

    if file.filename == '':
        return 'No selected file', 400
    
    df = pd.read_csv(file)

    # Drop the first column
    df = df.iloc[:, 1:]
    
    # Calculate percentage of NaN values in each column
    nan_percentages = df.isna().mean() * 100
    
    # Convert NaN percentages to dictionary
    nan_percentages_dict = nan_percentages.to_dict()

    # Fill missing values with 0
    df.fillna(0, inplace=True)

    # Convert DataFrame to list of dictionaries
    data = df.to_dict(orient='records')

    # Insert data into MongoDB
    files_collection.insert_many(data)
    
    return jsonify(nan_percentages_dict)


@bp.route('/files', methods=['POST'])
def get_files():
    # Get the username from the request data
    data = request.get_json()
    username = data.get('username')
    
    # Retrieve data from MongoDB
    cursor = files_collection.find({'username': username}, {'_id' : 0, 'Wind_Speed': 0, 'username' : 0 })
    files_data = list(cursor)  # Convert cursor to a list of dictionaries

    # Return the data in JSON format
    return jsonify(files_data)



@bp.route('/delete', methods=['GET'])
def delete_files():
    files_collection.delete_many({})
    return jsonify({'message': 'Data deleted in MongoDB'})



@bp.route('/test-up', methods=['POST'])
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

@bp.route('/NaNvalue')
def delete_NaN():
    # Retrieve all documents in the collection
    cursor = files_collection.find({})

    # Convert cursor to a list of dictionaries
    files_data = list(cursor)

    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(files_data)

    # Calculate percentage of NaN values in each column
    nan_percentages = df.isna().mean() * 100
    
    # Convert NaN percentages to dictionary
    nan_percentages_dict = nan_percentages.to_dict()

    # Fill missing values with 0
    #df.fillna(0, inplace=True)

    # Convert DataFrame to list of dictionaries
    #data = df.to_dict(orient='records')

    # Replace the entire collection with the new data
   # files_collection.delete_many({})  # Remove existing documents
    #files_collection.insert_many(data)  # Insert updated documents

    # Return the data in JSON format
    return jsonify(nan_percentages_dict)
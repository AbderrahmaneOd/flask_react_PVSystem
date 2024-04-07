from app.upload import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
from io import StringIO
from bson import ObjectId 
import csv

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
    csv_data.fillna(0, inplace=True)

    
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


@bp.route('/files', methods=['GET'])
def get_files():
    # Retrieve data from MongoDB
    cursor = files_collection.find({})  # Retrieve all documents in the collection
    files_data = list(cursor)  # Convert cursor to a list of dictionaries
    
    # Convert ObjectId objects to string representation
    for file_data in files_data:
        file_data['_id'] = str(file_data['_id'])

    # Return the data in JSON format
    return jsonify(files_data)


from datetime import datetime, timedelta

@bp.route('/files', methods=['GET'])
def get_files_period():
    # Retrieve period from query parameter
    selected_period = request.args.get('period')
    
    # Define the query based on the selected period
    if selected_period:
        if selected_period.endswith('d'):  # day
            period = int(selected_period[:-1])
            start_date = datetime.now() - timedelta(days=period)
            query = {'timestamp': {'$gte': start_date}}
        elif selected_period.endswith('m'):  # month
            period = int(selected_period[:-1])
            start_date = datetime.now() - timedelta(days=30*period)
            query = {'timestamp': {'$gte': start_date}}
        elif selected_period.endswith('y'):  # year
            period = int(selected_period[:-1])
            start_date = datetime.now() - timedelta(days=365*period)
            query = {'timestamp': {'$gte': start_date}}
        else:
            return 'Invalid period format. Use d for day, m for month, or y for year', 400
    else:
        query = {}

    # Retrieve data from MongoDB based on the query
    cursor = files_collection.find(query)
    files_data = list(cursor)

    # Convert ObjectId objects to string representation
    for file_data in files_data:
        file_data['_id'] = str(file_data['_id'])

    # Return the data in JSON format
    return jsonify(files_data)
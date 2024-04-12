from app.preprocessing import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
from io import StringIO
from bson import ObjectId 
import csv
from datetime import datetime, timedelta
import numpy as np

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
files_collection = db['files']

@bp.route('/outliers', methods=['GET'])
def get_outliers():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {
        '_id': 0,
        'Weather_Temperature_Celsius': 1,
        'Weather_Relative_Humidity': 1,
        'Global_Horizontal_Radiation': 1,
        'Weather_Daily_Rainfall': 1
        })

    # Convert cursor to a list of dictionaries
    files_data = list(cursor) 
    
    # Initialize dictionary to hold statistical values and outliers
    statistics = {
        "Weather_Temperature_Celsius": {"min": None, "q1": None, "median": None, "q3": None, "max": None, "outliers": []},
        "Weather_Relative_Humidity": {"min": None, "q1": None, "median": None, "q3": None, "max": None, "outliers": []},
        "Global_Horizontal_Radiation": {"min": None, "q1": None, "median": None, "q3": None, "max": None, "outliers": []},
        "Weather_Daily_Rainfall": {"min": None, "q1": None, "median": None, "q3": None, "max": None, "outliers": []}
    }
    

    # Extract values for each field and append to the statistics dictionary
    for file_data in files_data:
        for field, value in file_data.items():
            if field in statistics:  # Only process relevant weather fields
                statistics[field]["min"] = min(value, statistics[field]["min"]) if statistics[field]["min"] is not None else value
                statistics[field]["q1"] = np.percentile(value, 25) if statistics[field]["q1"] is not None else value
                statistics[field]["median"] = np.median(value) if statistics[field]["median"] is not None else value
                statistics[field]["q3"] = np.percentile(value, 75) if statistics[field]["q3"] is not None else value
                statistics[field]["max"] = max(value, statistics[field]["max"]) if statistics[field]["max"] is not None else value

    # Calculate outliers for each field
    for field, values in statistics.items():
        if values["min"] is not None and values["max"] is not None:
            lower_bound = values["q1"] - 1.5 * (values["q3"] - values["q1"])
            upper_bound = values["q3"] + 1.5 * (values["q3"] - values["q1"])
            # Filter data points for the current field
            field_values = [file_data[field] for file_data in files_data if field in file_data]
            outliers = [value for value in field_values if value < lower_bound or value > upper_bound]
            statistics[field]["outliers"] = outliers

    
    # Return the statistical values in JSON format
    return jsonify(statistics)


@bp.route('/NaNvalue')
def delete_NaN():
    # Retrieve all documents in the collection
    cursor = files_collection.find({}, {'_id': 0})

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

@bp.route('/process-nanvalues', methods=['POST'])
def process_nanvalues():
    try:
        # Receive data from the frontend
        nan_values = request.json

        print(nan_values)

        # Retrieve all documents in the collection
        cursor = files_collection.find({})

        # Convert cursor to a list of dictionaries
        files_data = list(cursor)

        # Convert the list of dictionaries to a DataFrame
        df = pd.DataFrame(files_data)

        # Fill missing values with user input value for each column
        for column, value in nan_values.items():
            df[column].fillna(value, inplace=True)

        # Update MongoDB collection with the modified DataFrame
        for index, row in df.iterrows():
            files_collection.update_one({'_id': row['_id']}, {'$set': row.to_dict()}, upsert=False)

        return jsonify({'message': 'NaN values processed successfully.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
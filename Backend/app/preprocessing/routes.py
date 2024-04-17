from app.preprocessing import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
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

    fields_to_retrieve = [
        'Weather_Temperature_Celsius',
        'Weather_Relative_Humidity',
        'Global_Horizontal_Radiation',
        'Weather_Daily_Rainfall'
    ]

    # Extract values for each field and calculate statistics
    for field in fields_to_retrieve:
        values = [file_data[field] for file_data in files_data if field in file_data]
        statistics[field] = calculate_statistics(values)

         # Identify outliers based on quartiles
        q1 = statistics[field]["q1"]
        q3 = statistics[field]["q3"]
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        #print(lower_bound)
        #print(upper_bound)
        outliers = [value for value in values if value < lower_bound or value > upper_bound]
        #print(outliers)
        statistics[field]["outliers"] = outliers
        

    
    # Return the statistical values in JSON format
    return jsonify(statistics)

def calculate_statistics(data):
    # Sort the data
    sorted_data = sorted(data)

    # Calculate quartiles
    q1 = np.percentile(sorted_data, 25)
    q3 = np.percentile(sorted_data, 75)
    median = np.median(sorted_data)

    # Calculate min and max
    minimum = min(sorted_data)
    maximum = max(sorted_data)

    return {
        "min": minimum,
        "max": maximum,
        "q1": q1,
        "q3": q3,
        "median": median,
    }

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

        #print(nan_values)

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
    
@bp.route('/statistics', methods=['GET'])
def get_statistics():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {
        '_id': 0,
        'username': 0,
        'manuf': 0,
        'technology': 0,
        'Timestamp': 0,
        'support': 0,
        'track': 0,
        })

    # Convert cursor to a list of dictionaries
    files_data = list(cursor) 
    
    # Initialize dictionary to hold statistical values and outliers
    statistics = {}

    fields_to_retrieve = [
        'Weather_Temperature_Celsius',
        'Weather_Relative_Humidity',
        'Global_Horizontal_Radiation',
        'Weather_Daily_Rainfall',
        'Active_Power',
        'Diffuse_Horizontal_Radiation',
    ]

    # Extract all numeric fields
    numeric_fields = []
    for file_data in files_data:
        for key, value in file_data.items():
            if isinstance(value, (int, float)) and key not in numeric_fields:
                numeric_fields.append(key)

    #print(numeric_fields)
    
    # Extract values for each field and calculate statistics
    for field in fields_to_retrieve:
        values = [file_data[field] for file_data in files_data if field in file_data]
        statistics[field] = calculate_statistics_v2(values)
        

    # Return the statistical values in JSON format
    return jsonify(statistics)

def calculate_statistics_v2(data):
    # Sort the data
    sorted_data = sorted(data)

    # Calculate quartiles
    q1 = np.percentile(sorted_data, 25)
    q3 = np.percentile(sorted_data, 75)

    # Calculate mean and median
    mean = np.mean(sorted_data)
    median = np.median(sorted_data)

    # Calculate min and max
    minimum = min(sorted_data)
    maximum = max(sorted_data)

    # Calculate standard deviation and variance
    std_deviation = np.std(sorted_data)
    variance = np.var(sorted_data)

    # Calculate interquartile range (IQR)
    iqr = q3 - q1

    return {
        "Min": minimum,
        "Max": maximum,
        "Q1": q1,
        "Q3": q3,
        "Median": median,
        "Mean": mean,
        "Standard deviation": std_deviation,
        "Variance": variance,
        "IQR": iqr
    }


@bp.route('/columns', methods=['GET'])
def get_columns():
    # Retrieve a document from the collection
    document = files_collection.find_one({}, {'_id' : 0, 'username' : 0})

    if document:
        # Extract the keys (column names) from the document
        columns = list(document.keys())
        return jsonify({'columns': columns}), 200
    else:
        return jsonify({'error': 'No documents found in the collection'}), 404
    
@bp.route('/delete/columns', methods=['POST'])
def delete_columns():
    # Expect column names to be sent in the request body as a JSON array
    columns_to_delete = request.json.get('columns', [])

    #print(columns_to_delete)

    if not columns_to_delete:
        return jsonify({'error': 'No columns specified for deletion'}), 400

    try:
        # Construct $unset operator object to delete specified columns
        unset_columns = {column: True for column in columns_to_delete}
        
        # Update all documents in the collection to unset (delete) the specified columns
        result = files_collection.update_many({}, {'$unset': unset_columns}, upsert=False)

        deleted_columns_count = result.modified_count

        return jsonify({'message': 'Columns deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


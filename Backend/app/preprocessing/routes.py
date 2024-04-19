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
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a list of dictionaries
    files_data = list(cursor)

    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(files_data)

    # Select numerical columns
    df = df.select_dtypes(include=['number'])

    # Calculate percentage of NaN values in each column
    nan_percentages = df.isna().mean() * 100
    
    # Convert NaN percentages to dictionary
    nan_percentages_dict = nan_percentages.to_dict()

    # Return the data in JSON format
    return jsonify(nan_percentages_dict)
    
@bp.route('/process/nanvalues', methods=['POST'])
def process_NaNvalues():
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

        # Handle NaN values based on user input fill methods
        for column, method in nan_values.items():
            if method == 'mean':
                df[column].fillna(df[column].mean(), inplace=True)
            elif method == 'median':
                df[column].fillna(df[column].median(), inplace=True)
            elif method == 'mode':
                df[column].fillna(df[column].mode()[0], inplace=True)
            elif method == 'forwardFill':
                df[column].fillna(method='ffill', inplace=True)
            elif method == 'backwardFill':
                df[column].fillna(method='bfill', inplace=True)
            elif method == 'deleteRow':
                df.dropna(subset=[column], inplace=True)
            elif method == 'deleteColumn':
                df.drop(columns=[column], inplace=True)
            else:  # For numerical constant values
                value = float(method)
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


@bp.route('/detect_missing_rows', methods=['GET'])
def detect_missing_rows():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))
    
    # Perform missing rows detection
    missing_rows = detect_missing_rows(df)

    # Convert DataFrame to JSON and return
    return missing_rows.to_json(orient='records')


def create_datetime_index(df):
    # Combine Year, Month, Day, Hour, and Minute columns into a single datetime column
    df['Timestamp'] = pd.to_datetime(df['Timestamp'], format='%Y-%m-%d %H:%M:%S')
    # Set the new datetime column as the index
    df.set_index('Timestamp', inplace=True)
    return df

def detect_missing_rows(df):
    df = create_datetime_index(df)
    all_missing_rows = pd.DataFrame(columns=['Year', 'Month', 'Day', 'Hour', 'Minute', 'version'])
    for vr in (df['version'].unique()):
        df_ver = df[df['version'] == vr]
        start_date = df_ver.index.min()
        end_date = df_ver.index.max()
        full_date_range = pd.date_range(start=start_date, end=end_date, freq='5T')
        full_df = pd.DataFrame(index=full_date_range)
        merged_df = full_df.merge(df_ver, left_index=True, right_index=True, how='left', indicator=True)
        missing_rows = merged_df[merged_df['_merge'] == 'left_only']
        missing_rows['Year'] = missing_rows.index.year
        missing_rows['Month'] = missing_rows.index.month
        missing_rows['Day'] = missing_rows.index.day
        missing_rows['Hour'] = missing_rows.index.hour
        missing_rows['Minute'] = missing_rows.index.minute
        missing_rows['version'] = vr
        missing_rows = missing_rows[['Year', 'Month', 'Day', 'Hour', 'Minute', 'version']]
        all_missing_rows = pd.concat([all_missing_rows, missing_rows])
    return all_missing_rows

@bp.route('/correlation', methods=['GET'])
def correlation():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Select numerical columns
    numerical_columns = df.select_dtypes(include=['number']).columns

    # Subset DataFrame to numerical columns
    df_num = df[numerical_columns]

    # Calculate correlation matrix
    correlation_matrix = df_num.corr()

    # Get feature names
    feature_names = correlation_matrix.index.tolist()

    # Initialize lists for z, x, and y
    z = []
    x = feature_names
    y = feature_names

    # Populate z list with correlation values
    for feature1 in feature_names:
        row = []
        for feature2 in feature_names:
            correlation_value = correlation_matrix.loc[feature1, feature2]
            if np.isnan(correlation_value):  # Check if value is NaN
                row.append(None)  # Replace NaN with null
            else:
                row.append(correlation_value)
        z.append(row)

    # Prepare the data for heatmap
    heatmap_data = {'z': z, 'x': x, 'y': y}

    return jsonify(heatmap_data)


@bp.route('/correlation/bar')
def correlation_data():

    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))
    
    # Select numerical columns
    df = df.select_dtypes(include=['number'])
    
    # Calculate correlation with Active_Power
    corr_with_Power = df.corr()["Active_Power"].sort_values(ascending=False)
    
    # Drop Active_Power from correlations
    corr_with_Power = corr_with_Power.drop("Active_Power")

    # Replace NaN values with 0
    corr_with_Power = corr_with_Power.fillna(0)
    
    # Prepare data for Chart.js
    labels = corr_with_Power.index.tolist()
    values = corr_with_Power.values.tolist()
    
    chart_data = {
        'labels': labels,
        'values': values
    }
    
    return jsonify(chart_data)
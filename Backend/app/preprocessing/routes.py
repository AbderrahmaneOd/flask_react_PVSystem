from app.preprocessing import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder
from ENSAJ_MultiOutliersDetection import  detect_outliers

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
                # Sort the data before using median
                df.sort_values(by=[column], inplace=True)
                df[column].fillna(df[column].median(), inplace=True)
            elif method == 'mode':
                # Sort the data before using median
                df.sort_values(by=[column], inplace=True)
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

    # Calculate count of non-null values
    count = len([value for value in data])

    return {
        "Count": count,
        "Min": minimum,
        "Q1": q1,
        "Q3": q3,
        "IQR": iqr,
        "Max": maximum,
        "Median": median,
        "Mean": mean,
        "Standard deviation": std_deviation,
        "Variance": variance,
    }

    
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

@bp.route('/data/type')
def get_data_type():
    try:
        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {'_id': 0, 'username': 0})

        # Convert cursor to a DataFrame
        df = pd.DataFrame(list(cursor))

        # Get data types of columns and convert to a dictionary
        data_types = {column: str(dtype) for column, dtype in df.dtypes.items()}

        return jsonify(data_types), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@bp.route('/process/missing-rows', methods=['POST'])
def process_missing_rows():
    try:
        data = request.json 
        
        # Filter out rows with empty action
        data = [item for item in data if item['action']]
        
        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {'_id': 0, 'username': 0})

        # Convert cursor to a DataFrame
        df = pd.DataFrame(list(cursor))
        
        # Convert 'Timestamp' column to datetime
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        
        # Write initial DataFrame to CSV for debugging
        # df.to_csv('initial_data.csv', sep=',', header=True, index=False)
        
        for item in data:
            timestamp = pd.to_datetime(item['timestamp'])  # Convert timestamp to datetime
            version = item['version']
            action = item['action']
            
            # Create temporary Series for efficient timestamp addition
            new_row = pd.DataFrame({'Timestamp': [timestamp], 'version': [version]})

            # Concatenate the Series with the DataFrame (consider inplace=True for efficiency)
            df = pd.concat([new_row, df], ignore_index=True)
            
            #print(new_row)
            
            # Sort DataFrame by 'Timestamp' column
            df.sort_values(by='Timestamp', inplace=True)
            
            # Perform action based on the action value
            if action == 'forwardFill':
                # Forward fill action
                df.fillna(method='ffill', inplace=True)
                #print(f"Forward fill action performed for timestamp: {timestamp}")
            elif action == 'backwardFill':
                # Backward fill action
                df.fillna(method='bfill', inplace=True)
                #print(f"Backward fill action performed for timestamp: {timestamp}")
            else:
                print(f"Unknown action: {action}")
        
        # Iterate through DataFrame to insert new documents into MongoDB
        for index, row in df.iterrows():            
            for item in data:
                if row['Timestamp'] == pd.to_datetime(item['timestamp']):
                    # Convert timestamp to string format
                    row['Timestamp'] = str(row['Timestamp'])
                    files_collection.insert_one(row.to_dict())
                    #print(row.to_dict())
        
        # Write final DataFrame to CSV for debugging
        # df.to_csv('final_data.csv', sep=',', header=True, index=False)

        return jsonify({'message': 'Data processed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@bp.route('/process/normalization', methods=['POST'])
def process_column_normalization():
    try:
        data = request.json 

        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {'_id': 0, 'username': 0})
        df = pd.DataFrame(list(cursor))

        # Check if data and normalization strategy are provided
        if 'selectedColumn' not in data or 'normalizationStrategy' not in data:
            return jsonify({'error': 'selectedColumn and normalizationStrategy are required.'}), 400

        # Check if selected column exists in the DataFrame
        selected_column = data['selectedColumn']
        if selected_column not in df.columns:
            return jsonify({'error': f'Column "{selected_column}" does not exist in the dataset.'}), 400

        # Apply normalization based on the selected strategy
        normalization_strategy = data['normalizationStrategy']

        scaler = None  # Default value
        if normalization_strategy == 'manualNormalization':
            # Check if manual normalization expression is provided
            if 'manualExpression' not in data:
                return jsonify({'error': 'manualExpression is required for manual normalization.'}), 400
            
            # Get the manual normalization expression
            manual_expression = data['manualExpression']
            
            # Extract the operator and constant from the expression (assuming simple format)
            operator, constant_str = manual_expression.split(' ')
            constant = float(constant_str)

            # Apply the operation based on the extracted operator
            if operator == '*':
                df[selected_column] = df[selected_column] * constant
            elif operator == '/':
                df[selected_column] = df[selected_column] / constant
            else:
                return jsonify({'error': 'Invalid operator in manualExpression. Only "*" and "/" are allowed.'}), 400

        elif normalization_strategy == 'standardScaler':
            scaler = StandardScaler()
        elif normalization_strategy == 'minMaxScaler':
            scaler = MinMaxScaler()
        
        if scaler is not None:
            df[selected_column] = scaler.fit_transform(df[selected_column].values.reshape(-1, 1)).flatten()

        
        # Loop through each row of the DataFrame
        for index, row in df.iterrows():
            # Extract the normalized value for the selected column
            normalized_value = row[selected_column]

            # Update the specific document in MongoDB
            files_collection.update_one(
                {'Timestamp': row['Timestamp']}, 
                {'$set': {selected_column: normalized_value}}
            )

        return jsonify({'message': 'Data processed successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@bp.route('/process/encode', methods=['POST'])
def process_column_ecoding():
    try:
        data = request.json 

        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {'_id': 0, 'username': 0})
        df = pd.DataFrame(list(cursor))
        
        # Write initial DataFrame to CSV for debugging
        #df.to_csv('initial_data.csv', sep=',', header=True, index=False)
        
        # Check if data and encoding strategy are provided
        if 'selectedColumn' not in data or 'encodingStrategy' not in data:
            return jsonify({'error': 'selectedColumn and encodingStrategy are required.'}), 400

        # Check if selected column exists in the DataFrame
        selected_column = data['selectedColumn']
        if selected_column not in df.columns:
            return jsonify({'error': f'Column "{selected_column}" does not exist in the dataset.'}), 400

        # Apply encoding based on the selected strategy
        encoding_strategy = data['encodingStrategy']

        if encoding_strategy == 'labelEncoding':
            label_encoder = LabelEncoder()
            column_to_encode = df[selected_column]
            column_encoded = label_encoder.fit_transform(column_to_encode)
            # Add a new column with the encoded values
            encoded_column_name = f'{selected_column}_encoded'
            df[encoded_column_name] = column_encoded
            df[selected_column] = column_encoded
        elif encoding_strategy == 'oneHotEncoding':
            encoder = OneHotEncoder()
            encoded_data = encoder.fit_transform(df[[selected_column]]).toarray()
            encoded_columns = encoder.get_feature_names_out([selected_column])
            df = pd.concat([df, pd.DataFrame(encoded_data, columns=encoded_columns)], axis=1)
        else:
            return jsonify({'error': 'Invalid encoding strategy.'}), 400
        
        # Loop through each row of the DataFrame
        for index, row in df.iterrows():
            # Extract the encoded value for the selected column
            encoded_value = row[selected_column]
            if encoding_strategy == 'labelEncoding':
                files_collection.update_one(
                    {'Timestamp': row['Timestamp']}, 
                    {'$set': {f'{selected_column}_encoded': encoded_value}}
                )
            elif encoding_strategy == 'oneHotEncoding':
                encoded_value = [row[col_name] for col_name in encoded_columns]
                for col_name, col_value in zip(encoded_columns, encoded_value):
                    files_collection.update_one(
                        {'Timestamp': row['Timestamp']}, 
                        {'$set': {col_name: col_value}}
                    )
                        
        # Write final DataFrame to CSV for debugging
        # df.to_csv('final_data.csv', sep=',', header=True, index=False)

        return jsonify({'message': 'Data processed successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@bp.route('/process/drop_outliers', methods=['POST'])
def drop_outliers():
    # Get request data
    data = request.get_json()
    column_name = data.get('selectedColumn')
    min_value = data.get('min')
    max_value = data.get('max')
    
    # Check if all required parameters are provided
    if not column_name:
        return jsonify({'error': 'Column name is required!'}), 400

    # Convert min and max values to float if provided
    if min_value:
        try:
            min_value = float(min_value)
        except ValueError:
            return jsonify({'error': 'Invalid min value!'}), 400
    if max_value:
        try:
            max_value = float(max_value)
        except ValueError:
            return jsonify({'error': 'Invalid max value!'}), 400

    # Update MongoDB collection
    try:
        query = {}
        or_conditions = []

        if min_value is not None:
            or_conditions.append({column_name: {'$lt': min_value}})
        if max_value is not None:
            or_conditions.append({column_name: {'$gt': max_value}})

        if not or_conditions:
            return jsonify({'error': 'At least one value (Min or Max) must be provided!'}), 400

        query['$or'] = or_conditions

        # Remove values outside the specified interval
        result = files_collection.delete_many(query)
        
        # Get the number of documents deleted
        deleted_count = result.deleted_count
        
        return jsonify({'message': f'{deleted_count} rows removed successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@bp.route('/multivariate/outliers', methods=['GET'])
def get_outliers_data():
    try:
        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {'_id': 0, 'username': 0})
        df = pd.DataFrame(list(cursor))

        # Perform your data manipulation
        df['Active_Power'] = df['Active_Power'] * 1000 / df['area']
        df['rating'] = df['rating'] * 1000 / df['area']

        # Detect outliers
        df_borders, inliers_all = detect_outliers(df, 'version', 'Global_Horizontal_Radiation', 'Active_Power', 'rating', [0.05,0.1,0.15,0.2], [20,30,50,150])
        data_fil = df.loc[inliers_all]

        # Prepare the data for the response
        response_data = {
            'inliers_x': [],
            'inliers_y': [],
            'outliers_x': [],
            'outliers_y': []
        }

        # Update the response data with inliers and outliers
        for version in data_fil['version'].unique():
            dt = data_fil[data_fil['version'] == version]
            df_vr = df[df['version'] == version]

            # List of tuples (ghi, power) for inliers
            inliers_list = list(zip(dt['Global_Horizontal_Radiation'], dt['Active_Power']))
            # List of tuples (ghi, power) for all points
            all_points_list = list(zip(df_vr['Global_Horizontal_Radiation'], df_vr['Active_Power']))
            
            # Extract inliers and outliers
            inliers = [point for point in inliers_list]
            outliers = [point for point in all_points_list if point not in inliers_list]

            # Append the points to the respective lists
            response_data['inliers_x'].extend([float(ghi) for ghi, _ in inliers])
            response_data['inliers_y'].extend([float(power) for _, power in inliers])
            response_data['outliers_x'].extend([float(ghi) for ghi, _ in outliers])
            response_data['outliers_y'].extend([float(power) for _, power in outliers])

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@bp.route('/process/column/merging', methods=['POST'])
def process_column_merging():
    try:
        # Get request data
        data = request.get_json()
        selected_column = data.get('selectedColumn')
        first_column = data.get('firstColumn')
        second_column = data.get('secondColumn')
        operator = data.get('operator')
        
        # Retrieve data from MongoDB
        cursor = files_collection.find({}, {first_column: 1, second_column: 1, selected_column: 1, '_id': 0, 'Timestamp' : 1})
        df = pd.DataFrame(list(cursor))

        # Perform your data manipulation
        if operator == '/':
            df[selected_column] = df[first_column] / df[second_column]
        elif operator == '*':
            df[selected_column] = df[first_column] * df[second_column]
        else:
            return jsonify({'error': 'Invalid operator specified'}), 400
        
        # Update MongoDB collection with the modified DataFrame
        for index, row in df.iterrows():
            files_collection.update_one({'Timestamp': row['Timestamp']}, {'$set': {selected_column: row[selected_column]}}, upsert=False)
        
        # Write final DataFrame to CSV for debugging
        # df.to_csv('final_data.csv', sep=',', header=True, index=False)
        
        return jsonify({'message': 'Data processed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/process/filtering', methods=['POST'])
def data_filtering():
    # Get request data
    data = request.get_json()
    column_name = data.get('selectedColumn')
    deletion_criteria = data.get('deletionCriteria')

    # Check if required data is present
    if not column_name or not deletion_criteria:
        return jsonify({'error': 'Missing data in request payload'}), 400
        
    try:
        column_type = files_collection.find_one().get(column_name).__class__
        
        if column_type == int:
            deletion_criteria = int(deletion_criteria)
        elif column_type == float:
            deletion_criteria = float(deletion_criteria)
            
        # Remove documents matching the deletion criteria
        result = files_collection.delete_many({column_name: deletion_criteria})
        
        # Get the number of documents deleted
        deleted_count = result.deleted_count
        
        return jsonify({'message': f'{deleted_count} rows removed successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
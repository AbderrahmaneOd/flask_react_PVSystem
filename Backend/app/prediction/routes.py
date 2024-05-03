from app.prediction import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from sklearn.metrics import r2_score

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
files_collection = db['files']


@bp.route('/model/score')
def get_model_score():

    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Check if Active_Power_pred column exists
    if 'Active_Power_pred' not in df.columns:
        return jsonify({'error': 'Active_Power_pred column does not exist'})

    # Calculate RMSE
    rmse = np.sqrt(mean_squared_error(df["Active_Power"], df["Active_Power_pred"]))

    # Calculate NRMSE
    nrmse = rmse*100/df["Active_Power"].mean()

    # Calculate MSE
    mse = mean_squared_error(df["Active_Power"], df["Active_Power_pred"])

    # Calculate MAE
    mae = mean_absolute_error(df["Active_Power"], df["Active_Power_pred"])

    # Calculate NMAE
    nmae = mae*100/df["Active_Power"].mean()

    # Calculate R-squared (R2) score
    r2 = r2_score(df["Active_Power"], df["Active_Power_pred"])

    # Calculate MAPE
    mape=mean_absolute_percentage_error(df["Active_Power"], df["Active_Power_pred"])

    return jsonify({'RMSE': rmse, 'MSE': mse, 'MAE': mae, 'R2': r2, 'MAPE': mape, 'NMAE': nmae})


@bp.route('/api/maev1', methods=['POST'])
def calculate_maev1():
    
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))
    
    #data = request.json['data']
    grouping = request.json['grouping']

    # Group data by technology and calculate MAE for each group
    mae_values = {}
    for technology, group in df.groupby('technology'):
        mae = mean_absolute_error(group["Active_Power"], group["Active_Power_pred"])
        mae_values[technology] = mae

    # Prepare data for chart
    mae_data = {
        'labels': list(mae_values.keys()),
        'datasets': [
            {
                'label': 'MAE',
                'data': list(mae_values.values()),
                'backgroundColor': ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
            }
        ]
    }

    return jsonify(mae_data)


@bp.route('/api/mae', methods=['POST'])
def calculate_maev():
    grouping = request.json['grouping']

    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Convert "Timestamp" column to datetime object
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    # Group data by technology and calculate MAE for each group
    mae_values = {}
    for _, group in df.groupby(pd.Grouper(key='Timestamp', freq=grouping.lower())):
        if grouping.lower() == 'year':
            formatted_date = group['Timestamp'].iloc[0].strftime('%Y')
        elif grouping.lower() == 'month':
            formatted_date = group['Timestamp'].iloc[0].strftime('%Y-%m')
        else:
            formatted_date = group['Timestamp'].iloc[0].strftime('%Y-%m-%d')  # Default to day format
        mae = mean_absolute_error(group["Active_Power"], group["Active_Power_pred"])
        mae_values[formatted_date] = mae

    # Prepare data for chart
    datasets = []
    for technology, group in df.groupby('technology'):
        tech_data = [mae_values[group['Timestamp'].iloc[0].strftime('%Y' if grouping.lower() == 'year' else '%Y-%m' if grouping.lower() == 'month' else '%Y-%m-%d')] for _, group in group.groupby(pd.Grouper(key='Timestamp', freq=grouping.lower()))]
        labels = [group['Timestamp'].iloc[0].strftime('%Y' if grouping.lower() == 'year' else '%Y-%m' if grouping.lower() == 'month' else '%Y-%m-%d') for _, group in group.groupby(pd.Grouper(key='Timestamp', freq=grouping.lower()))]
        datasets.append({
            'label': technology,
            'data': tech_data,
            'backgroundColor': ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
        })

    return jsonify({'datasets': datasets, 'labels': labels})
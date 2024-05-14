from app.prediction import bp
from flask import request, jsonify
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error

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

    # Calculate MAPE
    mape=mean_absolute_percentage_error(df["Active_Power"], df["Active_Power_pred"])

    return jsonify({'MAE': mae, 'NMAE': nmae, 'RMSE': rmse, 'NRMSE': nrmse, 'MAPE': mape})


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


@bp.route('/api/metrics', methods=['GET'])
def get_metrics():
    
     # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Check if Active_Power_pred column exists
    if 'Active_Power_pred' not in df.columns:
        return jsonify({'error': 'Active_Power_pred column does not exist'})
    
    
    # Convert 'Timestamp' column to datetime
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    
    # Calculate absolute errors
    df['Absolute_Error'] = np.abs(df['Active_Power'] - df['Active_Power_pred'])
    
    # Aggregate on a daily basis
    df['Day'] = df['Timestamp'].dt.date
    daily_aggregated = df.groupby('Day').agg({
        'Active_Power': 'mean',
        'Active_Power_pred': 'mean',
        'Absolute_Error': 'mean'
    }).reset_index()
    
    # Calculate additional metrics
    daily_aggregated['MAE'] = mean_absolute_error(daily_aggregated['Active_Power'], daily_aggregated['Active_Power_pred'])
    daily_aggregated['RMSE'] = np.sqrt(mean_squared_error(daily_aggregated['Active_Power'], daily_aggregated['Active_Power_pred']))
    daily_aggregated['NMAE'] = daily_aggregated['MAE'] / daily_aggregated['Active_Power'].mean()
    daily_aggregated['NRMSE'] = daily_aggregated['RMSE'] / daily_aggregated['Active_Power'].mean()
    daily_aggregated['MAPE'] = (daily_aggregated['Absolute_Error'] / daily_aggregated['Active_Power']).mean() * 100
    
    # Prepare data for Plotly
    data = []
    for metric in ['MAE', 'NMAE', 'RMSE', 'NRMSE', 'MAPE']:
        data.append({
            'x': daily_aggregated['Day'].astype(str).tolist(),
            'y': daily_aggregated[metric].tolist(),
            'name': metric,
            'type': 'bar'
        })
    
    return jsonify(data)


@bp.route('/api/metrics/tech', methods=['GET'])
def get_metrics_by_tech():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Check if Active_Power_pred column exists
    if 'Active_Power_pred' not in df.columns:
        return jsonify({'error': 'Active_Power_pred column does not exist'})

    # Calculate absolute errors
    df['Absolute_Error'] = np.abs(df['Active_Power'] - df['Active_Power_pred'])

    # Aggregate on a technology basis
    tech_aggregated = df.groupby('technology').agg({
        'Active_Power': 'mean',
        'Active_Power_pred': 'mean',
        'Absolute_Error': 'mean'
    }).reset_index()

    # Calculate additional metrics
    tech_aggregated['MAE'] = mean_absolute_error(tech_aggregated['Active_Power'], tech_aggregated['Active_Power_pred'])
    tech_aggregated['RMSE'] = np.sqrt(mean_squared_error(tech_aggregated['Active_Power'], tech_aggregated['Active_Power_pred']))
    tech_aggregated['NMAE'] = tech_aggregated['MAE'] / tech_aggregated['Active_Power'].mean()
    tech_aggregated['NRMSE'] = tech_aggregated['RMSE'] / tech_aggregated['Active_Power'].mean()
    tech_aggregated['MAPE'] = (tech_aggregated['Absolute_Error'] / tech_aggregated['Active_Power']).mean() * 100

    # Prepare data for Plotly
    data = []
    for metric in ['MAE', 'NMAE', 'RMSE', 'NRMSE', 'MAPE']:
        data.append({
            'x': tech_aggregated['technology'].tolist(),
            'y': tech_aggregated[metric].tolist(),
            'name': metric,
            'type': 'bar'
        })

    return jsonify(data)

@bp.route('/api/metrics/panel', methods=['GET'])
def get_metrics_by_panel():
    # Retrieve data from MongoDB
    cursor = files_collection.find({}, {'_id': 0, 'username': 0})

    # Convert cursor to a DataFrame
    df = pd.DataFrame(list(cursor))

    # Check if Active_Power_pred column exists
    if 'Active_Power_pred' not in df.columns:
        return jsonify({'error': 'Active_Power_pred column does not exist'})

    # Calculate absolute errors
    df['Absolute_Error'] = np.abs(df['Active_Power'] - df['Active_Power_pred'])

    # Aggregate on a version basis
    tech_aggregated = df.groupby('version').agg({
        'Active_Power': 'mean',
        'Active_Power_pred': 'mean',
        'Absolute_Error': 'mean'
    }).reset_index()

    # Calculate additional metrics
    tech_aggregated['MAE'] = mean_absolute_error(tech_aggregated['Active_Power'], tech_aggregated['Active_Power_pred'])
    tech_aggregated['RMSE'] = np.sqrt(mean_squared_error(tech_aggregated['Active_Power'], tech_aggregated['Active_Power_pred']))
    tech_aggregated['NMAE'] = tech_aggregated['MAE'] / tech_aggregated['Active_Power'].mean()
    tech_aggregated['NRMSE'] = tech_aggregated['RMSE'] / tech_aggregated['Active_Power'].mean()
    tech_aggregated['MAPE'] = (tech_aggregated['Absolute_Error'] / tech_aggregated['Active_Power']).mean() * 100

    # Prepare data for Plotly
    data = []
    for metric in ['MAE', 'NMAE', 'RMSE', 'NRMSE', 'MAPE']:
        data.append({
            'x': tech_aggregated['version'].tolist(),
            'y': tech_aggregated[metric].tolist(),
            'name': metric,
            'type': 'bar'
        })

    return jsonify(data)
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

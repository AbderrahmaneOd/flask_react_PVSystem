from flask import Blueprint


bp = Blueprint('auth', __name__)


##############################################################################################################################################################################################""
#CRUD-ADMIN-USERS
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
users_collection = db['users']

@bp.route('/users', methods=['GET'])
@jwt_required()
def retrieve_all_users():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403
    
    users = list(users_collection.find({}, {'_id': 0}))
    return jsonify(users)

@bp.route('/users/<string:username>', methods=['GET'])
@jwt_required()
def retrieve_user(username):
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403
    
    user = users_collection.find_one({'username': username}, {'_id': 0})
    if user:
        return jsonify(user)
    else:
        return jsonify({'message': 'User not found'}), 404

@bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    roles = data.get('roles', ["researcher"])  # Default roles to researcher if not provided

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(password)
    
    # Create User
    new_user = {
        'username': username,
        'password': hashed_password,
        'roles': roles,
        'firstName': data.get('firstName'),
        'lastName': data.get('lastName'),
        'phone': data.get('phone'),
        'email': data.get('email')
    }
    users_collection.insert_one(new_user)
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/users/<string:username>', methods=['DELETE'])
@jwt_required()
def delete_user(username):
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403
    result = users_collection.delete_one({'username': username})
    if result.deleted_count:
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404

@bp.route('/users/<string:username>', methods=['PUT'])
@jwt_required()
def update_user(username):
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403
    
    update_data = request.json
    result = users_collection.update_one({'username': username}, {"$set": update_data})
    if result.modified_count:
        return jsonify({'message': 'User updated successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404


########################################################################################Rows######################################################################################################""
import pandas as pd
from flask import jsonify, request
from pymongo import MongoClient

DataSets = db['DataSets']

@bp.route('/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file:
        # Utilisation de Pandas pour lire le fichier CSV
        try:
            # Lire le fichier CSV en tant que DataFrame
            df = pd.read_csv(file, sep=';') 
            
            # Calculer la valeur maximale de la colonne "SUM2"
            max_sum2 = df['SUM2'].max()
            min_sum2 = df['SUM2'].min()
            # Calculer la variance
            variance = df['SUM2'].var() 
            # Calculer l'écart-type
            ecart_type = df['SUM2'].std()
            # Calculer la moyenne
            mean = df['SUM2'].mean()
            # Calculer la médiane
            median = df['SUM2'].median()
            # Calculer l'étendue
            etendue = max_sum2 - min_sum2
            # Calculer le mode
            mode = df['SUM2'].mode().iloc[0]
            # Convertir le DataFrame en un dictionnaire JSON
            data = df.to_dict(orient='records')
            nombre_de_nuls_total = df.isnull().sum().sum()
            
            # Ajouter les informations sur les variables statistiques calculées
            stat_data = {
                'max_sum2': max_sum2,
                'min_sum2': min_sum2,
                'variance': variance,
                'mean': mean,
                'median': median,
                'mode': mode,
                'etendue': etendue
            }

            numRows, numCols = df.shape

            # Insérer le document dans la collection MongoDB
            DataSets.insert_one({ 'nombre_de_nuls_total': 20,'numRows': numRows, 'numCols': numCols,'data': data, 'SUM2_Stat': stat_data})
            print(stat_data)
            return jsonify({
                'message': 'File processed successfully',
                'statistics': stat_data,
                'nombre_de_nuls_total': 20,
                'numRows': numRows,
                'numCols': numCols

            }), 200
        
        except Exception as e:
            return jsonify({'message': 'Error processing CSV file', 'error': str(e)}), 400







################################################################################STATISTIQUES/VISUALISATION DES STATISTIQUES##############################################################################################################""
import numpy as np
import json
import matplotlib
matplotlib.use('Agg')  # Utiliser le backend non interactif
import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import threading


# Convertir les valeurs numpy.int64 en types natifs Python
def convert_np_int64(obj):
    if isinstance(obj, np.int64):
        return int(obj)
    raise TypeError

# Fonction pour calculer les statistiques dans un thread
def calculate_statistics(df, column, result_dict):
    try:
        # Conversion des valeurs de la colonne en float
        numeric_data = pd.to_numeric(df[column], errors='coerce')
        # Suppression des valeurs NaN
        numeric_data = numeric_data.dropna()

        if numeric_data.empty:
            result_dict[column] = {'message': f'La colonne "{column}" ne contient pas que des valeurs numériques'}
            return

        # Calcul des statistiques
        max_value = numeric_data.max()
        min_value = numeric_data.min()
        variance = numeric_data.var()
        mean = numeric_data.mean()
        median = numeric_data.median()
        mode = numeric_data.mode().iloc[0]
        range_value = max_value - min_value

        # Stockage des statistiques dans un dictionnaire
        result_dict[column] = {
            'max_value': max_value,
            'min_value': min_value,
            'variance': variance,
            'mean': mean,
            'median': median,
            'mode': mode,
            'range': range_value
        }
    except KeyError:
        result_dict[column] = {'message': f'La colonne "{column}" n\'existe pas dans le fichier CSV'}

# Fonction pour générer le diagramme en boîte à moustaches dans un thread
def generate_boxplot_image(df, selected_columns):
    plt.figure()
    plt.boxplot([df[column].dropna() for column in selected_columns])
    plt.xlabel('Colonnes')
    plt.ylabel('Valeurs')
    plt.title('Diagramme en boîte à moustaches')
    # Convertir le diagramme en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    boxplot_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    return boxplot_image_base64

@bp.route('/show-statistiques', methods=['POST'])
def show_statistiques():
    data = request.json
    selected_columns = data.get('selectedColumns')

    if not selected_columns:
        return jsonify({'message': 'Veuillez sélectionner au moins une colonne'}), 400

    file_data = DataSets.find_one({}, {'_id': 0, 'data': 1})
    if not file_data:
        return jsonify({'message': 'Aucun fichier CSV n\'a été téléchargé'}), 400

    df = pd.DataFrame(file_data['data'])

    statistics = {}
    threads = []

    # Créer un dictionnaire partagé pour stocker les résultats de chaque thread
    result_dict = {}

    for column in selected_columns:
        # Créer un thread pour chaque colonne
        thread = threading.Thread(target=calculate_statistics, args=(df, column, result_dict))
        threads.append(thread)
        thread.start()

    # Attendre que tous les threads se terminent
    for thread in threads:
        thread.join()

    # Rassembler les résultats de tous les threads dans le dictionnaire statistics
    for column in selected_columns:
        statistics[column] = result_dict[column]

    # Convertir les valeurs numpy.int64 en types natifs Python avant de renvoyer la réponse JSON
    statistics = json.loads(json.dumps(statistics, default=convert_np_int64))

    # Générer le diagramme en boîte à moustaches dans un thread séparé
    boxplot_image_base64 = generate_boxplot_image(df, selected_columns)

    return jsonify({'statistics': statistics, 'boxplot_image': boxplot_image_base64}), 200



##############################################################################################################################################################################################
import matplotlib.pyplot as plt
import io
import base64
from flask import jsonify

@bp.route('/generate-boxplot', methods=['POST'])
def generate_boxplot():
    # Données factices pour le test
    boxplot_data = [
        [1, 2, 3, 4, 5],
        [5, 6, 7, 8, 9],
        [9, 10, 11, 12, 13]
    ]

    # Créer le diagramme en boîte à moustaches
    plt.boxplot(boxplot_data)
    plt.xlabel('Colonnes')
    plt.ylabel('Valeurs')
    plt.title('Diagramme en boîte à moustaches')

    # Convertir l'image en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return jsonify({'boxplot_image': image_base64}), 200


import matplotlib.pyplot as plt
import io
import base64
from flask import jsonify

@bp.route('/generate-histogram', methods=['POST'])
def generate_histogram():
    # Données factices pour le test
    data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]

    # Créer l'histogramme
    plt.hist(data, bins=5, color='skyblue', edgecolor='black')
    plt.xlabel('Valeurs')
    plt.ylabel('Fréquence')
    plt.title('Histogramme')

    # Convertir l'image en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return jsonify({'histogram_image': image_base64}), 200


@bp.route('/generate-barplot', methods=['POST'])
def generate_barplot():
    # Données factices pour le test
    categories = ['Catégorie A', 'Catégorie B', 'Catégorie C']
    values = [10, 20, 15]

    # Créer le diagramme en barres
    plt.bar(categories, values, color='green')
    plt.xlabel('Catégories')
    plt.ylabel('Valeurs')
    plt.title('Diagramme en barres')

    # Convertir l'image en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return jsonify({'barplot_image': image_base64}), 200


@bp.route('/generate-piechart', methods=['POST'])
def generate_piechart():
    # Données factices pour le test
    labels = ['Catégorie A', 'Catégorie B', 'Catégorie C']
    sizes = [25, 40, 35]

    # Créer le diagramme circulaire
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    plt.title('Diagramme circulaire')

    # Convertir l'image en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return jsonify({'piechart_image': image_base64}), 200


@bp.route('/generate-scatterplot', methods=['POST'])
def generate_scatterplot():
    # Données factices pour le test
    x = [1, 2, 3, 4, 5]
    y = [2, 3, 5, 7, 11]

    # Créer le diagramme de dispersion
    plt.scatter(x, y, color='blue', marker='o')
    plt.xlabel('Variable X')
    plt.ylabel('Variable Y')
    plt.title('Diagramme de dispersion')

    # Convertir l'image en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return jsonify({'scatterplot_image': image_base64}), 200








##############################################################################################################################################################################################


from app.auth import routes
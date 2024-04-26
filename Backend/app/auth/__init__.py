from flask import Blueprint


bp = Blueprint('auth', __name__)


##############################################################################################################################################################################################""
#CRUD-ADMIN-USERS
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['pfa']
users_collection = db['users']
server_data = db['server_data']

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
        'email': data.get('email'),
        'created_at':datetime.now().strftime("%d-%m-%Y") 
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



##########################################Exemple de diagramme à utiliser et consommer côté client####################################################################################################################################################
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
from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


@bp.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    
    #L'email de l'administrateur qui recevra toutes les réclamations des utilisateurs.     
    recipient_email = 'webig21841@adstam.com'
    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')
    subject = data.get('subject')
    message_body = data.get('message_body')

    if not subject or not message_body:
        return jsonify({'message': 'Veuillez fournir l\'adresse e-mail du destinataire, le sujet et le corps du message'}), 400
    
    # Formater le message
    formatted_message = f"""Nom: {nom}
    Prénom: {prenom}
    Email: {email}

    Message:
    {message_body}"""

    #L'e-mail qui sera utilisé pour contacter l'administrateur.
    sender_email = 'mbelkarradi@gmail.com'
    sender_password = 'jgmg dsol ncnb fkbu'

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(formatted_message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return jsonify({'message': 'Email envoyé avec succès'}), 200
    except Exception as e:
        return jsonify({'message': 'Une erreur s\'est produite lors de l\'envoi de l\'email', 'error': str(e)}), 500


##############################################################################################################################################################################################
import os
import numpy as np
from flask import Flask, request, jsonify
from tensorflow import keras
from datetime import datetime
import os


UPLOAD_FOLDER = '../ModelDB'
ALLOWED_EXTENSIONS = {'h5'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/uploadModel', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'modelName' not in request.form:
        return 'Veuillez fournir à la fois le fichier et le nom du modèle.'

    file = request.files['file']
    model_name = request.form['modelName']

    if file.filename == '' or model_name == '':
        return 'Veuillez spécifier à la fois le fichier et le nom du modèle.'

    if file and allowed_file(file.filename):
        # Vérification de l'unicité du nom de modèle
        model_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, model_name + '.h5')
        if os.path.exists(model_path):
            return 'Le nom du modèle existe déjà. Veuillez choisir un autre nom.'

        # Construction du chemin absolu pour sauvegarder le fichier
        upload_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, model_name + '.h5')
        file.save(upload_path)
        return 'Fichier téléchargé avec succès'
    else:
        return 'Extension de fichier non autorisée. Seuls les fichiers avec l\'extension .h5 sont autorisés.'



@bp.route('/updateModel/<string:modelName>', methods=['PUT'])
def update_model(modelName):
    if 'file' not in request.files:
        return 'Veuillez fournir le fichier à mettre à jour.'

    file = request.files['file']
    new_model_name = request.form.get('newModelName')

    # Vérification que le fichier est fourni
    if file.filename == '':
        return 'Veuillez spécifier le fichier à mettre à jour.'

    # Construction du chemin absolu pour le modèle existant
    model_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, modelName + '.h5')

    if not os.path.exists(model_path):
        return f'Le modèle spécifié ({modelName}) n\'existe pas.'

    # Si un fichier est fourni, mettez à jour le modèle en écrasant l'ancien fichier
    if file and allowed_file(file.filename):
        file.save(model_path)

    # Si un nouveau nom est fourni, renommez le fichier
    if new_model_name and new_model_name != modelName:
        new_model_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, new_model_name + '.h5')

        if os.path.exists(new_model_path):
            return f'Le nouveau nom ({new_model_name}) existe déjà. Veuillez choisir un autre nom.'

        os.rename(model_path, new_model_path)

    return 'Modèle mis à jour avec succès.'



@bp.route('/deleteModel', methods=['DELETE'])
def delete_model():
    model_name = request.args.get('modele')  # Remplacez 'modelName' par 'modele'
    if model_name is None:
        return 'Veuillez spécifier le nom du modèle à supprimer.'

    # Construction du chemin absolu pour supprimer le modèle
    model_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, model_name + '.h5')

    if os.path.exists(model_path):
        os.remove(model_path)
        return 'Modèle supprimé avec succès.'
    else:
        return f'Le modèle spécifié ({model_name}) n\'existe pas.'


@bp.route('/getModel', methods=['GET'])
def get_model():
    model_name = request.args.get('modele')
    if model_name is None:
        return 'Veuillez spécifier le nom du modèle à récupérer.'

    model_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, model_name + '.h5')

    if os.path.exists(model_path):
        file_stat = os.stat(model_path)
        model_info = {
            'modelName': model_name,
            'fileSize': get_file_size(file_stat.st_size),
            'dateAdded': datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y-%m-%d')
        }
        return jsonify(model_info)
    else:
        return f'Le modèle spécifié ({model_name}) n\'existe pas.'



@bp.route('/getAllModels', methods=['GET'])
def get_all_models():
    models_info = []
    for filename in os.listdir(os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER)):
        if filename.endswith('.h5'):
            file_path = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER, filename)
            file_stat = os.stat(file_path)
            model_info = {
                'modelName': filename[:-3],
                'fileSize': get_file_size(file_stat.st_size),
                'dateAdded': datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y-%m-%d')
            }
            models_info.append(model_info)
    return jsonify(models_info)




def get_file_size(file_size):
    # Convertir la taille du fichier en Ko, Mo ou Go en fonction de sa taille
    units = ['bytes', 'KB', 'MB', 'GB', 'TB']
    for i in range(len(units)):
        if file_size < 1024 or i == len(units) - 1:
            return {'value': round(file_size, 2), 'unit': units[i]}
        file_size /= 1024




@bp.route('/utiliserModele/<string:modelName>', methods=['GET'])
def utiliser_modele(modelName):
    print("Nom du modèle récupéré :", modelName)  # Ajout d'une instruction de débogage

    if modelName:
        model_path = os.path.join("app/ModelDB/", modelName + '.h5')
        print("Chemin relatif du modèle :", model_path)  # Ajout d'une instruction de débogage

        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            input_data = np.array([3])
            result = model.predict(input_data)
            return f'Résultat de la prédiction : {result[0]}'
        else:
            return f'Le modèle spécifié ({modelName}) n\'existe pas.'
    else:
        return 'Veuillez spécifier le nom du fichier modèle dans les paramètres de l\'URL.'
    

################################################ADMIN Dashboard##############################################################################################################################################
import psutil
import time
from datetime import datetime, timedelta


@bp.route('/users/count-by-role', methods=['GET'])
@jwt_required()
def count_users_by_role():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    pipeline = [
        {'$unwind': '$roles'},
        {'$group': {'_id': '$roles', 'count': {'$sum': 1}}}
    ]

    model_count = len(os.listdir(os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER)))

    user_roles = users_collection.aggregate(pipeline)
    user_roles_dict = {role['_id']: role['count'] for role in user_roles}
    total_user_count = users_collection.count_documents({})

    # Créer le dictionnaire de réponse avec le nombre total d'utilisateurs et le décompte des utilisateurs par rôle
    response_dict = {"total_users": total_user_count}
    response_dict.update(user_roles_dict)
    
    # Ajouter le décompte des modèles
    response_dict["model_count"] = model_count

    return jsonify(response_dict), 200




@bp.route('/models/count', methods=['GET'])
@jwt_required()
def count_models():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    model_count = len(os.listdir(os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER)))
    return jsonify({'model_count': model_count}), 200

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/users/percentage-by-role', methods=['GET'])
@jwt_required()
def calculate_percentage_by_role():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    pipeline = [
        {'$unwind': '$roles'},
        {'$group': {'_id': '$roles', 'count': {'$sum': 1}}}
    ]
    user_roles = users_collection.aggregate(pipeline)
    user_roles_dict = {role['_id']: role['count'] for role in user_roles}
    total_user_count = users_collection.count_documents({})
    
    # Créer un dictionnaire pour stocker les pourcentages
    percentage_dict = {}

    # Calculer le pourcentage de chaque rôle
    for role, count in user_roles_dict.items():
        percentage = (count / total_user_count) * 100
        percentage_dict[role] = round(percentage, 2)

    return jsonify(percentage_dict), 200




@bp.route('/count-by-creation-date', methods=['GET'])
@jwt_required()
def count_users_by_creation_date():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    # Convertir les chaînes de date en objets Date
    pipeline = [
        {'$addFields': {'created_at': {'$toDate': '$created_at'}}},
        {'$group': {'_id': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$created_at'}}, 'count': {'$sum': 1}}},
        {'$sort': {'_id': 1}}
    ]
    user_creation_dates = users_collection.aggregate(pipeline)
    creation_dates_data = [{'date': item['_id'], 'count': item['count']} for item in user_creation_dates]

    return jsonify(creation_dates_data), 200

################################################Diagnostique Dash##############################################################################################################################################

def check_server_state():
    cpu_percent = psutil.cpu_percent() 
    memory_percent = psutil.virtual_memory().percent  

    if cpu_percent > 80 or memory_percent > 90:
        return 'Critique'
    elif cpu_percent > 60 or memory_percent > 70:
        return 'Moyen'
    else:
        return 'Optimal'

@bp.route('/server/status', methods=['GET'])
@jwt_required()
def server_status():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    server_state = check_server_state()
    return jsonify({'server_state': server_state}), 200



from threading import Thread

# Fonction pour récupérer les données d'utilisation du CPU et de la mémoire
def collect_usage_data():
    current_time = datetime.now()
    start_time = current_time - timedelta(hours=1)
    while current_time >= start_time:
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        timestamp = int(current_time.timestamp())

        db.usage_data.insert_one({
            'timestamp': timestamp,
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent
        })

        current_time -= timedelta(minutes=5)
        time.sleep(1)

# Point de terminaison pour récupérer l'état du CPU
@bp.route('/etat_cpu', methods=['GET'])
def get_cpu_state():
    # Collecter les données d'utilisation du CPU
    collect_usage_data()

    # Récupérer les données d'état du CPU depuis la collection MongoDB
    cpu_states = list(db.usage_data.find({}, {'_id': 0, 'timestamp': 1, 'cpu_percent': 1}).sort('timestamp', -1))

    # Formater les données pour les rendre compatibles avec Chart.js
    cpu_labels = [state['timestamp'] for state in cpu_states]
    cpu_data = [state['cpu_percent'] for state in cpu_states]

    return jsonify({
        'labels': cpu_labels,
        'data': cpu_data
    })

# Point de terminaison pour récupérer l'état de la mémoire
@bp.route('/etat_memory', methods=['GET'])
def get_memory_state():
    # Collecter les données d'utilisation de la mémoire
    collect_usage_data()

    # Récupérer les données d'état de la mémoire depuis la collection MongoDB
    memory_states = list(db.usage_data.find({}, {'_id': 0, 'timestamp': 1, 'memory_percent': 1}).sort('timestamp', -1))

    # Formater les données pour les rendre compatibles avec Chart.js
    memory_labels = [state['timestamp'] for state in memory_states]
    memory_data = [state['memory_percent'] for state in memory_states]

    return jsonify({
        'labels': memory_labels,
        'data': memory_data
    })



@bp.after_request
def calculate_response_time(response):
    # Récupérer le temps actuel
    start_time = time.time()
    # Calculer le temps de réponse de la requête
    response_time = time.time() - start_time
    # Stocker le temps de réponse dans la collection MongoDB
    server_data.insert_one({'response_time': response_time})
    return response

@bp.route('/server/response_time', methods=['GET'])
@jwt_required()
def average_response_time():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    # Calcul de la moyenne des temps de réponse
    total_response_time = 0
    total_requests = 0

    for entry in server_data.find():
        total_response_time += entry['response_time']
        total_requests += 1

    if total_requests > 0:
        average_time = total_response_time / total_requests
    else:
        average_time = 0

    return jsonify({'average_response_time': average_time}), 200


from flask import request

# Connexion à la base de données MongoDB

request_stats = db['request_stats']

# Middleware pour compter les requêtes
@bp.before_request
def count_requests():
    method = request.method
    request_stats.update_one({'method': method}, {'$inc': {'count': 1}}, upsert=True)

@bp.route('/request_stats', methods=['GET'])
@jwt_required()
def request_statistics():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    # Récupérer les statistiques depuis la base de données
    stats = request_stats.find()
    server_state = check_server_state()
    
    # Créer un dictionnaire pour stocker les statistiques
    stats_dict = {}
    for stat in stats:
        stats_dict[stat['method']] = stat['count']

    # Création de la réponse JSON
    response = {
        "request_counts": sum(stats_dict.values()),
        "GET": stats_dict.get('GET', 0),
        "POST": stats_dict.get('POST', 0),
        "PUT": stats_dict.get('PUT', 0),
        "DELETE": stats_dict.get('DELETE', 0),
        "average_response_time": 90,
        "server_status":server_state
    }

    return jsonify(response), 200



response_stats = db['response_stats']

# Middleware pour compter les codes de réponse
@bp.after_request
def count_responses(response):
    status_code = response.status_code
    response_stats.update_one({'status_code': status_code}, {'$inc': {'count': 1}}, upsert=True)
    return response

@bp.route('/response_statistics', methods=['GET'])
@jwt_required()
def response_statistics():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    # Récupérer les statistiques depuis la base de données
    stats = response_stats.find()

    # Créer un dictionnaire pour stocker les statistiques des codes de réponse
    response_dict = {}
    total_responses = 0
    for stat in stats:
        response_dict[stat['status_code']] = stat['count']
        total_responses += stat['count']

    # Création de la réponse JSON
    response = {}
    for code, count in response_dict.items():
        response[str(code)] = count
    response["response_counts"] = total_responses

    return jsonify(response), 200




def disk_usage_percent():
    # Obtient l'utilisation du disque
    disk_usage = psutil.disk_usage('/')
    # Calcule le pourcentage libre du disque
    percent_free = disk_usage.free / disk_usage.total * 100
    return percent_free

# Maintenant, vous pouvez appeler cette fonction où vous voulez récupérer le pourcentage libre du disque.

@bp.route('/disk_usage', methods=['GET'])
@jwt_required()
def disk_usage():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'username': current_user})
    if 'admin' not in user['roles']:
        return jsonify({'message': 'Admin role required'}), 403

    percent_free = disk_usage_percent()

    return jsonify({'disk_usage_percent': percent_free}), 200



from app.auth import routes

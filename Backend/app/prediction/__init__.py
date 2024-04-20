from flask import Blueprint


bp = Blueprint('prediction', __name__)

from app.prediction import routes
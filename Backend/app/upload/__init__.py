from flask import Blueprint

bp = Blueprint('upload', __name__)

from app.upload import routes
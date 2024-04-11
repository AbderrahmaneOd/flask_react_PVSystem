from flask import Blueprint

bp = Blueprint('preprocessing', __name__)

from app.preprocessing import routes
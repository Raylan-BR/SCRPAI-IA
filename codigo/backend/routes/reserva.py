from flask import Blueprint, send_from_directory
import os

reserva_bp = Blueprint("reserva",__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

@reserva_bp.route('/pages/compra/reserva.html')
def reserva_html():
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages','compra')
    return send_from_directory(caminho_html, 'reserva.html')

# Rota para o CSS
@reserva_bp.route('/frontend/css/reserva.css')
def reserva_css():
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'reserva.css')

# Rota para o JS
@reserva_bp.route('/frontend/js/reserva.js')
def reserva_js():
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'reserva.js')
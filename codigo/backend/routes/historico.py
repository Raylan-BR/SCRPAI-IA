from flask import Blueprint, send_from_directory
import os

historico_bp = Blueprint("historico",__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

@historico_bp.route('/historico')
def historico_html():
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages',)
    return send_from_directory(caminho_html, 'historico.html')

# Rota para o CSS
@historico_bp.route('/frontend/css/historico.css')
def historico_css():
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'historico.css')

# Rota para o JS
@historico_bp.route('/frontend/js/historico.js')
def historico_js():
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'historico.js')
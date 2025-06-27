from flask import Blueprint, send_from_directory
import os

perfil_bp = Blueprint("perfil",__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

@perfil_bp.route('/pages/autenticacao/perfil.html')
def perfil_html():
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages','autenticacao')
    return send_from_directory(caminho_html, 'perfil.html')

# Rota para o CSS
@perfil_bp.route('/frontend/css/perfil.css')
def perfil_css():
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'perfil.css')

# Rota para o JS
@perfil_bp.route('/frontend/js/perfil.js')
def perfil_js():
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'perfil.js')
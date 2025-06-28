from flask import Blueprint, send_from_directory
import os

pagamento_bp = Blueprint("pagamento",__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

@pagamento_bp.route('/pages/compra/pagamento.html')
def pagamento_html():
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages','compra')
    return send_from_directory(caminho_html, 'pagamento.html')

# Rota para o CSS
@pagamento_bp.route('/frontend/css/pagamento.css')
def pagamento_css():
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'pagamento.css')

# Rota para o JS
@pagamento_bp.route('/frontend/js/pagamento.js')
def pagamento_js():
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'pagamento.js')
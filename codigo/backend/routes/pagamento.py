#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file pagamento.py
@brief Rotas para o módulo de pagamento
@author Seu Nome <seu.email@exemplo.com>

Módulo responsável por servir os recursos estáticos relacionados ao processo de pagamento:
- Página HTML do pagamento
- Arquivos CSS de estilo
- Scripts JavaScript
"""

from flask import Blueprint, send_from_directory
import os

# Criação do Blueprint para rotas de pagamento
pagamento_bp = Blueprint("pagamento", __name__)
"""@var pagamento_bp
@brief Blueprint principal para rotas de pagamento
@details Gerencia os endpoints relacionados à interface de pagamento:
- Página principal
- Recursos estáticos (CSS/JS)
"""

# Configuração do diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
"""@var BASE_DIR
@brief Caminho absoluto para o diretório raiz do projeto
@details Utilizado como base para localizar os arquivos do frontend
"""

@pagamento_bp.route('/pages/compra/pagamento.html')
def pagamento_html():
    """Endpoint para servir a página HTML de pagamento
    
    :return: Arquivo HTML da interface de pagamento
    :rtype: flask.Response
    """
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages', 'compra')
    return send_from_directory(caminho_html, 'pagamento.html')

@pagamento_bp.route('/frontend/css/pagamento.css')
def pagamento_css():
    """Endpoint para servir o arquivo CSS de pagamento
    
    :return: Arquivo CSS com estilos da página de pagamento
    :rtype: flask.Response
    """
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'pagamento.css')

@pagamento_bp.route('/frontend/js/pagamento.js')
def pagamento_js():
    """Endpoint para servir o arquivo JavaScript de pagamento
    
    :return: Arquivo JS com lógica da página de pagamento
    :rtype: flask.Response
    """
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'pagamento.js')
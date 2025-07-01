#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file reserva.py
@brief Rotas para o módulo de reservas
@author Seu Nome <seu.email@exemplo.com>

Módulo responsável por servir os recursos estáticos relacionados à interface de reservas:
- Página HTML de reservas
- Arquivos CSS de estilo
- Scripts JavaScript
"""

from flask import Blueprint, send_from_directory
import os

# Criação do Blueprint para rotas de reserva
reserva_bp = Blueprint("reserva", __name__)
"""@var reserva_bp
@brief Blueprint principal para rotas de reserva
@details Gerencia os endpoints relacionados à interface de reservas:
- Página principal de reservas
- Recursos estáticos (CSS/JS)
"""

# Configuração do diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
"""@var BASE_DIR
@brief Caminho absoluto para o diretório raiz do projeto
@details Utilizado como base para localizar os arquivos do frontend
"""

@reserva_bp.route('/pages/compra/reserva.html')
def reserva_html():
    """Endpoint para servir a página HTML de reservas
    
    :return: Arquivo HTML da interface de reservas
    :rtype: flask.Response
    """
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages', 'compra')
    return send_from_directory(caminho_html, 'reserva.html')

@reserva_bp.route('/frontend/css/reserva.css')
def reserva_css():
    """Endpoint para servir o arquivo CSS de reservas
    
    :return: Arquivo CSS com estilos da página de reservas
    :rtype: flask.Response
    """
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'reserva.css')

@reserva_bp.route('/frontend/js/reserva.js')
def reserva_js():
    """Endpoint para servir o arquivo JavaScript de reservas
    
    :return: Arquivo JS com lógica da página de reservas
    :rtype: flask.Response
    """
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'reserva.js')
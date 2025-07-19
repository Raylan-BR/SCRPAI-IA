#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file perfil.py
@brief Rotas para o módulo de perfil do usuário
@author RAYLAN BRUNO SANTANA CARVALHO <raylan.bruno@discente.ufma.br>

Módulo responsável por servir os recursos estáticos relacionados à página de perfil do usuário:
- Página HTML do perfil
- Arquivos CSS de estilo
- Scripts JavaScript
"""

from flask import Blueprint, send_from_directory
import os

# Criação do Blueprint para rotas de perfil
perfil_bp = Blueprint("perfil", __name__)
"""@var perfil_bp
@brief Blueprint principal para rotas de perfil
@details Gerencia os endpoints relacionados à interface de perfil do usuário:
- Página principal de perfil
- Recursos estáticos (CSS/JS) específicos
"""

# Configuração do diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
"""@var BASE_DIR
@brief Caminho absoluto para o diretório raiz do projeto
@details Utilizado como referência para localizar arquivos frontend de forma consistente
"""

@perfil_bp.route('/perfil.html')
def perfil_html():
    """Endpoint para servir a página HTML de perfil do usuário
    
    :return: Arquivo HTML contendo a interface de perfil
    :rtype: flask.Response
    
    Localização esperada:
    frontend/pages/autenticacao/perfil.html
    """
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages', 'autenticacao')
    return send_from_directory(caminho_html, 'perfil.html')

@perfil_bp.route('/frontend/css/perfil.css')
def perfil_css():
    """Endpoint para servir o arquivo CSS de estilos do perfil
    
    :return: Arquivo CSS com estilos específicos da página de perfil
    :rtype: flask.Response
    
    Localização esperada:
    frontend/css/perfil.css
    """
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'perfil.css')

@perfil_bp.route('/frontend/js/perfil.js')
def perfil_js():
    """Endpoint para servir o arquivo JavaScript do perfil
    
    :return: Arquivo JS com a lógica da página de perfil
    :rtype: flask.Response
    
    Localização esperada:
    frontend/js/perfil.js
    """
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'perfil.js')
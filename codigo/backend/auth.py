#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file auth.py
@brief Blueprint de autenticação para a API de viagens
@author LILIA ROSA COELHO MOURA <lilia.rosa@discente.ufma.br>

Módulo responsável por todas as operações de autenticação:
- Cadastro tradicional
- Login tradicional
- Login com Google
- Recuperação de senha
- Servir páginas de autenticação
"""

from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

# Carrega variáveis de ambiente
load_dotenv()

# Cria blueprint para rotas de autenticação
auth_bp = Blueprint('auth', __name__)
"""@var auth_bp
@brief Blueprint principal para rotas de autenticação
@details Agrupa todos os endpoints relacionados a:
- Registro de usuários
- Autenticação
- Gerenciamento de contas
"""

# Configuração do MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client.scrpai_ia
users = db.users
"""@var users
@brief Coleção MongoDB para armazenamento de usuários
@details Armazena:
- Credenciais de acesso
- Informações de perfil
- Método de autenticação utilizado
"""

# Configuração do Firebase Admin SDK
cred_path = os.getenv("FIREBASE_ADMIN_CREDENTIALS_PATH")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
"""@brief Inicializa o SDK do Firebase para autenticação com Google
@details Utilizado para:
- Verificar tokens de autenticação do Google
- Gerenciar login social
"""

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint para cadastro tradicional de usuários.
    
    :return: JSON com resultado da operação
    :rtype: flask.Response
    :raises HTTPException: 409 se email já estiver cadastrado
    
    Estrutura do JSON esperado:
    {
        "name": "Nome do usuário",
        "email": "email@exemplo.com",
        "password": "senha_secreta"
    }
    """
    data = request.json
    if users.find_one({"email": data['email']}):
        return jsonify({"error": "Email já cadastrado"}), 409
    
    hashed_password = generate_password_hash(data['password'])
    user_data = {
        "name": data.get('name'),
        "email": data['email'],
        "password": hashed_password,
        "google_authenticated": False
    }
    
    users.insert_one(user_data)
    return jsonify({
        "message": "Usuário cadastrado com sucesso",
        "user_name": user_data["name"]
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint para login tradicional com email e senha.
    
    :return: JSON com dados do usuário autenticado
    :rtype: flask.Response
    :raises HTTPException: 401 se credenciais forem inválidas
    
    Estrutura do JSON esperado:
    {
        "email": "email@exemplo.com",
        "password": "senha_secreta"
    }
    """
    data = request.json
    user = users.find_one({"email": data['email']})
    
    if not user or not check_password_hash(user.get('password', ''), data['password']):
        return jsonify({"error": "Credenciais inválidas"}), 401
    
    return jsonify({
        "message": "Login realizado com sucesso",
        "user_name": user['name'],
        "user_email": user['email']
    })

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    """Endpoint para autenticação com conta Google.
    
    :return: JSON com dados do usuário
    :rtype: flask.Response
    :raises HTTPException: 
        - 400 se token não for fornecido
        - 401 se token for inválido
    
    Estrutura do JSON esperado:
    {
        "token": "token_jwt_do_firebase"
    }
    """
    token = request.json.get('token')
    if not token:
        return jsonify({"error": "Token não fornecido"}), 400

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        email = decoded_token.get('email')
        name = decoded_token.get('name') or "Usuário"
        
        if not email:
            return jsonify({"error": "Token inválido, email não encontrado"}), 401

        user = users.find_one({"email": email})
        
        if not user:
            user_data = {
                "name": name,
                "email": email,
                "google_authenticated": True
            }
            users.insert_one(user_data)
        else:
            if not user.get('name'):
                users.update_one(
                    {"email": email},
                    {"$set": {"name": name, "google_authenticated": True}}
                )
        
        return jsonify({
            "message": f"Login com Google realizado com sucesso",
            "user_name": name,
            "user_email": email
        })

    except Exception as e:
        print(f"Erro ao verificar token Firebase: {e}")
        return jsonify({"error": "Token inválido"}), 401
    
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Endpoint para redefinição de senha.
    
    :return: JSON com resultado da operação
    :rtype: flask.Response
    :raises HTTPException:
        - 400 se dados estiverem incompletos
        - 404 se usuário não for encontrado
    
    Estrutura do JSON esperado:
    {
        "email": "email@exemplo.com",
        "new_password": "nova_senha_secreta"
    }
    """
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"error": "Email e nova senha são obrigatórios"}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    hashed_password = generate_password_hash(new_password)
    users.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    return jsonify({"message": "Senha atualizada com sucesso"}), 200

# Configuração de caminhos para arquivos estáticos
BASE_DIRETORIO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
"""@var BASE_DIRETORIO
@brief Caminho base para acessar arquivos estáticos
@details Utilizado para servir páginas HTML, CSS e JS
"""

@auth_bp.route('/pages/autenticacao/login.html')
def login_html():
    """Serve a página HTML de login.
    
    :return: Arquivo HTML renderizado
    :rtype: flask.Response
    """
    caminho_html = os.path.join(BASE_DIRETORIO, 'frontend', 'pages', 'autenticacao')
    return send_from_directory(caminho_html, 'login.html')

@auth_bp.route('/render-cadastro')
def cadastro_html():
    """Serve a página HTML de cadastro.
    
    :return: Arquivo HTML renderizado
    :rtype: flask.Response
    """
    caminho_html = os.path.join(BASE_DIRETORIO, 'frontend', 'pages', 'autenticacao')
    return send_from_directory(caminho_html, 'cadastro.html')

@auth_bp.route('/frontend/css/autenticacao.css')
def login_css():
    """Serve o arquivo CSS para páginas de autenticação.
    
    :return: Arquivo CSS
    :rtype: flask.Response
    """
    caminho_css = os.path.join(BASE_DIRETORIO, 'frontend', 'css')
    return send_from_directory(caminho_css, 'autenticacao.css')

@auth_bp.route('/frontend/js/autenticacao.js')
def login_js():
    """Serve o arquivo JavaScript para páginas de autenticação.
    
    :return: Arquivo JS
    :rtype: flask.Response
    """
    caminho_js = os.path.join(BASE_DIRETORIO, 'frontend', 'js')
    return send_from_directory(caminho_js, 'autenticacao.js')
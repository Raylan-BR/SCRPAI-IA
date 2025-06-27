from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

load_dotenv()

auth_bp = Blueprint('auth', __name__)
client = MongoClient(os.getenv("MONGO_URI"))
db = client.scrpai_ia
users = db.users

# Inicializa o Firebase Admin SDK
cred_path = os.getenv("FIREBASE_ADMIN_CREDENTIALS_PATH")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Cadastro tradicional
@auth_bp.route('/register', methods=['POST'])
def register():
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

# Login tradicional
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data['email']})
    
    if not user or not check_password_hash(user.get('password', ''), data['password']):
        return jsonify({"error": "Credenciais inválidas"}), 401
    
    return jsonify({
        "message": "Login realizado com sucesso",
        "user_name": user['name'],
        "user_email": user['email']
    })

# Login com Google
@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    if not token:
        return jsonify({"error": "Token não fornecido"}), 400

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        email = decoded_token.get('email')
        name = decoded_token.get('name') or "Usuário"  # Fallback caso name seja None
        
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
            # Atualiza o nome caso o usuário já exista mas não tenha nome
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
    
# Esqueceu senha
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
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


#renderizar as páginas html do login e do cadastro
BASE_DIRETORIO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

#renderizar login pagina
@auth_bp.route('/pages/autenticacao/login.html')
def login_html():
    caminho_html = os.path.join(BASE_DIRETORIO, 'frontend', 'pages', 'autenticacao')
    return send_from_directory(caminho_html, 'login.html')
#renderizar cadastro pagina
@auth_bp.route('/render-cadastro')
def cadastro_html():
    caminho_html = os.path.join(BASE_DIRETORIO, 'frontend', 'pages', 'autenticacao')
    return send_from_directory(caminho_html, 'cadastro.html')
# Rota para o CSS
@auth_bp.route('/frontend/css/autenticacao.css')
def login_css():
    caminho_css = os.path.join(BASE_DIRETORIO, 'frontend', 'css')
    return send_from_directory(caminho_css, 'autenticacao.css')
# Rota para o JS
@auth_bp.route('/frontend/js/autenticacao.js')
def login_js():
    caminho_js = os.path.join(BASE_DIRETORIO, 'frontend', 'js')
    return send_from_directory(caminho_js, 'autenticacao.js')
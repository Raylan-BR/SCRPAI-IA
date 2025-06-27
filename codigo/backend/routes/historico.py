from flask import Blueprint, send_from_directory, request, jsonify
import os
from datetime import datetime
from database import db  

historico_bp = Blueprint("historico",__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

@historico_bp.route('/historico.html')
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

# Função para salvar uma compra no banco de dados
def salvar_compra(user_email, origin, destination, travel_date, total_price, purchase_source, details, receipt_url=None):
    compra = {
        "user_email": user_email,              # Email do usuário que fez a compra
        "origin": origin,                      # Origem da viagem
        "destination": destination,            # Destino da viagem
        "travel_date": travel_date,            # Data da viagem
        "purchase_date": datetime.utcnow(),   # Data/hora atual da compra (registro do momento da compra)
        "total_price": float(total_price),    # Valor total da compra (convertido para float)
        "purchase_source": purchase_source,   # Fonte da compra (ex: 'formulario' ou 'chat')
        "details": details,                    # Detalhes extras da compra (passageiros, voo, etc)
        "receipt_url": receipt_url             # URL para o comprovante da compra (opcional)
    }
    # Insere o documento da compra na coleção "compras" do MongoDB
    db.compras.insert_one(compra)

# Rota para salvar a compra via requisição POST
@historico_bp.route('/salvar-compra', methods=['POST'])
def salvar_compra_route():
    data = request.json  # Recebe os dados enviados no corpo da requisição em JSON

    # Campos obrigatórios que devem existir no JSON recebido
    required_fields = ["user_email", "origin", "destination", "travel_date", "total_price", "purchase_source", "details"]
    # Verifica se todos os campos obrigatórios estão presentes nos dados recebidos
    if not all(field in data for field in required_fields):
        # Se algum campo estiver faltando, retorna erro 400 com mensagem
        return jsonify({"error": "Dados incompletos"}), 400
    
    # Chama a função salvar_compra para inserir os dados no banco
    salvar_compra(
        user_email=data["user_email"],
        origin=data["origin"],
        destination=data["destination"],
        travel_date=data["travel_date"],
        total_price=data["total_price"],
        purchase_source=data["purchase_source"],
        details=data["details"],
        receipt_url=data.get("receipt_url")  # Pega o campo receipt_url se existir, senão None
    )
    # Retorna uma mensagem de sucesso para o cliente
    return jsonify({"message": "Compra salva com sucesso"})

# Rota para buscar o histórico de compras de um usuário pelo email via GET
@historico_bp.route('/historico', methods=['GET'])
def get_historico():
    # Pega o parâmetro 'email' passado na URL (?email=usuario@exemplo.com)
    user_email = request.args.get('email')
    # Se não passar o email, retorna erro 400 com mensagem
    if not user_email:
        return jsonify({"error": "Email do usuário é obrigatório"}), 400
    
    # Busca todas as compras no banco feitas pelo email do usuário
    compras = list(db.compras.find({"user_email": user_email}))
    # O _id do MongoDB é um objeto, aqui convertemos para string para facilitar o uso no frontend
    for compra in compras:
        compra["_id"] = str(compra["_id"])
    # Retorna a lista de compras como JSON para o cliente
    return jsonify(compras)
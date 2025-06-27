import os
from flask import Blueprint, jsonify, send_file, request
from chatbot.logic import responder, verificar_resposta_modelo,extrair_dados_viagem, buscar_voo, gerar_id_email
import json

FRONTEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'frontend')
)

chatbot_bp = Blueprint('chatbot_route',__name__)
# Rota principal - carrega o HTML
@chatbot_bp.route("/index.html")
def index():
    return send_file(os.path.join(FRONTEND_DIR, 'index.html'))
# Rota para o CSS
@chatbot_bp.route("/css/<path:filename>")
def css(filename):
    return send_file(os.path.join(FRONTEND_DIR, 'css', filename))

# Rota para o JS
@chatbot_bp.route("/js/<path:filename>")
def js(filename):
    return send_file(os.path.join(FRONTEND_DIR, 'js', filename))
# Rota para o img
@chatbot_bp.route("/img/<path:filename>")
def img(filename):
    return send_file(os.path.join(FRONTEND_DIR, 'img', filename))
# Rota para o chatbot
@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    pergunta = data.get("message", "")
    userEmail = data.get("email", "")
    try:
        #chama o gemini para responder
        if userEmail == "":
            resposta = responder(userEmail, pergunta, False)
        else:
            resposta = responder(userEmail, pergunta, True)
        print(resposta)
        #return jsonify({"tipo": "0", "response": resposta})
        if verificar_resposta_modelo(resposta):
            dados_viagem = extrair_dados_viagem(resposta)
            #print(dados_viagem["partida"],dados_viagem["destino"],dados_viagem["data"])
            return buscar_voo(dados_viagem)
        #se não, então...
        return jsonify({"tipo": 0, "response": resposta})
    except Exception as e:
        print("\n\n\nERRO AO CHAMAR GEMINI: ", e,"\n\n\n")  # Mostra o erro real
        return jsonify({"response": "No momento estamos com problema no servidor"}), 500
    
@chatbot_bp.route("/conversa_chat", methods=["GET"])
def conversa_chat():
    email = request.args.get("email")
    if not email:
        return jsonify({"erro": "Email não fornecido"}), 400
    nome_arquivo = gerar_id_email(email)
    caminho_json = os.path.join(os.path.dirname(__file__), "..", "historico", nome_arquivo)
    if not os.path.exists(caminho_json):
        return jsonify([])  # ou 404 se quiser: return jsonify({"erro": "Histórico não encontrado"}), 404
    with open(caminho_json, "r", encoding="utf-8") as f:
        dados = json.load(f)
    return jsonify(dados)

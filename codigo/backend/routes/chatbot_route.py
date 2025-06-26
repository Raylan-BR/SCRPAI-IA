import os
from flask import Blueprint, jsonify, send_file, request
from chatbot.logic import responder, verificar_resposta_modelo,extrair_dados_viagem, buscar_voo

FRONTEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'frontend')
)

chatbot_bp = Blueprint('chatbot_route',__name__)
# Rota principal - carrega o HTML
@chatbot_bp.route("/")
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
    try:
        #chama o gemini para responder
        resposta = responder(pergunta, True)
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
    
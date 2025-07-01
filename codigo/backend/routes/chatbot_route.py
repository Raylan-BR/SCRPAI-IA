#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file chatbot_route.py
@brief Rotas para o chatbot de viagens
@author RAYLAN BRUNO SANTANA CARVALHO <raylan.bruno@discente.ufma.br>

Módulo responsável por todas as operações do chatbot:
- Servir arquivos estáticos (HTML, CSS, JS, imagens)
- Processar mensagens do chat
- Gerenciar histórico de conversas
- Buscar passagens aéreas
"""

import os
from flask import Blueprint, jsonify, send_file, request
from chatbot.logic import responder, verificar_resposta_modelo, extrair_dados_viagem, buscar_voo, gerar_id_email
import json

# Configuração do diretório frontend
FRONTEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'frontend')
)
"""@var FRONTEND_DIR
@brief Caminho absoluto para o diretório frontend
@details Contém:
- Arquivos HTML
- Recursos estáticos (CSS/JS)
- Imagens
"""

# Criação do Blueprint para rotas do chatbot
chatbot_bp = Blueprint('chatbot_route', __name__)
"""@var chatbot_bp
@brief Blueprint principal para rotas do chatbot
@details Gerencia endpoints relacionados a:
- Interface do chat
- Processamento de mensagens
- Histórico de conversas
"""

@chatbot_bp.route("/index.html")
def index():
    """Endpoint para servir a página principal do chat
    
    :return: Arquivo HTML da interface do chat
    :rtype: flask.Response
    """
    return send_file(os.path.join(FRONTEND_DIR, 'index.html'))

@chatbot_bp.route("/css/<path:filename>")
def css(filename):
    """Endpoint para servir arquivos CSS
    
    :param filename: Nome do arquivo CSS
    :return: Arquivo CSS solicitado
    :rtype: flask.Response
    """
    return send_file(os.path.join(FRONTEND_DIR, 'css', filename))

@chatbot_bp.route("/js/<path:filename>")
def js(filename):
    """Endpoint para servir arquivos JavaScript
    
    :param filename: Nome do arquivo JS
    :return: Arquivo JS solicitado
    :rtype: flask.Response
    """
    return send_file(os.path.join(FRONTEND_DIR, 'js', filename))

@chatbot_bp.route("/img/<path:filename>")
def img(filename):
    """Endpoint para servir arquivos de imagem
    
    :param filename: Nome do arquivo de imagem
    :return: Arquivo de imagem solicitado
    :rtype: flask.Response
    """
    return send_file(os.path.join(FRONTEND_DIR, 'img', filename))

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    """Endpoint principal para processamento de mensagens do chat
    
    :return: Resposta do chatbot ou resultados de voos
    :rtype: flask.Response
    :raises HTTPException: 500 em caso de erro no servidor
    
    Estrutura do JSON esperado:
    {
        "message": "texto da mensagem",
        "email": "email@usuario.com"
    }
    """
    data = request.json
    pergunta = data.get("message", "")
    userEmail = data.get("email", "")
    
    try:
        if userEmail == "":
            resposta = responder(userEmail, pergunta, False)
        else:
            resposta = responder(userEmail, pergunta, True)
        
        if verificar_resposta_modelo(resposta):
            dados_viagem = extrair_dados_viagem(resposta)
            return buscar_voo(dados_viagem)
            
        return jsonify({"tipo": 0, "response": resposta})
    except Exception as e:
        print("\n\n\nERRO AO CHAMAR GEMINI: ", e,"\n\n\n")
        return jsonify({"response": "No momento estamos com problema no servidor"}), 500

@chatbot_bp.route("/conversa_chat", methods=["GET"])
def conversa_chat():
    """Endpoint para recuperar histórico de conversas
    
    :query email: Email do usuário
    :return: Histórico de mensagens em JSON
    :rtype: flask.Response
    :raises HTTPException: 400 se email não for fornecido
    """
    email = request.args.get("email")
    if not email:
        return jsonify({"erro": "Email não fornecido"}), 400
        
    nome_arquivo = gerar_id_email(email)
    caminho_json = os.path.join(os.path.dirname(__file__), "..", "historico", nome_arquivo)
    
    if not os.path.exists(caminho_json):
        return jsonify([])
        
    with open(caminho_json, "r", encoding="utf-8") as f:
        dados = json.load(f)
    return jsonify(dados)

@chatbot_bp.route('/card-selecionado/<int:indice>', methods=['GET'])
def get_passagem_por_indice(indice):
    """Endpoint para obter detalhes de uma passagem específica
    
    :param indice: Índice da passagem no arquivo JSON
    :return: Dados da passagem solicitada
    :rtype: flask.Response
    :raises HTTPException: 
        - 404 se índice não existir
        - 500 em caso de erro no servidor
    """
    try:
        with open('passagens.json', 'r', encoding='utf-8') as f:
            passagens = json.load(f)

        if 0 <= indice < len(passagens):
            return jsonify(passagens[indice]), 200
        else:
            return jsonify({'erro': 'Índice fora do intervalo'}), 404

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
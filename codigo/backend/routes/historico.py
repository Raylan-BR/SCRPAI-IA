#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file historico.py
@brief Rotas para gerenciamento de histórico de compras
@author Seu Nome <seu.email@exemplo.com>

Módulo responsável por:
- Servir páginas do frontend relacionadas ao histórico
- Registrar novas compras no banco de dados
- Recuperar histórico de compras por usuário
"""

from flask import Blueprint, send_from_directory, request, jsonify
import os
from datetime import datetime
from database import db

# Configuração do Blueprint para rotas de histórico
historico_bp = Blueprint("historico", __name__)
"""@var historico_bp
@brief Blueprint principal para rotas de histórico
@details Gerencia endpoints relacionados a:
- Interface do histórico
- Registro de compras
- Consulta de dados históricos
"""

# Configuração do diretório base
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
"""@var BASE_DIR
@brief Caminho absoluto para o diretório raiz do projeto
@details Usado para localizar arquivos estáticos do frontend
"""

@historico_bp.route('/historico.html')
def historico_html():
    """Endpoint para servir a página HTML do histórico
    
    :return: Arquivo HTML da página de histórico
    :rtype: flask.Response
    """
    caminho_html = os.path.join(BASE_DIR, 'frontend', 'pages')
    return send_from_directory(caminho_html, 'historico.html')

@historico_bp.route('/frontend/css/historico.css')
def historico_css():
    """Endpoint para servir o CSS do histórico
    
    :return: Arquivo CSS da página de histórico
    :rtype: flask.Response
    """
    caminho_css = os.path.join(BASE_DIR, 'frontend', 'css')
    return send_from_directory(caminho_css, 'historico.css')

@historico_bp.route('/frontend/js/historico.js')
def historico_js():
    """Endpoint para servir o JavaScript do histórico
    
    :return: Arquivo JS da página de histórico
    :rtype: flask.Response
    """
    caminho_js = os.path.join(BASE_DIR, 'frontend', 'js')
    return send_from_directory(caminho_js, 'historico.js')

def salvar_compra(user_email, origin, destination, travel_date, total_price, purchase_source, details, receipt_url=None):
    """Registra uma nova compra no banco de dados
    
    :param user_email: Email do usuário
    :param origin: Cidade de origem da viagem
    :param destination: Cidade de destino da viagem
    :param travel_date: Data da viagem (formato string)
    :param total_price: Valor total da compra
    :param purchase_source: Origem da compra ('formulario' ou 'chat')
    :param details: Detalhes adicionais da compra
    :param receipt_url: URL do comprovante (opcional)
    :return: None
    """
    compra = {
        "user_email": user_email,
        "origin": origin,
        "destination": destination,
        "travel_date": travel_date,
        "purchase_date": datetime.utcnow(),
        "total_price": float(total_price),
        "purchase_source": purchase_source,
        "details": details,
        "receipt_url": receipt_url
    }
    db.compras.insert_one(compra)

@historico_bp.route('/salvar-compra', methods=['POST'])
def salvar_compra_route():
    """Endpoint para registro de novas compras via POST
    
    :return: Mensagem de sucesso/erro
    :rtype: flask.Response
    :raises HTTPException: 400 se dados estiverem incompletos
    
    Estrutura do JSON esperado:
    {
        "user_email": "email@exemplo.com",
        "origin": "São Paulo",
        "destination": "Rio de Janeiro",
        "travel_date": "15-07-2023",
        "total_price": 599.99,
        "purchase_source": "formulario",
        "details": {...},
        "receipt_url": "http://..." (opcional)
    }
    """
    data = request.json
    required_fields = ["user_email", "origin", "destination", "travel_date", "total_price", "purchase_source", "details"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Dados incompletos"}), 400
    
    salvar_compra(
        user_email=data["user_email"],
        origin=data["origin"],
        destination=data["destination"],
        travel_date=data["travel_date"],
        total_price=data["total_price"],
        purchase_source=data["purchase_source"],
        details=data["details"],
        receipt_url=data.get("receipt_url")
    )
    return jsonify({"message": "Compra salva com sucesso"})

@historico_bp.route('/loadHistorico', methods=['GET'])
def get_historico():
    """Endpoint para consulta de histórico de compras
    
    :query email: Email do usuário para filtro
    :return: Lista de compras em JSON
    :rtype: flask.Response
    :raises HTTPException: 400 se email não for fornecido
    """
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({"error": "Email do usuário é obrigatório"}), 400
    
    compras = list(db.compras.find({"user_email": user_email}))
    for compra in compras:
        compra["_id"] = str(compra["_id"])
    return jsonify(compras)
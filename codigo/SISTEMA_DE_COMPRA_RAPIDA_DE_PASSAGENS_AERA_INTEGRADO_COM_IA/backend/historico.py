#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file historico.py
@brief Blueprint para gerenciamento de histórico de compras
@author LILIA ROSA COELHO MOURA <lilia.rosa@discente.ufma.br>

Módulo responsável por operações relacionadas ao histórico de compras de viagens:
- Armazenamento de novas compras
- Recuperação do histórico de compras
- Gerenciamento de dados de transações
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db

# Cria blueprint para rotas de histórico
historico_bp = Blueprint('historico', __name__)
"""@var historico_bp
@brief Blueprint para rotas de histórico de compras
@details Agrupa endpoints relacionados ao gerenciamento de:
- Registro de novas compras
- Consulta de histórico
- Dados transacionais
"""

def salvar_compra(user_email, origin, destination, travel_date, total_price, purchase_source, details, receipt_url=None):
    """Armazena uma nova compra no banco de dados.
    
    :param user_email: (str) Email do usuário que realizou a compra
    :param origin: (str) Cidade de origem da viagem
    :param destination: (str) Cidade de destino da viagem
    :param travel_date: (str) Data da viagem no formato 'dd-mm-aaaa'
    :param total_price: (float) Valor total da compra
    :param purchase_source: (str) Fonte da compra ('formulario' ou 'chat')
    :param details: (dict) Detalhes adicionais da compra
    :param receipt_url: (str, optional) URL do comprovante da compra
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
    """Endpoint para registro de novas compras via POST.
    
    :return: JSON com resultado da operação
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
        "receipt_url": "http://..."
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
    """Endpoint para consulta de histórico de compras via GET.
    
    :query email: (str) Email do usuário para filtrar as compras
    :return: JSON com lista de compras do usuário
    :rtype: flask.Response
    :raises HTTPException: 400 se email não for fornecido
    
    Exemplo de chamada:
    GET /loadHistorico?email=usuario@exemplo.com
    """
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({"error": "Email do usuário é obrigatório"}), 400
    
    compras = list(db.compras.find({"user_email": user_email}))
    for compra in compras:
        compra["_id"] = str(compra["_id"])
    return jsonify(compras)
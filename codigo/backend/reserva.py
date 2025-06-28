from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
import random
from dotenv import load_dotenv

load_dotenv()

reserva_bp = Blueprint('reserva', __name__)
client = MongoClient(os.getenv("MONGO_URI"))
db = client.scrpai_ia
voos = db.voos
reservas = db.reservas

@reserva_bp.route('/detalhes-voo/<voo_id>', methods=['GET'])
def detalhes_voo(voo_id):
    try:
        voo = voos.find_one({"_id": ObjectId(voo_id)})
        if not voo:
            return jsonify({"error": "Voo não encontrado"}), 404
        
        fileiras = ['A', 'B', 'C', 'D', 'E', 'F']
        mapa_assentos = []
        assentos_disponiveis = voo.get('assentos_disponiveis', 180)

        for num_fileira in range(1, 31):
            for letra in fileiras:
                if num_fileira == 1 and letra in ['E']:
                    continue
                
                assento = f"{num_fileira}{letra}"
                disponivel = random.random() < (assentos_disponiveis / 180)
                
                if disponivel and assentos_disponiveis > 0:
                    mapa_assentos.append({"numero": assento, "disponivel": True})
                    assentos_disponiveis -= 1
                else:
                    mapa_assentos.append({"numero": assento, "disponivel": False})

        response = {
            "voo_id": str(voo["_id"]),
            "companhia": voo.get("companhia", "Desconhecida"),
            "origem": voo.get("origem", ""),
            "destino": voo.get("destino", ""),
            "data_partida": voo.get("data_partida", ""),
            "hora_partida": voo.get("hora_partida", ""),
            "hora_chegada": voo.get("hora_chegada", ""),
            "duracao": voo.get("duracao", ""),
            "aeronave": voo.get("aeronave", "Airbus A320"),
            "preco_base": voo.get("preco", 0),
            "mapa_assentos": mapa_assentos,
            "bagagens": [
                {"tipo": "Sem bagagem despachada", "preco": 0},
                {"tipo": "1 Mala de 23kg", "preco": 100},
                {"tipo": "2 Malas de 23kg", "preco": 180},
                {"tipo": "Bagagem extra", "preco": 60}
            ]
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route('/criar-reserva', methods=['POST'])
def criar_reserva():
    try:
        data = request.json
        voo_id = data.get('voo_id')
        assentos = data.get('assentos', [])
        bagagem = data.get('bagagem')
        usuario_email = data.get('usuario_email', 'anonimo@example.com')

        if not voo_id or not assentos:
            return jsonify({"error": "Dados incompletos"}), 400

        voo = voos.find_one({"_id": ObjectId(voo_id)})
        if not voo:
            return jsonify({"error": "Voo não encontrado"}), 404

        bagagens_opcoes = [
            {"tipo": "Sem bagagem despachada", "preco": 0},
            {"tipo": "1 Mala de 23kg", "preco": 100},
            {"tipo": "2 Malas de 23kg", "preco": 180},
            {"tipo": "Bagagem extra", "preco": 60}
        ]

        preco_bagagem = next(
            (item['preco'] for item in bagagens_opcoes if item['tipo'] == bagagem),
            0
        )

        preco_total = (voo['preco'] * len(assentos)) + preco_bagagem

        reserva = {
            "voo_id": ObjectId(voo_id),
            "usuario_email": usuario_email,
            "assentos": assentos,
            "bagagem": bagagem,
            "preco_total": preco_total,
            "status": "pendente_pagamento",
            "data_criacao": datetime.now(),
            "detalhes_voo": {
                "origem": voo['origem'],
                "destino": voo['destino'],
                "data": voo['data_partida'],
                "hora": voo['hora_partida'],
                "companhia": voo['companhia'],
                "aeronave": voo.get('aeronave', 'Airbus A320')
            }
        }

        result = reservas.insert_one(reserva)

        voos.update_one(
            {"_id": ObjectId(voo_id)},
            {"$inc": {"assentos_disponiveis": -len(assentos)}}
        )

        return jsonify({
            "success": True,
            "reserva_id": str(result.inserted_id),
            "preco_total": preco_total,
            "detalhes": {
                "origem": voo['origem'],
                "destino": voo['destino'],
                "data": voo['data_partida'],
                "hora": voo['hora_partida'],
                "assentos": assentos,
                "bagagem": bagagem,
                "companhia": voo['companhia']
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

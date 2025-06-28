from gemini_api.client import model
import re
import os
from datetime import datetime
import json
from flask import jsonify
from mock.passagens_mock import gerar_passagens_mock

# Caminho da pasta onde os históricos ficarão salvos
PASTA_HISTORICOS = os.path.join(os.path.dirname(__file__), "..", "historico")
os.makedirs(PASTA_HISTORICOS, exist_ok=True)

# Função para gerar nome de arquivo a partir do e-mail
def gerar_id_email(email):
    return email.replace("@", "_at_").replace(".", "_dot_") + ".json"

# Caminho completo para o arquivo do usuário
def caminho_do_historico(email):
    return os.path.join(PASTA_HISTORICOS, gerar_id_email(email))

# Carregar o histórico com base no e-mail
def carregar_historico(email):
    caminho = caminho_do_historico(email)

    if os.path.exists(caminho):
        with open(caminho, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        hoje = datetime.now().strftime("%d-%m-%Y")
        historico_inicial = [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"Hoje é {hoje}. Você é um assistente de viagens inteligente. "
                            "Seu objetivo é descobrir a cidade de origem, destino e data da viagem do usuário. "
                            "Ajude o usuário com recomendações de cidades interessantes ao longo da conversa. "
                            "Somente quando descobrir todas as três informações, responda: origem: codigo iata da cidade de origem, destino: codigo iata da cidade de destino, data: d-m-y "
                            "Pergunte e responda de forma simples e curta."
                        )
                    }
                ]
            }
        ]
        salvar_historico(email, historico_inicial)
        print(f"Arquivo criado: {caminho}")
        return historico_inicial

# Salvar histórico com base no e-mail
def salvar_historico(email, historico):
    caminho = caminho_do_historico(email)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)
    print(f"Histórico salvo: {caminho}")

# Função principal adaptada
def responder(email, mensagem_usuario, salvar=True):
    # Se o email for vazio, apenas responde sem salvar nada
    if email == "":
        chat = model.start_chat(history=[])
        resposta = chat.send_message(mensagem_usuario)
        return resposta.text

    # Caso contrário, carregar e salvar histórico normalmente
    historico = carregar_historico(email)
    
    chat = model.start_chat(history=historico)
    resposta = chat.send_message(mensagem_usuario)

    if salvar:
        historico.append({
            "role": "user",
            "parts": [{"text": mensagem_usuario}]
        })
        historico.append({
            "role": "model",
            "parts": [{"text": resposta.text}]
        })
        salvar_historico(email, historico)

    return resposta.text

def verificar_resposta_modelo(frase: str) -> bool:
    print("verificando resposta...")
    frase = frase.lower()
    if "origem" in frase and "destino" in frase and "data" in frase:
        return True
    else:
        return False

def extrair_dados_viagem(frase: str):
    print("extraindo dados...")
    padrao = r"origem:\s*(.+?),\s*destino:\s*(.+?),\s*data:\s*(\d{2}-\d{2}-\d{4})"
    match = re.search(padrao, frase, re.IGNORECASE)

    if match:
        origem = match.group(1).strip()
        destino = match.group(2).strip()
        data = match.group(3).strip()
        return {
            "origem": origem,
            "destino": destino,
            "data": data
        }
    else:
        return False

def buscar_voo(dados_viagem):
    passagens = gerar_passagens_mock(dados_viagem['origem'], dados_viagem['destino'], dados_viagem['data'])
    resultado = {
        "tipo": 1,
        "voo": passagens
    }
    return jsonify(resultado)

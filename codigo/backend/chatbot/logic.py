from gemini_api.client import model
import re
import os
from datetime import datetime
import json

# Caminho do arquivo de histórico
CAMINHO_HISTORICO = "historico.json"

# Função para carregar o histórico do arquivo
def carregar_historico():
    if os.path.exists(CAMINHO_HISTORICO):
        with open(CAMINHO_HISTORICO, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        # Se não existir, cria com a mensagem de sistema
        hoje = datetime.now().strftime("%d/%m/%Y")
        historico_inicial = [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"Hoje é {hoje}. Você é um assistente de viagens inteligente. "
                            "Seu objetivo é descobrir a cidade de origem, destino e data da viagem do usuário. "
                            "Ajude o usuário com recomendações de cidades interessantes ao longo da conversa. "
                            "Somente quando descobrir todas as três informações, responda: partida: cidade-partida, destino: cidade-destino, data: dd/mm/aa. "
                            "Pergunte e responda de forma simples e curta."
                        )
                    }
                ]
            }
        ]
        salvar_historico(historico_inicial)
        print("carregado no historico")
        return historico_inicial

# Função para salvar o histórico no arquivo
def salvar_historico(historico):
    with open(CAMINHO_HISTORICO, "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)
    print("salvo no historico")

# Função principal
def responder(mensagem_usuario):
    historico = carregar_historico()
    
    chat = model.start_chat(history=historico)
    resposta = chat.send_message(mensagem_usuario)

    # Adiciona a nova troca ao histórico
    historico.append({
        "role": "user",
        "parts": [{"text": mensagem_usuario}]
    })
    historico.append({
        "role": "model",
        "parts": [{"text": resposta.text}]
    })

    salvar_historico(historico)

    return resposta.text

def verificar_resposta_modelo(frase: str) -> bool:
    print("verificando resposta...")
    frase = frase.lower()
    if "partida" in frase and "destino" in frase and "data" in frase:
        return True
    else:
        return False

def extrair_dados_viagem(frase: str):
    print("extraindo dados...")
    padrao = r"partida:\s*(.+?),\s*destino:\s*(.+?),\s*data:\s*(\d{2}/\d{2}/\d{2})"
    match = re.search(padrao, frase, re.IGNORECASE)

    if match:
        partida = match.group(1).strip().title()
        destino = match.group(2).strip().title()
        data = match.group(3).strip()
        return {
            "partida": partida,
            "destino": destino,
            "data": data
        }
    else:
        return False

def buscar_voo(dados_viagem):
    print("buscando voos")
    return {
        "tipo": 1,
        "partida": dados_viagem["partida"],
        "destino": dados_viagem["destino"],
        "data": dados_viagem["data"]
    }

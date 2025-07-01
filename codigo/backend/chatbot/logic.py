#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file logic.py
@brief Módulo principal do Assistente de Viagens - Gerencia histórico de conversas, busca de voos e filtros personalizados
@author Seu Nome <seu.email@exemplo.com>
"""

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

def gerar_id_email(email):
    """Gera um ID de arquivo válido a partir de um e-mail.
    
    :param (str) email: E-mail do usuário (ex: "usuario@exemplo.com")
    :return (str): String com o e-mail formatado (ex: "usuario_at_exemplo_dot_com.json")
    """
    return email.replace("@", "_at_").replace(".", "_dot_") + ".json"

def caminho_do_historico(email):
    """Retorna o caminho completo do arquivo de histórico.
    
    :param (str) email: E-mail do usuário
    :return (str): Caminho absoluto do arquivo JSON de histórico
    """
    return os.path.join(PASTA_HISTORICOS, gerar_id_email(email))

def carregar_historico(email):
    """Carrega o histórico de conversas de um usuário ou cria um novo.
    
    :param (str) email: E-mail do usuário
    :return (list): Lista com o histórico de mensagens (formato Gemini API)
    :note: Se o arquivo não existir, cria um histórico inicial com instruções para o modelo
    """
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
                            "Seu objetivo é descobrir a cidade de origem, destino e data da viagem do usuário e o tipo de viagem (trabalho ou turismo)"
                            "Ajude o usuário com recomendações de cidades interessantes ao longo da conversa. "
                            "Somente quando descobrir todas as quatro informações, responda: origem: nome da cidade de origem, destino: nome da cidade de destino, data: d-m-y, tipo: trabalho ou turismo"
                            "Pergunte e responda de forma simples e curta."
                        )
                    }
                ]
            }
        ]
        salvar_historico(email, historico_inicial)
        print(f"Arquivo criado: {caminho}")
        return historico_inicial

def salvar_historico(email, historico):
    """Salva o histórico de conversas em um arquivo JSON.
    
    :param (str) email: E-mail do usuário
    :param (list) historico: Lista de mensagens no formato Gemini API
    :return None:
    """
    caminho = caminho_do_historico(email)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)
    print(f"Histórico salvo: {caminho}")

def responder(email, mensagem_usuario, salvar=True):
    """Função principal que processa mensagens do usuário e retorna respostas.
    
    :param (str) email: E-mail do usuário (string vazia para sessões anônimas)
    :param (str) mensagem_usuario: Texto enviado pelo usuário
    :param (bool) salvar: Se False, não atualiza o histórico (opcional, padrão=True)
    :return (str): Resposta do modelo Gemini
    """
    if email == "":
        chat = model.start_chat(history=[])
        resposta = chat.send_message(mensagem_usuario)
        return resposta.text

    historico = carregar_historico(email)
    chat = model.start_chat(history=historico)
    resposta = chat.send_message(mensagem_usuario)

    if salvar:
        historico.append({"role": "user", "parts": [{"text": mensagem_usuario}]})
        historico.append({"role": "model", "parts": [{"text": resposta.text}]})
        salvar_historico(email, historico)

    return resposta.text

def verificar_resposta_modelo(frase: str) -> bool:
    """Verifica se a resposta do modelo contém todos os dados necessários.
    
    :param (str) frase: Texto da resposta do modelo
    :return (bool): True se contém origem, destino, data e tipo
    """
    print("verificando resposta...")
    frase = frase.lower()
    if "origem:" in frase and "destino:" in frase and "data:" in frase and "tipo:" in frase:
        return True
    else:
        return False

def extrair_dados_viagem(frase: str):
    """Extrai dados estruturados da resposta do modelo.
    
    :param (str) frase: Texto contendo os dados (ex: "Origem: São Paulo, Destino: Rio...")
    :return (dict|bool): Dicionário com {origem, destino, data, tipo} ou False se inválido
    """
    print("extraindo dados...")
    padrao = r"origem:\s*([^,]+),\s*destino:\s*([^,]+),\s*data:\s*(\d{2}-\d{2}-\d{4}),\s*tipo:\s*([^\n\r]+)"
    match = re.search(padrao, frase, re.IGNORECASE)

    if match:
        origem = match.group(1).strip().title()
        destino = match.group(2).strip().title()
        data = match.group(3).strip().title()
        tipo = match.group(4).strip().title()
        return {
            "origem": origem,
            "destino": destino,
            "data": data,
            "tipo": tipo
        }
    else:
        return False

def buscar_voo(dados_viagem):
    """Busca voos com base nos dados do usuário e aplica filtros.
    
    :param (dict) dados_viagem: Dicionário com {origem, destino, data, tipo}
    :return (flask.Response): Resposta JSON com voos filtrados e motivo da filtragem
    """
    print("buscando voos...")
    passagens = gerar_passagens_mock(dados_viagem['origem'], dados_viagem['destino'], dados_viagem['data'])
    print("\n\n\nquantidade total: ", len(passagens), "\n\n\n")
    if dados_viagem['tipo'] == "Turismo":
        passagens = filtrar_para_turistas(passagens)
        resultado = {
        "motivo": "Busquei as passagens de classe econômica de até R$ 600,00.",
        "tipo": 1,
        "voo": passagens
    }
        print("\n\n\nquantidade filtrada: ", len(passagens), "\n\n\n")
        salvar_passagens_em_json(passagens)
        return jsonify(resultado)
    elif dados_viagem['tipo']== "Trabalho":
        passagens = filtrar_para_corporativos(passagens)
        resultado = {
            "motivo": "Busquei as passagens de classe executiva, voos diretos em horários comerciais.",
            "tipo": 1,
            "voo": passagens
    }
        print("\n\n\nquantidade filtrada: ", len(passagens), "\n\n\n")
        salvar_passagens_em_json(passagens)
        return jsonify(resultado)

def filtrar_para_turistas(passagens):
    """Filtra passagens para perfil de turista.
    
    :param (list) passagens: Lista de passagens brutas
    :return (list): Lista filtrada por: preço <= R$600, classe Econômica, <=2 escalas
    """
    print("Filtrando para turistas...")

    # 1. Filtro
    filtradas = [
        p for p in passagens
        if p["preco"] <= 600
        and p["classe"] == "Econômica"
        and p["escalas"] <= 2
    ]

    # 2. Ordenar por preço crescente
    return sorted(filtradas, key=lambda p: p["preco"])

def filtrar_para_corporativos(passagens):
    """Filtra passagens para perfil corporativo.
    
    :param (list) passagens: Lista de passagens brutas
    :return (list): Lista filtrada por: classe Executiva, voos diretos, ordenada por duração
    """
    print("Filtrando para corporativos...")

    def duracao_em_minutos(duracao_str):
        # Exemplo: "2h30min" → 150 minutos
        horas, minutos = 0, 0
        if "h" in duracao_str and "min" in duracao_str:
            partes = duracao_str.replace("min", "").split("h")
            horas = int(partes[0])
            minutos = int(partes[1])
        return horas * 60 + minutos

    # 1. Filtro corporativo
    filtradas = [
        p for p in passagens
        if p["classe"] == "Executiva"
        and p["escalas"] == 0
    ]

    # 2. Ordenar por menor duração
    return sorted(filtradas, key=lambda p: duracao_em_minutos(p["duracao"]))

def salvar_passagens_em_json(lista_passagens):
    """Salva a lista de passagens em um arquivo JSON.
    
    :param (list) lista_passagens: Lista de dicionários com dados de voos
    :return None:
    """
    try:
        with open('passagens.json', 'w', encoding='utf-8') as f:
            json.dump(lista_passagens, f, indent=4, ensure_ascii=False)
        print(f"Passagens salvas em 'passagens.json'.")
    except Exception as e:
        print(f"Erro ao salvar passagens: {e}")
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file mainChat.py
@brief Módulo de chat interativo para planejamento de viagens usando Google Gemini
@author Seu Nome <seu.email@exemplo.com>
"""

from backend.config.settings import GOOGLE_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.chat_history import BaseChatMessageHistory 
from langchain.memory import ConversationBufferMemory
from datetime import date
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# Obtém a data atual para usar nas instruções do chat
hoje = date.today()

def Chat():
    """Função principal que inicia o chat interativo de viagens.
    
    Configura o modelo Gemini e gerencia a conversa com o usuário,
    coletando informações sobre origem, destino, data e motivo da viagem.
    """
    
    # Configuração do modelo Gemini com temperatura baixa para respostas mais focadas
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash", 
        google_api_key=GOOGLE_API_KEY, 
        temperature=0.1
    )
    
    # Configuração da memória da conversa
    memory = ConversationBufferMemory(return_messages=True)
    historico = memory.chat_memory.messages
    
    # Instruções iniciais para o modelo
    instrucoes = (
        f"Hoje é {hoje}. Quero que você atue como um assistente de viagens inteligente."
        "Seu objetivo principal é descobrir as seguintes informações do usuário, não pergunte de uma vez: "
        "cidade de origem, Cidade de destino, Data da viagem, Motivo da viagem (trabalho ou lazer). "
        "Se a viagem for a lazer, sugira também um ponto turístico interessante na cidade de destino. "
        "Você deve fazer perguntas claras, simples e objetivas caso o usuário não informe todos os dados. "
        "Ao identificar a cidade de destino, pesquise ou use seu conhecimento para indicar uma atração turística popular. "
        "Mantenha o diálogo natural e eficiente, coletando os dados passo a passo se necessário."
    )
    
    # Adiciona as instruções iniciais ao histórico do chat
    memory.chat_memory.add_message(SystemMessage(content=instrucoes))
    
    print("Chat iniciado! Digite 'sair' para encerrar.\n")
    
    # Loop principal da conversa
    while True:
        # Obtém entrada do usuário
        entrada = input("Você: ")
        
        # Verifica se o usuário quer encerrar o chat
        if entrada.lower() in ("sair", "exit", "quit"):
            print("Encerrando o chat. Até mais!")
            break

        # Adiciona a mensagem do usuário ao histórico
        historico.append(HumanMessage(content=entrada))
        
        # Obtém resposta do modelo
        resposta = llm.invoke(historico)
        print(f"Bot: {resposta.content}\n")

        # Adiciona a resposta do modelo ao histórico
        historico.append(AIMessage(content=resposta.content))
    
if __name__ == "__main__":
    # Ponto de entrada principal
    Chat()
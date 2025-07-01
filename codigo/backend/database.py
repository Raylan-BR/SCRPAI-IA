#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file database.py
@brief Configuração da conexão com o banco de dados MongoDB
@author Seu Nome <seu.email@exemplo.com>

Módulo responsável por estabelecer a conexão com o banco de dados MongoDB
e disponibilizar a instância do banco de dados para outros módulos da aplicação.
"""

from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()
"""@brief Carrega configurações de ambiente
@details Busca as variáveis definidas no arquivo .env na raiz do projeto
para configuração da conexão com o banco de dados.
"""

# Cria a conexão com o MongoDB usando a URI definida nas variáveis de ambiente
client = MongoClient(os.getenv("MONGO_URI"))
"""@var client
@brief Cliente de conexão com o MongoDB
@details Instância do MongoClient configurada para se conectar ao cluster MongoDB.
Utiliza a URI de conexão definida na variável de ambiente MONGO_URI.
"""

# Acessa o banco de dados específico da aplicação
db = client.scrpai_ia
"""@var db
@brief Instância do banco de dados principal
@details Referência ao banco de dados 'scrpai_ia' no MongoDB contendo:
- Coleções de usuários
- Dados de histórico
- Informações de reservas
"""

# Documentação adicional para Doxygen
"""@namespace database
@brief Namespace contendo todas as configurações de banco de dados
"""
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file settings.py
@brief Configuração de variáveis de ambiente e chaves de API
@author Seu Nome <seu.email@exemplo.com>
"""

import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Variável global que armazena a chave da API Google
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
"""@var GOOGLE_API_KEY
@brief Chave de API para autenticação com os serviços Google
@details Esta variável armazena a chave necessária para acesso à API Google Generative AI.
O valor é obtido do arquivo .env através da variável de ambiente 'GOOGLE_API_KEY'.
"""
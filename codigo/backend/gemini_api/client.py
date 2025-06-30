"""@file client.py
@brief Configuração do modelo generativo Gemini para aplicações de IA
@author Seu Nome <seu.email@exemplo.com>
"""

import google.generativeai as genai
from config.settings import GOOGLE_API_KEY

# Configuração inicial da API
genai.configure(api_key=GOOGLE_API_KEY)
"""@brief Configura a chave de API para autenticação nos serviços Google Generative AI
@details Esta configuração deve ser realizada antes de qualquer interação com a API.
A chave é obtida do módulo de configurações locais (config.settings).
@param api_key (str): Chave de autenticação para a API
@return None
"""

model = genai.GenerativeModel("gemini-2.0-flash")
"""@var model
@brief Instância do modelo generativo Gemini 2.0 Flash
@details Modelo de linguagem configurado para geração de conteúdo.
Características principais:
- Versão 'flash' otimizada para respostas rápidas
- Balanceamento entre desempenho e qualidade
- Adequado para aplicações em tempo real
"""
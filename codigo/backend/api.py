#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""@file api.py
@brief Aplicação principal da API de gerenciamento de viagens
@author Seu Nome <seu.email@exemplo.com>

Módulo responsável pela configuração inicial da aplicação Flask e registro dos blueprints.
"""

from flask import Flask
from flask_cors import CORS
from database import db
from auth import auth_bp
from historico import historico_bp
from reserva import reserva_bp

# Configuração da aplicação Flask
app = Flask(__name__)
"""@var app
@brief Instância principal da aplicação Flask
@details Configura a aplicação web e gerencia os endpoints da API.
"""

# Habilita CORS para todas as rotas
CORS(app)
"""@brief Habilita Cross-Origin Resource Sharing (CORS)
@details Permite requisições de diferentes origens para a API.
"""

# Registro dos blueprints (módulos da aplicação)
app.register_blueprint(auth_bp)
"""@var auth_bp
@brief Blueprint de autenticação
@details Gerencia rotas relacionadas a login, registro e autenticação de usuários.
"""

app.register_blueprint(historico_bp)
"""@var historico_bp
@brief Blueprint de histórico
@details Gerencia rotas relacionadas ao histórico de conversas e buscas.
"""

app.register_blueprint(reserva_bp)
"""var reserva_bp
@brief Blueprint de reservas
@details Gerencia rotas relacionadas a reservas de passagens e hospedagens.
"""

@app.route('/')
def home():
    """Endpoint raiz da API que verifica o status do serviço.
    
    :return: (dict) Dicionário com status da API no formato JSON
    :rtype: dict
    
    Exemplo de retorno:
        {
            "status": "API rodando com sucesso!"
        }
    """
    return {"status": "API rodando com sucesso!"}

if __name__ == '__main__':
    """Ponto de entrada principal para execução local do servidor.
    
    :note: O modo debug é ativado para desenvolvimento.
    :warning: Não utilizar em produção com debug=True.
    """
    app.run(debug=True)
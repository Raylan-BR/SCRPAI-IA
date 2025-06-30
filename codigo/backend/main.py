"""@file main.py
@brief Aplicação principal da API de gerenciamento de viagens
@author Seu Nome <seu.email@exemplo.com>

Módulo principal que configura e inicializa a aplicação Flask com todos os blueprints:
- Autenticação (auth_bp)
- Chatbot (chatbot_bp) 
- Histórico (historico_bp)
- Perfil (perfil_bp)
- Reservas (reserva_bp)
- Pagamentos (pagamento_bp)
"""

from flask import Flask
from flask_cors import CORS
from routes.chatbot_route import chatbot_bp
from routes.historico import historico_bp
from routes.perfil import perfil_bp
from routes.reserva import reserva_bp
from routes.pagamento import pagamento_bp
from auth import auth_bp

# Cria instância principal da aplicação Flask
app = Flask(__name__)
"""@var app
@brief Instância principal da aplicação Flask
@details Configuração base para toda a API com:
- Registro de blueprints
- Configuração de CORS
- Definição de rotas principais
"""

# Habilita CORS para todos os domínios
CORS(app)
"""@brief Configura políticas CORS
@details Permite requisições cross-origin de:
- Todos os endpoints
- Todos os métodos HTTP
- Todos os headers
"""

# Registra todos os blueprints da aplicação
app.register_blueprint(chatbot_bp)
"""@var chatbot_bp 
@brief Blueprint de interação com chatbot
@details Rotas para:
- Processamento de mensagens
- Integração com IA
- Gerenciamento de conversas
"""

app.register_blueprint(historico_bp)
"""@var historico_bp
@brief Blueprint de histórico de viagens
@details Rotas para:
- Consulta de histórico
- Registro de novas viagens
- Gerenciamento de dados históricos
"""

app.register_blueprint(perfil_bp)
"""@var perfil_bp
@brief Blueprint de gerenciamento de perfil
@details Rotas para:
- Atualização de dados
- Preferências de usuário
- Configurações de conta
"""

app.register_blueprint(auth_bp)
"""@var auth_bp
@brief Blueprint de autenticação
@details Rotas para:
- Login/Cadastro tradicional
- Autenticação social
- Recuperação de senha
"""

app.register_blueprint(reserva_bp)
"""@var reserva_bp
@brief Blueprint de reservas
@details Rotas para:
- Criação de reservas
- Consulta de disponibilidade
- Gerenciamento de bookings
"""

app.register_blueprint(pagamento_bp)
"""@var pagamento_bp
@brief Blueprint de pagamentos
@details Rotas para:
- Processamento de pagamentos
- Integração com gateways
- Histórico transacional
"""

if __name__ == '__main__':
    """Ponto de entrada principal para execução local
    
    :note: Modo debug ativado para desenvolvimento
    :warning: Não utilizar em produção com debug=True
    """
    app.run(debug=True)
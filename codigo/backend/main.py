from flask import Flask
from flask_cors import CORS
from routes.chatbot_route import chatbot_bp
from routes.historico import historico_bp
from routes.perfil import perfil_bp
from routes.reserva import reserva_bp
from routes.pagamento import pagamento_bp
from auth import auth_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(chatbot_bp)
app.register_blueprint(historico_bp)
app.register_blueprint(perfil_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(reserva_bp)
app.register_blueprint(pagamento_bp)

if __name__ == '__main__':
    app.run(debug=True)
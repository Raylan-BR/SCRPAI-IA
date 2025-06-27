from flask import Flask
from flask_cors import CORS
from database import db
from auth import auth_bp
from historico import historico_bp
from reserva import reserva_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(historico_bp)
app.register_blueprint(reserva_bp)

@app.route('/')
def home():
    return {"status": "API rodando com sucesso!"}

if __name__ == '__main__':
    app.run(debug=True)

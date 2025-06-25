from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client.scrpai_ia  # nome do banco

# importa as rotas de autenticação
from auth import auth_bp
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return {"status": "API rodando com sucesso!"}

if __name__ == '__main__':
    app.run(debug=True)

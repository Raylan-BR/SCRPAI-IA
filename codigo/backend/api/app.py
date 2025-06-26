from flask import Flask, request, jsonify
from amadeus_client import buscar_voos
from formatador import formatar_voo

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# app = Flask(__name__)

@app.route("/api/voos", methods=["GET"])
def voos():
    origem = request.args.get("origem")
    destino = request.args.get("destino")
    data = request.args.get("data")
    adultos = int(request.args.get("adultos", 1))

    resultado_bruto = buscar_voos(origem, destino, data, adultos)

    # Se for erro
    if isinstance(resultado_bruto, dict) and "erro" in resultado_bruto:
        return jsonify(resultado_bruto), 500

    # Filtrar os dados
    resultado_filtrado = formatar_voo(resultado_bruto)
    return jsonify(resultado_filtrado)

if __name__ == "__main__":
    app.run(debug=True)

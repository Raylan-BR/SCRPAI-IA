from amadeus import Client, ResponseError
from dotenv import load_dotenv
import os

load_dotenv()

amadeus = Client(
    client_id=os.getenv("Tnmlpf1ahFUOTvarigqiwbyArmF64c4j"),
    client_secret=os.getenv("YfTgcGmfjOGJ8iqI")
)

def buscar_voos(origem, destino, data, adultos):
    try:
        print(f"Enviando requisição: origem={origem}, destino={destino}, data={data}, adultos={adultos}")

        resposta = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origem,
            destinationLocationCode=destino,
            departureDate=data,
            adults=adultos,
            max=5
        )
        return resposta.data
    except ResponseError as erro:
        print("Erro da Amadeus:", erro)
        return {"erro": str(erro)}

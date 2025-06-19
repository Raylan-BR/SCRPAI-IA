from amadeus import Client, ResponseError
from dotenv import load_dotenv
import os

load_dotenv()

amadeus = Client(
    client_id=os.getenv("AMADEUS_CLIENT_ID"),
    client_secret=os.getenv("AMADEUS_CLIENT_SECRET")
)

def buscar_voos(origem, destino, data, adultos):
    try:
        resposta = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origem,
            destinationLocationCode=destino,
            departureDate=data,
            adults=adultos,
            max=5
        )
        return resposta.data
    except ResponseError as erro:
        return {"erro": str(erro)}

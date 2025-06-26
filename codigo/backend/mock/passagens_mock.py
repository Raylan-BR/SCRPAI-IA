import random
from datetime import datetime, timedelta

# Lista inicial de passagens (serão geradas a partir dos dados do usuário)
def gerar_passagens_mock(origem, destino, data_str):
    data_base = datetime.strptime(data_str, "%d-%m-%Y")
    datas_possiveis = [
        data_base + timedelta(days=delta)
        for delta in random.choices(range(0, 8), k=15)
    ]

    passagens = [
        {
            "voo_id": f"AZ{100+i}",
            "companhia": random.choice(["Azul", "Gol", "Latam", "Iberia", "Delta"]),
            "origem": origem,
            "destino": destino,
            "data_partida": datas_possiveis[i].strftime("%d-%m-%Y"),
            "hora_partida": f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}",
            "hora_chegada": f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}",
            "preco": round(random.uniform(250, 900), 2),
            "moeda": "BRL",
            "classe": random.choice(["Econômica", "Executiva"]),
            "duracao": random.choice(["1h30min", "2h", "3h", "4h"]),
            "paradas": random.choice([0, 1])
        }
        for i in range(15)
    ]
    return passagens

def filtrar_por_preco(passagens, preco_maximo):
    return [p for p in passagens if p["preco"] <= preco_maximo]
def limitar_resultados(passagens, limite=5):
    return passagens[:limite]
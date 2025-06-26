# Lista inicial de passagens (serão geradas a partir dos dados do usuário)
from datetime import datetime, timedelta
import random

def gerar_passagens_mock(origem, destino, data_str):
    data_base = datetime.strptime(data_str, "%d-%m-%Y")
    datas_possiveis = [
        data_base + timedelta(days=delta)
        for delta in random.choices(range(0, 8), k=15)
    ]

    passagens = []

    for i in range(15):
        # Gera horários de partida e chegada aleatórios
        hora_partida_str = f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}"
        hora_chegada_str = f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}"

        # Converte para objetos datetime (usando uma data base qualquer)
        hora_partida = datetime.strptime(hora_partida_str, "%H:%M")
        hora_chegada = datetime.strptime(hora_chegada_str, "%H:%M")

        # Ajusta caso o voo passe da meia-noite
        if hora_chegada <= hora_partida:
            hora_chegada += timedelta(days=1)

        # Calcula duração
        duracao = hora_chegada - hora_partida
        horas = duracao.seconds // 3600
        minutos = (duracao.seconds % 3600) // 60
        duracao_str = f"{horas}h{minutos:02d}min"

        # Monta o dicionário da passagem
        passagem = {
            "voo_id": f"AZ{100+i}",
            "companhia": random.choice(["Azul", "Gol", "Latam", "Iberia", "Delta"]),
            "origem": origem,
            "destino": destino,
            "data_partida": datas_possiveis[i].strftime("%d-%m-%Y"),
            "hora_partida": hora_partida_str,
            "hora_chegada": hora_chegada_str,
            "preco": round(random.uniform(250, 900), 2),
            "moeda": "BRL",
            "classe": random.choice(["Econômica", "Executiva"]),
            "duracao": duracao_str,
            "paradas": random.choice([0, 1])
        }

        passagens.append(passagem)

    return passagens


def filtrar_por_preco(passagens, preco_maximo):
    return [p for p in passagens if p["preco"] <= preco_maximo]
def limitar_resultados(passagens, limite=5):
    return passagens[:limite]
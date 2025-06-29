import random
from datetime import datetime, timedelta

def gerar_passagens_mock(origem, destino, data_str):
    data_base = datetime.strptime(data_str, "%d-%m-%Y")
    passagens = []

    companhias = ["Azul", "Gol", "Latam", "Iberia", "Delta"]
    aeronaves = ["Airbus A320", "Boeing 737", "Embraer 195", "Boeing 787", "Airbus A350"]

    for i in range(20):
        # Hora de partida
        hora_partida_dt = datetime.strptime(f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}", "%H:%M")
        hora_partida_str = hora_partida_dt.strftime("%H:%M")

        # Duração do voo em minutos
        duracao_minutos = random.choice([105, 120, 135, 150, 165, 195, 240])
        hora_chegada_dt = hora_partida_dt + timedelta(minutes=duracao_minutos)
        hora_chegada_str = hora_chegada_dt.strftime("%H:%M")

        # Ajuste para cálculo de duração
        partida_dt = datetime.strptime(hora_partida_str, "%H:%M")
        chegada_dt = datetime.strptime(hora_chegada_str, "%H:%M")
        if chegada_dt <= partida_dt:
            chegada_dt += timedelta(days=1)

        duracao = chegada_dt - partida_dt
        horas = duracao.seconds // 3600
        minutos = (duracao.seconds % 3600) // 60
        duracao_str = f"{horas}h{minutos:02d}min"

        passagem = {
            "companhia": (companhia := random.choice(companhias)),
            "aeronave": random.choice(aeronaves),
            "assentosDisponiveis": random.randint(1, 30),
            "partida": f"{hora_partida_str}",
            "chegada": f"{hora_chegada_str}",
            "origem": origem,
            "destino": destino,
            "duracao": duracao_str,
            "escalas": random.choice([0, 1, 2]),
            "preco": round(random.uniform(250, 900), 2),
            "moeda": "BRL",
            "classe": random.choice(["Econômica", "Executiva"])
        }

        passagens.append(passagem)

    return passagens

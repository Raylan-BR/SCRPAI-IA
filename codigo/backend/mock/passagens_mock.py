# Lista inicial de passagens (serão geradas a partir dos dados do usuário)
from datetime import datetime, timedelta
import random

def gerar_passagens_mock(origem, destino, data_str):
    data_base = datetime.strptime(data_str, "%d-%m-%Y")

    passagens = []

    for i in range(10):
        # Gerar hora de partida
        hora_partida_dt = datetime.strptime(f"{random.randint(0, 23):02d}:{random.choice([0, 15, 30, 45]):02d}", "%H:%M")
        hora_partida_str = hora_partida_dt.strftime("%H:%M")

        # Gerar duração entre 15 minutos e 4 horas (em múltiplos de 15 min)
        duracao_minutos = random.choice([105, 120, 135, 150, 165, 195, 240])
        hora_chegada_dt = hora_partida_dt + timedelta(minutes=duracao_minutos)
        hora_chegada_str = hora_chegada_dt.strftime("%H:%M")


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
            "data_partida": data_base,
            "hora_partida": hora_partida_str,
            "hora_chegada": hora_chegada_str,
            "preco": round(random.uniform(250, 900), 2),
            "moeda": "BRL",
            "classe": random.choice(["Econômica", "Executiva"]),
            "duracao": duracao_str,
            "paradas": random.choice([0, 1])
        }

        passagens.append(passagem)
    print("10 passagens foram geradas...")
    return passagens
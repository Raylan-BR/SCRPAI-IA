from chatbot.logic import responder

while True:
    msg = input("Você: ")
    if msg.lower() in ["sair", "exit"]:
        break
    resposta = responder(msg)
    print("Bot:", resposta)


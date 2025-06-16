from gemini_api.client import model

def responder(mensagem_usuario):
    resposta = model.generate_content(mensagem_usuario)
    return resposta.text

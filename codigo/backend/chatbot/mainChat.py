from backend.config.settings import GOOGLE_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.chat_history import BaseChatMessageHistory 
from langchain.memory import ConversationBufferMemory
from datetime import date

hoje = date.today()
def Chat():
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key= GOOGLE_API_KEY, temperature=0.1)
    memory = ConversationBufferMemory(return_messages=True)
    historico = memory.chat_memory.messages
    instrucoes = f"Hoje é {hoje}. Quero que você atue como um assistente de viagens inteligente."\
                "Seu objetivo principal é descobrir as seguintes informações do usuário, não pergunte de uma vez: cidade de origem, Cidade de destino, Data da viagem, Motivo da viagem (trabalho ou lazer). "\
                "Se a viagem for a lazer, sugira também um ponto turístico interessante na cidade de destino. "\
                "Você deve fazer perguntas claras, simples e objetivas caso o usuário não informe todos os dados. "\
                "Ao identificar a cidade de destino, pesquise ou use seu conhecimento para indicar uma atração turística popular. "\
                "Mantenha o diálogo natural e eficiente, coletando os dados passo a passo se necessário."
    memory.chat_memory.add_message(SystemMessage(content=instrucoes))
    print("Chat iniciado! Digite 'sair' para encerrar.\n")
    while True:
        entrada = input("Você: ")
        if entrada.lower() in ("sair", "exit", "quit"):
            print("Encerrando o chat. Até mais!")
            break

        historico.append(HumanMessage(content=entrada))
        resposta = llm.invoke(historico)
        print(f"Bot: {resposta.content}\n")

        historico.append(AIMessage(content=resposta.content))
    
if __name__ == "__main__":
    Chat()

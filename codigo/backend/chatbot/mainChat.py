from backend.config.settings import GOOGLE_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain.memory import ConversationBufferMemory

def Chat():
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key= GOOGLE_API_KEY, temperature=0.7)
    memory = ConversationBufferMemory(return_messages=True)
    historico = memory.chat_memory.messages

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
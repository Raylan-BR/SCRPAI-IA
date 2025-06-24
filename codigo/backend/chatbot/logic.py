from langchain_core.messages import SystemMessage, HumanMessage
from codigo.backend.chatbot.graph_flow import app
from codigo.backend.chatbot.prompts import instrucoes

# Função de chat com base no terminal
def Chat():
    print("Chat iniciado! Digite 'sair' para encerrar.\n")

session_id = "UsuarioBeta"
messages = [SystemMessage(content=instrucoes)]

while True:
        entrada = input("Você: ")
        if entrada.lower() in ("sair", "exit", "quit"):
            print("Encerrando o chat. Até mais!")
            break

        messages.append(HumanMessage(content=entrada))

        result = app.invoke(
            {"messages": messages},
            config={"configurable": {"session_id": session_id, "thread_id": "main"}}
        )

        resposta = result["messages"][-1]
        print(f"Bot: {resposta.content}\n")
        
    
if __name__ == "__main__":
    Chat()

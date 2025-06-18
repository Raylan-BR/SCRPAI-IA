from backend.config.settings import GOOGLE_API_KEY

from langchain_google_genai import ChatGoogleGenerativeAI

def main():
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key= GOOGLE_API_KEY)

    print("Chat iniciado! Digite 'sair' para encerrar.\n")
    while True:
        entrada = input("Você: ")
        if entrada.lower() in ("sair", "exit", "quit"):
            print("Encerrando o chat. Até mais!")
            break

        resposta = llm.invoke(entrada)
        print(f"Bot: {resposta.content}\n")

if __name__ == "__main__":
    main()

# Estrutura do projeto

Este projeto foi organizado com foco na clareza e modularidade. Criamos uma estrutura de pastas simples para separar a lógica do chatbot, o acesso à API do Gemini e configurações.

## Pastas e arquivos criados

A estrutura de diretórios foi criada manualmente ou via terminal com o comando mkdir, seguindo este modelo:
```
backend/
├── chatbot
│   ├── __init__.py
│   └── logic.py
├── config
│   └── settings.py
├── gemini_api
│   ├── client.py
│   └── __init__.py
├── main.py
├── README.md
└── requirements.txt
```
Além disso, é necessário baixar dentro do diretório backend:
- (.venv) para ambiente virtual
- (.env) para variáveis sensíveis

Abaixo segue um tutorial simples:

## O que é um ambiente virtual?

Um ambiente virtual (.venv) é uma pasta que contém uma instalação isolada do Python e dos pacotes que você instalar com pip. Isso evita conflitos entre projetos diferentes.

## Criando o ambiente virtual

No terminal, navegue até a pasta backend do seu projeto e execute:

(Linux)
```
python3 -m venv .venv
```
(Windows)
```
py -3 -m venv .venv
```
## Ativando o ambiente virtual
(Linux)
```
source .venv/bin/activate
```
(Windows)
```
.\.venv\Scripts\activate
```
## Desativando o ambiente virtual

Para sair do ambiente virtual (em qualquer sistema) rode:
```
deactivate
```
## Como usar o .env em projetos Python

Usar um arquivo .env é uma ótima forma de guardar variáveis sensíveis, como chaves de API, sem deixá-las expostas no código.

## Instale a biblioteca python-dotenv

Ative seu ambiente virtual e execute:
```
pip install python-dotenv
```
## Crie o arquivo .env

No diretorio backend do seu projeto, crie um arquivo chamado .env. Coloque sua chave de API nesse arquivo.
Exemplo:
```
GOOGLE_API_KEY=sua-chave-aqui
```
## Dependências instaladas

As bibliotecas usadas foram instaladas com pip dentro do ambiente virtual. Então ative seu ambiente e rode:
```
pip install -r requirements.txt
```
para o framework langChain, instale:
```
pip install langchain langchain-google-genai google-generativeai python-dotenv
```
Atualização de versão do LangChain >= 0.2.7
```
pip install --upgrade langchain
```
## Acessar o chat Gemini+LangChain 
Observação: caso seja necessário reconhecimento dos pacotes, esteja no diretório 'codigo' e rode:
```
python -m backend.chatbot.mainChat
```
## dependencia langgraph

```
pip install langgraph
```
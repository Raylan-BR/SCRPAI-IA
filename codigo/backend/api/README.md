# Busca de Voos com Amadeus e Flask

## Funcionalidades

- Consulta de voos a partir de dados de origem, destino, data e número de adultos.
- Retorno de dados otimizados para exibição (companhia, horários, escalas, preço, bagagens).

## Tecnologias

- Python
- Flask
- Amadeus API

## Instalação

**Instalando SDK do Amadeus em Python:**
```bash
pip install amadeus
```

**Instalando python-dotenv:**
```bash
pip install python-dotenv
```

## Endpoints

**GET:** Busca voos com base nos parâmetros fornecidos.

Parâmetros esperados:

|Parâmetro | Descrição | Exemplo|
|----------|-----------|--------|
|**from** |Aeroporto de origem (IATA)|GRU|
|**to**	|Aeroporto de destino (IATA)|SLZ|
|**date**|Data do voo (YYYY-MM-DD)|2025-07-01|
|**adults**|Quantidade de adultos|1|

**Exemplo de requisição:**
```bash
http://localhost:5000/api/voos?origem=GRU&destino=SLZ&data=2025-07-01&adultos=1
```
## Estrutura de Pastas
```bash
api/
├── .env                 # Arquivo de variáveis de ambiente.   
├── amadeus_client.py    # Integração com a API da Amadeus.
├── app.py               # Arquivo principal da aplicação Flask.
├── formatador.py        # Processamento e formatação dos dados de voo.
├── requirements.txt     # Lista de dependências.
```

## Amadeus API

Para buscar voos da API é preciso de uma conta no **Amadeus Developer** e gerar suas chaves (API Key e Secret). Essas credenciais devem ser armazenadas em variáveis de ambiente no arquivo **.env**.

```bash
AMADEUS_CLIENT_ID=API_KEY
AMADEUS_CLIENT_SECRET=API_SECRET
```

## Rodando a API

**Para rodar a API, use o seguinte comando no terminal:**
```bash
python app.py
```

## Teste de Requisição

**Use o seguinte exemplo de URL para testar no Postman ou Insomnia:**
```bash
http://localhost:5000/api/voos?origem=GRU&destino=SLZ&data=2025-07-01&adultos=1
```
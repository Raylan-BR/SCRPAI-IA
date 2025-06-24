from codigo.backend.config.settings import GOOGLE_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", 
    google_api_key= GOOGLE_API_KEY,
    temperature=0.2
    )
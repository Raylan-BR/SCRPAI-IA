import google.generativeai as genai
from config.settings import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")

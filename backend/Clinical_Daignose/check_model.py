import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: No API Key found in .env file")
else:
    genai.configure(api_key=api_key)
    print(f"Checking available models for key ending in ...{api_key[-4:]}")
    print("--------------------------------------------------")
    
    try:
        # Loop through all models and print only the ones that generate text
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"AVAILABLE MODEL: {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
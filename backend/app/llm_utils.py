import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key and model from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY

def get_llm_response(prompt, temperature=0.7, max_tokens=1000):
    """
    Get a response from OpenAI's ChatCompletion API.
    """
    try:
        response = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        raise ValueError(f"Failed to get response from OpenAI: {str(e)}")

def get_chat_response(messages, temperature=0.7):
    """
    Get a chat response from OpenAI's ChatGPT model.
    """
    try:
        response = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        raise ValueError(f"Failed to get chat response from OpenAI: {str(e)}")
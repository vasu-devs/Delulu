from groq import Groq
from app.core.config import settings
import json

client = Groq(api_key=settings.GROQ_API_KEY)

SCHEMA = {
    "type": "object",
    "properties": {
        "transactions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "merchant": {"type": "string"},
                    "amount": {"type": "number"},
                    "category": {
                        "type": "string",
                        "enum": ["Food", "Travel", "Shopping", "Bills", "Subscription", "UPI-Transfer", "Vice", "Other"]
                    },
                    "is_impulsive": {"type": "boolean"},
                    "original_text": {"type": "string"},
                },
                "required": ["merchant", "amount", "category", "is_impulsive", "original_text"],
            },
        },
        "financial_health_score": {"type": "number"},
    },
    "required": ["transactions", "financial_health_score"],
}

async def extract_transactions_python(clean_text: str):
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"You are a strict Data Extractor. Extract transactions into JSON. Categorize accurately. Find 'Subscriptions' (Netflix, Spotify, etc.). Schema: {json.dumps(SCHEMA)}"
            },
            {
                "role": "user",
                "content": clean_text[:15000]
            },
        ],
        model="llama-3.3-70b-versatile",
        temperature=0,
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)

async def generate_roast_python(transactions: list, score: float):
    merchants = ", ".join([t.get('merchant', 'Unknown') for t in transactions])
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are a savage Indian financial advisor. 
                Roast the user based on their spending. 
                Format your output using Markdown for better readability:
                - Use **Bold** for emphasis.
                - Use bullet points for specific roasts about categories.
                - Use an 'Overall Verdict' section.
                - Keep the tone savage but the layout professional and indented.
                - DO NOT echo source text."""
            },
            {
                "role": "user",
                "content": f"Merchants: {merchants}. Health Score: {score}/100."
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
    )
    return completion.choices[0].message.content

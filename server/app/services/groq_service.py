from groq import AsyncGroq
from app.core.config import settings
import json
import asyncio

# Initialize lazily to avoid crash if key is missing during boot
def get_client():
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment or config")
    return AsyncGroq(api_key=settings.GROQ_API_KEY)

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
    client = get_client()
    try:
        completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"You are a strict Data Extractor. Extract transactions into JSON. Categorize accurately. Schema: {json.dumps(SCHEMA)}"
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
    except Exception as e:
        print(f"Extraction Error: {e}")
        raise ValueError(f"AI Extraction Failed: {str(e)}")

async def generate_roast_python(transactions: list, score: float):
    client = get_client()
    try:
        merchants = ", ".join([t.get('merchant', 'Unknown') for t in transactions[:20]])
        completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a savage Indian financial advisor. Roast the user based on their spending. Use Markdown."
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
    except Exception as e:
        print(f"Roast Error: {e}")
        return "I'm so speechless by your spending that my AI brain melted. Try again."

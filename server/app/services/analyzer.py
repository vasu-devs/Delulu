from groq import AsyncGroq
from app.core.config import settings
import json

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

MODEL = "llama-3.3-70b-versatile"

# Schema for strict extraction
SCHEMA = {
    "type": "object",
    "properties": {
        "transactions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "YYYY-MM-DD or DD-MM-YYYY"},
                    "merchant": {"type": "string"},
                    "amount": {"type": "number"},
                    "type": {"type": "string", "enum": ["DEBIT", "CREDIT"]},
                    "category": {"type": "string", "enum": ["Food", "Travel", "Shopping", "Bills", "Subscription", "UPI", "Income", "Job", "Other"]},
                    "is_impulsive": {"type": "boolean"}
                },
                "required": ["date", "merchant", "amount", "type", "category", "is_impulsive"]
            }
        },
        "score": {"type": "number", "description": "Financial health score 0-100"}
    },
    "required": ["transactions", "score"]
}

async def analyze_markdown(markdown_text: str):
    """
    Sends Markdown table data to LLM for extraction.
    """
    print(f"🧠 [ANALYZER] Sending {len(markdown_text)} chars to {MODEL}...")
    
    # We might need to chunk if PDF is huge, but let's try full context first
    # Llama 3.3 has 128k context, so usually fine.
    
    prompt = f"""You are a financial forensic auditor.
I will give you a Bank Statement converted to MARKDOWN.
Your job is to extract ALL transactions into strict JSON.

RULES:
1. **DEBIT** = Money Out (Dr, Debit, Withdrawal, Payment to...)
2. **CREDIT** = Money In (Cr, Credit, Deposit, Refund, Received from...)
3. **Category**: Guess based on merchant name.
4. **is_impulsive**: True if DEBIT > 500 AND category is (Food, Shopping, Travel).
5. **Score**: 0 (Bad) to 100 (Good). Deduct points for high impulse spending.

OUTPUT SCHEMA: {json.dumps(SCHEMA)}
"""

    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": markdown_text}
            ],
            model=MODEL,
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        raw_json = completion.choices[0].message.content
        data = json.loads(raw_json)
        
        # Normalize fields for frontend (it expects specific keys)
        # Frontend expects: merchant, amount, transaction_type, category, is_impulsive
        txns = []
        for t in data.get("transactions", []):
            txns.append({
                "merchant": t.get("merchant", "Unknown"),
                "amount": float(t.get("amount", 0)),
                "transaction_type": t.get("type", "DEBIT"),
                "category": t.get("category", "Other"),
                "is_impulsive": t.get("is_impulsive", False),
                "date": t.get("date", "")
            })
            
        return {
            "transactions": txns,
            "financial_health_score": data.get("score", 50)
        }

    except Exception as e:
        print(f"❌ [ANALYZER] Error: {e}")
        # Return safe empty structure
        return {"transactions": [], "financial_health_score": 50}

async def generate_roast(summary_stats: dict):
    """
    Generates a roast based on the extracted data.
    """
    # Simple formatting for the roast prompt
    txns = summary_stats.get("transactions", [])
    score = summary_stats.get("financial_health_score", 50)
    
    debits = [t for t in txns if t["transaction_type"] == "DEBIT"]
    total_spent = sum(t["amount"] for t in debits)
    
    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a stand-up comedian roasting a bank statement. Be brutal but funny. Markdown supported."},
                {"role": "user", "content": f"User spent {total_spent} total. Score is {score}/100. Roast them in 3 sentences."}
            ],
            model="llama-3.1-8b-instant", # Faster model for roast
            temperature=0.8
        )
        return completion.choices[0].message.content
    except:
        return "You're broke. Stop spending money. 💸"

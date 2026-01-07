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

CRITICAL RULES:
1. **NO HALLUCINATIONS**: If the input does not contain a transaction table, return empty list. Do NOT invent data.
2. **Scan for Tables**: Look for dates, amounts, and merchant names in table rows.
3. **Ignore Noise**: Ignore "Enter Password", legal disclaimers, or page headers.
4. **DEBIT**: Money Out (Dr, Debit, Withdrawal, Payment to...)
5. **CREDIT**: Money In (Cr, Credit, Deposit, Refund, Received from...)
6. **is_impulsive**: True if DEBIT > 500 AND category is (Food, Shopping, Travel).

If the input is garbage or empty, return {{"transactions": [], "financial_health_score": 0}}.

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
                "amount": abs(float(t.get("amount", 0))), 
                "transaction_type": t.get("type", "DEBIT").upper(), 
                "category": t.get("category") or "Other",
                "is_impulsive": t.get("is_impulsive", False) or (t.get("type", "DEBIT").upper() == "DEBIT" and abs(float(t.get("amount", 0))) > 500 and t.get("category") in ["Shopping", "Food", "Travel", "Entertainment"]),
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
                {"role": "system", "content": """You are a Hedge Fund Analyst with a Gen-Z personality disorder. 
You are high-IQ, quant-focused, but you speak in brainrot.

**YOUR GOAL**: Roast the user by exposing their SPECIFIC financial stupidity using data. Do not just say "you spend too much." Say "You spent 15% of your income on bean water."

**ANALYSIS STEP (Do this internally, then roast):**
1. **Identify Patterns**: High frequency small txns? (Latte factor). Huge one-off splurges? (Impulse control). Recurring unused subs?
2. **Category Weight**: excessive dining out vs investments?
3. **Merchant Specifics**: Identify the exact brands draining them (Uber, Starbucks, Zomato).

**OUTPUT FORMAT (Markdown):**

# 🧠 The Diagnosis: [2-word savage summary, e.g., "Terminal Consumerism"]

## 🕵️ The Receipts (Data-Driven Roast)
*   **The [Brand Name] Addiction**: "Bestie, you visited [Brand] [X] times. That's ₹[Amount] you could have put into an SIP. Are you trying to personally fund their IPO?"
*   **The "Little Treat" Trap**: "You have [X] transactions under ₹500. It's giving 'death by a thousand cuts'."
*   **Subscription Rot**: "Do you even use these? Cancel them or I'm calling the police."

## 📉 Why You're Cooked (The Insight)
[A paragraph explaining the MACRO impact of their micro-spending. Explain compounding interest in reverse. Be smart but mean.]

## 💊 The Fix (Actionable Steps)
1.  **Stop**: [Specific thing to stop doing immediately]
2.  **Start**: [Specific smart money move]
3.  **Mantra**: "[A funny but wise mantra for them]"

**Score:** {score}/100 (Financial Literacy Level: Toddler)
"""},
                {"role": "user", "content": f"User Financial Data:\nTotal Debits: ₹{total_spent}\nScore: {score}\nTop Merchants & Frequency: {txns[:20]}"}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.85 
        )
        return completion.choices[0].message.content
    except:
        return "You're broke. Stop spending money. 💸"

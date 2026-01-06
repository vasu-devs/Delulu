from groq import AsyncGroq
from app.core.config import settings
import json

def get_client():
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment or config")
    return AsyncGroq(api_key=settings.GROQ_API_KEY)

# Updated schema with transaction_type for CREDIT/DEBIT separation
# Strict Schema for Financial Data Extraction
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
                    "transaction_type": {
                        "type": "string",
                        "enum": ["DEBIT", "CREDIT"],
                        "description": "DEBIT for money spent, CREDIT for money received/refunded"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["Food", "Travel", "Shopping", "Bills", "Utilities", "Subscription", "UPI-Transfer", "Vice", "Income", "Cashback", "Verification", "Other"]
                    },
                    "is_impulsive": {"type": "boolean"},
                    "original_text": {"type": "string"},
                },
                "required": ["merchant", "amount", "transaction_type", "category", "is_impulsive", "original_text"],
            },
        },
        "financial_health_score": {"type": "number"},
    },
    "required": ["transactions", "financial_health_score"],
}

EXTRACTION_PROMPT = """You are a High-Precision Financial Data Analyst.
Your goal is to extract structured transaction data from bank statements or UPI logs with 100% accuracy.

DATA EXTRACTION RULES:
1. **DEBIT vs CREDIT (Critical):**
   - CREDIT: "Received from", "Refund", "Cashback", "Credit". (Money coming IN).
   - DEBIT: "Paid to", "Sent to", "Payment to", "Debit". (Money going OUT).
   - If unsure, look for negative/positive signs or column placement in the original text.

2. **Categorization:**
   - Food: Zomato, Swiggy, Restaurants, Cafes.
   - Travel: Uber, Ola, IRCTC, Fuel, Petrol.
   - Shopping: Amazon, Flipkart, Retailers.
   - Bills/Utilities: Phone, Electricity, Internet, Rent.
   - Subscription: Netflix, OpenAI, Claude, Spotify.
   - Vice: Liquor shops, Betting apps, Gaming (D11, Winzo).
   - Verification: Small amounts (<₹10) to tech platforms.

3. **Merchant Normalization:**
   - Remove platform prefixes (e.g., "UPI-", "Payment to").
   - Extract the core business name (e.g., "Zomato" instead of "Zomato-1234@okaxis").

4. **Impulsive Spending (Only for DEBIT):**
   - Mark `true` if it's an unplanned luxury/vice (e.g., late-night food delivery, gaming, alcohol).
   - Mark `false` for rent, bills, insurance, or income.

Return JSON in this format: """ + json.dumps(SCHEMA)


async def extract_transactions_python(clean_text: str, retry_count: int = 0):
    """Extract and categorize transactions with proper CREDIT/DEBIT handling."""
    client = get_client()
    
    # Try 70B first, then fall back to 8B on retry
    models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
    model = models[0] if retry_count == 0 else models[min(retry_count, len(models) - 1)]
    
    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": EXTRACTION_PROMPT},
                {"role": "user", "content": clean_text[:12000]},  # Slightly larger context
            ],
            model=model,
            temperature=0,
            response_format={"type": "json_object"},
        )
        
        result = json.loads(completion.choices[0].message.content)
        
        # Post-processing: Apply business rules
        result = apply_business_rules(result)
        
        return result
        
    except Exception as e:
        error_str = str(e)
        print(f"Extraction Error (attempt {retry_count + 1}): {e}")
        
        # Retry on rate limit with backoff
        if "429" in error_str or "rate_limit" in error_str.lower():
            if retry_count < 2:
                import asyncio
                wait_time = (retry_count + 1) * 5  # 5, 10 seconds
                print(f"Rate limited. Waiting {wait_time}s before retry...")
                await asyncio.sleep(wait_time)
                return await extract_transactions_python(clean_text, retry_count + 1)
            else:
                raise ValueError("Rate limit exceeded. Please wait a minute and try again.")
        
        raise ValueError(f"AI Extraction Failed: {error_str}")


def apply_business_rules(data: dict) -> dict:
    """Apply post-processing business rules to ensure data quality."""
    transactions = data.get("transactions", [])
    processed = []
    
    for t in transactions:
        amount = t.get("amount", 0)
        t["amount"] = amount
        
        text = t.get("original_text", "").lower()
        merchant = t.get("merchant", "").lower()
        tx_type = t.get("transaction_type", "DEBIT")
        category = t.get("category", "Other")
        
        # Business logic overrides
        if "cashback" in text:
            t["transaction_type"] = "CREDIT"
            t["category"] = "Cashback"
            t["is_impulsive"] = False
        
        if tx_type == "CREDIT":
            t["is_impulsive"] = False
            if t["category"] not in ["Income", "Cashback"]:
                t["category"] = "Income"
        
        if tx_type == "DEBIT":
            # Guard against false impulsive flags
            if amount < 50 or category in ["Bills", "Utilities", "Subscription", "Verification"]:
                t["is_impulsive"] = False
        
        processed.append(t)
    
    data["transactions"] = processed
    data["financial_health_score"] = calculate_health_score(processed)
    
    return data


def calculate_health_score(transactions: list) -> int:
    """
    Calculate financial health score based on DISCRETIONARY spending.
    """
    debits = [t for t in transactions if t.get("transaction_type") == "DEBIT"]
    
    if not debits:
        return 85
    
    total_spent = sum(t.get("amount", 0) for t in debits)
    discretionary_spent = sum(
        t.get("amount", 0) for t in debits 
        if t.get("category") not in ["UPI-Transfer", "Bills", "Verification", "Utilities"]
    )
    
    if discretionary_spent <= 0:
        return 100
    
    impulsive_spent = sum(t.get("amount", 0) for t in debits if t.get("is_impulsive"))
    impulsive_ratio = impulsive_spent / discretionary_spent
    
    score = max(20, min(100, int(100 - (impulsive_ratio * 120)))) # Slightly more punitive
    
    return score


async def generate_roast_python(transactions: list, score: float):
    """Generate a high-end financial audit roast."""
    client = get_client()
    
    debits = [t for t in transactions if t.get("transaction_type", "DEBIT") == "DEBIT"]
    
    if not debits:
        return "Your bank statement is cleaner than a fresh sheet of paper. You either have incredible self-control or you're living off someone else's wallet. Either way, keep it up, you financial ghost. 👻"
    
    try:
        total_spent = sum(t.get('amount', 0) for t in debits)
        impulsive_total = sum(t.get('amount', 0) for t in debits if t.get('is_impulsive'))
        
        categories = {}
        for t in debits:
            cat = t.get('category', 'Other')
            categories[cat] = categories.get(cat, 0) + t.get('amount', 0)
        
        top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]
        category_summary = ", ".join([f"{cat} (₹{amt:,.0f})" for cat, amt in top_categories])
        
        merchants = ", ".join(list(set([t.get('merchant', 'Unknown') for t in debits[:10]])))
        
        completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are 'Finanjo Core', a cold, hyper-intelligent financial auditor with a dry, sarcastic wit. 
                    Your job is to roast the user's spending habits using data-driven insults.

                    STYLE GUIDELINES:
                    - Personality: Imagine a mix of a high-end hedge fund manager and a disappointed Indian father.
                    - Slang: Subtle Indian Gen-Z (bro, scheme, scene, paisa).
                    - Structure: 
                        1. The "Reality Punch": A direct hit on their total spending or top category.
                        2. The "Pattern Analysis": Deep dive into their merchant habits.
                        3. The "Wealth Warning": What their future looks like if this continues.
                        4. The "Surgical Tip": One hyper-specific piece of advice.
                    - Formatting: Use bolding and lists for impact. Keep it under 200 words."""
                },
                {
                    "role": "user",
                    "content": f"""AUDIT LOG:
                    - Total Outflow: ₹{total_spent:,.0f}
                    - Reckless Spending: ₹{impulsive_total:,.0f}
                    - Health Index: {score}/100
                    - Spending Nodes: {category_summary}
                    - Flagged Entities: {merchants}"""
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.75,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Roast Error: {e}")
        return "My audit engine stalled trying to process the sheer chaos of your spending. Take a look at the charts while I reboot. 💀"

from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.services.cleaner import clean_transaction_text
from app.services.groq_service import extract_transactions_python, generate_roast_python
from app.core.auth import getattr_current_user
import io

router = APIRouter()

@router.post("/analyze")
async def analyze_data(
    text: Optional[str] = Form(None)
):
    # Logic to process text or file
    cleaned = clean_transaction_text(text)
    analysis = await extract_transactions_python(cleaned)
    roast = await generate_roast_python(analysis['transactions'], analysis['financial_health_score'])
    
    return {
        "analysis": analysis,
        "roast": roast,
        "cleaned_text": cleaned
    }

@router.get("/profile")
async def get_profile(user: dict = Depends(getattr_current_user)):
    return {"user": user}

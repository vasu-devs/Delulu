from pydantic import BaseModel
from typing import List, Optional

class Transaction(BaseModel):
    merchant: str
    amount: float
    transaction_type: str
    category: str
    is_impulsive: bool
    original_text: str

class AnalysisResult(BaseModel):
    transactions: List[Transaction]
    financial_health_score: float

class AnalysisResponse(BaseModel):
    analysis: AnalysisResult
    roast: str
    cleaned_text: str

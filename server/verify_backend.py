import asyncio
from app.services.pdf_parser import extract_text_from_pdf
from app.services.groq_service import extract_transactions_python
import os

async def test_extraction():
    # Mock PDF bytes (minimal valid PDF structure)
    pdf_bytes = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R>>endobj 4 0 obj<</Length 21>>stream\nBT /F1 12 Tf ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n0000000212 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n283\n%%EOF"
    
    print("Testing PDF Text Extraction...")
    try:
        pages = await extract_text_from_pdf(pdf_bytes)
        print(f"Extracted {len(pages)} pages.")
        for p in pages:
            print(f"Page Content Snippet: {p[:100]}...")
    except Exception as e:
        print(f"PDF Extraction failed (expected if mock is too simple): {e}")

    # Test Logic with sample text if GROQ_API_KEY is available
    if os.getenv("GROQ_API_KEY"):
        print("\nTesting LLM Extraction...")
        sample_pages = [
            "--- PAGE 1 ---\n### DATA_TABLE ###\n| 01-Jan | Zomato | 450.00 | DEBIT |\n| 02-Jan | HDFC Cashback | 50.00 | CREDIT |\n### END_DATA_TABLE ###"
        ]
        try:
            result = await extract_transactions_python(sample_pages)
            print(f"Extracted {len(result['transactions'])} transactions.")
            print(f"Health Score: {result['financial_health_score']}")
            for tx in result['transactions']:
                print(f"  - {tx['merchant']}: {tx['amount']} ({tx['transaction_type']})")
        except Exception as e:
            print(f"LLM Extraction failed: {e}")
    else:
        print("\nSkipping LLM Extraction test (GROQ_API_KEY not set).")

if __name__ == "__main__":
    asyncio.run(test_extraction())

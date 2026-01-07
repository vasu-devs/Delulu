from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import os

# Import our new services
from app.core.config import settings
from app.services.parser import parse_pdf_to_markdown
from app.services.analyzer import analyze_markdown, generate_roast

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Phoenix Backend Online 🚀"}

@app.post("/api/v1/analyze")
async def analyze_endpoint(
    file: UploadFile = File(None),
    text: Optional[str] = Form(None)
):
    print(f"🚀 [API] New Request. File: {file.filename if file else 'No'} | Text: {len(text) if text else 0} chars")
    
    markdown_content = ""
    
    try:
        # PATH 1: PDF Upload (The Happy Path)
        if file and file.filename.lower().endswith('.pdf'):
            content = await file.read()
            markdown_content = await parse_pdf_to_markdown(content)
            
        # PATH 2: Raw Text / Markdown Paste
        elif text:
            markdown_content = text
            
        else:
            raise HTTPException(status_code=400, detail="No valid input provided. Upload PDF or paste text.")

        # PATH 3: The Intelligence Layer
        analysis_result = await analyze_markdown(markdown_content)
        
        # PATH 4: The Roast
        roast_text = await generate_roast(analysis_result)
        
        return {
            "analysis": analysis_result,
            "roast": roast_text,
            "raw_data_preview": markdown_content[:500] + "..." if len(markdown_content) > 500 else markdown_content
        }

    except Exception as e:
        print(f"🔥 [API ERROR] {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

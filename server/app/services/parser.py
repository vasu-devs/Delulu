import pymupdf4llm
import tempfile
import os

async def parse_pdf_to_markdown(file_bytes: bytes) -> str:
    """
    Converts PDF to Markdown using PyMuPDF4LLM.
    This preserves table structures as markdown tables, which LLMs understand perfectly.
    """
    print("📄 [PARSER] Starting PyMuPDF4LLM conversion...")
    
    # pymupdf4llm needs a file path, so we write to temp
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name
        
    try:
        # The Magic: Converts PDF -> Markdown with table support
        md_text = pymupdf4llm.to_markdown(tmp_path)
        
        print(f"✅ [PARSER] Converted to {len(md_text)} chars of Markdown")
        return md_text
        
    except Exception as e:
        print(f"❌ [PARSER] Error: {e}")
        raise ValueError(f"PDF conversion failed: {e}")
        
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

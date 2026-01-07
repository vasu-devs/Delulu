import pymupdf4llm
import fitz # PyMuPDF
import tempfile
import os

async def parse_pdf_to_markdown(file_bytes: bytes) -> str:
    """
    Converts PDF to Markdown using PyMuPDF4LLM.
    Includes smart cropping to remove headers/footers which often break table structure.
    """
    print("📄 [PARSER] Starting PyMuPDF4LLM conversion...")
    
    # 1. Pre-process: Crop headers/footers
    # Bank statements usually have noise in top 10% and bottom 5%
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        # Calculate cutoffs (less aggressive: top 40pt, bottom 20pt)
        # GPay statements often pack data tight
        header_height = 40 
        footer_height = 20
        
        cleaned_doc = fitz.open() # New empty doc
        cleaned_doc.insert_pdf(doc)
        
        for page in cleaned_doc:
            # Crop the page to exclude header/footer areas
            rect = page.rect
            # Safety check: Don't crop if page is too small
            if rect.height > (header_height + footer_height + 100):
                new_rect = fitz.Rect(rect.x0, rect.y0 + header_height, rect.x1, rect.y1 - footer_height)
                page.set_cropbox(new_rect)
            
        # 2. Convert the cropped document to Markdown
        md_text = pymupdf4llm.to_markdown(cleaned_doc, write_images=False)
        
        if len(md_text) < 50:
            print("⚠️ [PARSER] Cropped text too short. Reverting to full page.")
            md_text = pymupdf4llm.to_markdown(doc, write_images=False)

        
        print(f"✅ [PARSER] Converted to {len(md_text)} chars of Markdown (Headers Removed)")
        return md_text
        
    except Exception as e:
        print(f"❌ [PARSER] Error: {e}")
        import traceback
        traceback.print_exc()
        raise ValueError(f"PDF conversion failed: {e}")
        
    finally:
        if 'doc' in locals(): doc.close()
        if 'cleaned_doc' in locals(): cleaned_doc.close()

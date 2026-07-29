import io
from pypdf import PdfReader

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Extracts raw text content from PDF, TXT, DOCX or EML bytes.
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text.strip()
        except Exception as e:
            return f"Error extracting text from PDF: {str(e)}"
            
    elif filename_lower.endswith(".txt") or filename_lower.endswith(".eml") or filename_lower.endswith(".log"):
        try:
            return file_bytes.decode("utf-8", errors="replace").strip()
        except Exception as e:
            return f"Error reading text file: {str(e)}"
            
    elif filename_lower.endswith(".docx"):
        try:
            # Fallback text decoder for docx if python-docx isn't available
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            return "\n".join([p.text for p in doc.paragraphs if p.text]).strip()
        except Exception:
            return file_bytes.decode("utf-8", errors="ignore").strip()
            
    return file_bytes.decode("utf-8", errors="ignore").strip()

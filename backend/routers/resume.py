"""Resume Extractor Agent Router"""

from fastapi import APIRouter, UploadFile, File
from agents.resume_agent import parse_resume_text

router = APIRouter()


def extract_text_from_file(content: bytes, filename: str) -> str:
    fname = filename.lower()

    # Plain text
    if fname.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")

    # DOCX
    if fname.endswith(".docx"):
        try:
            import io
            from docx import Document
            doc = Document(io.BytesIO(content))
            return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        except Exception as e:
            print(f"DOCX extraction failed: {e}")

    # PDF - try pdfplumber first
    if fname.endswith(".pdf"):
        # Method 1: pdfplumber
        try:
            import io
            import pdfplumber
            text_parts = []
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    t = page.extract_text()
                    if t:
                        text_parts.append(t)
            text = "\n".join(text_parts).strip()
            if text and len(text) > 50:
                print(f"✅ pdfplumber extracted {len(text)} chars")
                return text
        except Exception as e:
            print(f"pdfplumber failed: {e}")

        # Method 2: pypdf
        try:
            import io
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            text_parts = []
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text_parts.append(t)
            text = "\n".join(text_parts).strip()
            if text and len(text) > 50:
                print(f"✅ pypdf extracted {len(text)} chars")
                return text
        except Exception as e:
            print(f"pypdf failed: {e}")

        # Method 3: PyPDF2
        try:
            import io
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text_parts = []
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text_parts.append(t)
            text = "\n".join(text_parts).strip()
            if text and len(text) > 50:
                print(f"✅ PyPDF2 extracted {len(text)} chars")
                return text
        except Exception as e:
            print(f"PyPDF2 failed: {e}")

        print("❌ All PDF extraction methods failed — no text extracted")
        return ""

    # Unknown file type — try decode
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return ""


@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or "resume.pdf"
    print(f"📄 Received file: {filename}, size: {len(content)} bytes")

    text = extract_text_from_file(content, filename)
    print(f"📝 Extracted text length: {len(text)} chars")
    print(f"📝 First 200 chars of text: {text[:200]}")

    if not text or len(text) < 20:
        print("❌ No text extracted from file — using dummy data")
        from agents.resume_agent import DUMMY_PARSED_RESUME
        return DUMMY_PARSED_RESUME

    result = parse_resume_text(text)
    return result
import os
import uuid
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from app.models.complaint import (
    ComplaintData, RiskAssessmentData, ChatRequest, ChatResponse,
    DocumentExtractionResponse, DBComplaint, Base
)
from app.utils.doc_parser import extract_text_from_file
from app.utils.sample_generator import generate_sample_documents
from app.graph.workflow import app_graph

router = APIRouter()

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples")
generate_sample_documents(SAMPLES_DIR)

@router.post("/agent/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Primary endpoint for Log Complaint Tool & Edit Complaint Tool.
    Runs input prompt through LangGraph agent workflow.
    """
    try:
        current_dict = request.current_complaint.model_dump() if request.current_complaint else {}
        
        # Execute LangGraph agent
        state_input = {
            "user_message": request.message,
            "current_complaint": current_dict,
            "extracted_text": "",
            "action_type": "",
            "updated_fields": [],
            "response_message": "",
            "risk_assessment": {}
        }
        
        result_state = app_graph.invoke(state_input)
        
        return ChatResponse(
            message=result_state["response_message"],
            action_type=result_state["action_type"],
            updated_fields=result_state["updated_fields"],
            complaint=ComplaintData(**result_state["current_complaint"]),
            risk_assessment=RiskAssessmentData(**result_state["risk_assessment"])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent workflow error: {str(e)}")

@router.post("/agent/extract-document", response_model=DocumentExtractionResponse)
async def extract_document_endpoint(file: UploadFile = File(...)):
    """
    Primary endpoint for Document Extraction Tool.
    Accepts PDF, DOCX, TXT, or EML files, parses text, and runs LangGraph agent workflow.
    """
    try:
        file_bytes = await file.read()
        extracted_text = extract_text_from_file(file_bytes, file.filename)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract text content from uploaded file.")
            
        state_input = {
            "user_message": f"Extract complaint from uploaded document: {file.filename}",
            "current_complaint": {},
            "extracted_text": extracted_text,
            "action_type": "document_extraction",
            "updated_fields": [],
            "response_message": "",
            "risk_assessment": {}
        }
        
        result_state = app_graph.invoke(state_input)
        
        return DocumentExtractionResponse(
            message=result_state["response_message"],
            extracted_filename=file.filename,
            complaint=ComplaintData(**result_state["current_complaint"]),
            risk_assessment=RiskAssessmentData(**result_state["risk_assessment"]),
            confidence_score=0.96
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document extraction error: {str(e)}")

@router.get("/samples")
async def list_sample_documents():
    """Lists pre-generated sample complaint PDFs for 1-click test upload in UI."""
    files = []
    if os.path.exists(SAMPLES_DIR):
        for f in os.listdir(SAMPLES_DIR):
            if f.endswith(".pdf") or f.endswith(".txt"):
                files.append(f)
    return {"samples": files}

@router.get("/samples/download/{filename}")
async def download_sample(filename: str):
    """Downloads sample document by filename."""
    file_path = os.path.join(SAMPLES_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    raise HTTPException(status_code=404, detail="Sample file not found.")

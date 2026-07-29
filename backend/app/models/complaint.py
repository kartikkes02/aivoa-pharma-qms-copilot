import os
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./complaints.db")

# Create SQLAlchemy engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ComplaintData(BaseModel):
    complaint_source: Optional[str] = Field(default="")
    customer_name: Optional[str] = Field(default="")
    product_name: Optional[str] = Field(default="")
    product_strength: Optional[str] = Field(default="")
    batch_number: Optional[str] = Field(default="")
    manufacturing_date: Optional[str] = Field(default="")
    expiry_date: Optional[str] = Field(default="")
    quantity_affected: Optional[str] = Field(default="")
    complaint_type: Optional[str] = Field(default="")
    complaint_date: Optional[str] = Field(default="")
    detailed_description: Optional[str] = Field(default="")
    initial_severity: Optional[str] = Field(default="")
    priority: Optional[str] = Field(default="")

class RiskAssessmentData(BaseModel):
    severity: str = Field(default="Major")
    risk_score: int = Field(default=75)
    recommended_action: str = Field(default="Route to QA investigation and issue replacement")
    root_cause_analysis: List[str] = Field(default_factory=list)
    capa_recommendation: List[str] = Field(default_factory=list)
    completeness_score: int = Field(default=90)
    missing_fields: List[str] = Field(default_factory=list)
    duplicate_warning: Optional[str] = Field(default=None)

class ChatRequest(BaseModel):
    message: str
    current_complaint: Optional[ComplaintData] = None

class ChatResponse(BaseModel):
    message: str
    action_type: str
    updated_fields: List[str]
    complaint: ComplaintData
    risk_assessment: RiskAssessmentData

class DocumentExtractionResponse(BaseModel):
    message: str
    extracted_filename: str
    complaint: ComplaintData
    risk_assessment: RiskAssessmentData
    confidence_score: float = 0.95

class DBComplaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String(50), unique=True, index=True)
    complaint_source = Column(String(255))
    customer_name = Column(String(255))
    product_name = Column(String(255))
    product_strength = Column(String(100))
    batch_number = Column(String(100))
    manufacturing_date = Column(String(50))
    expiry_date = Column(String(50))
    quantity_affected = Column(String(100))
    complaint_type = Column(String(100))
    complaint_date = Column(String(50))
    detailed_description = Column(Text)
    initial_severity = Column(String(50))
    priority = Column(String(50))
    risk_assessment = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

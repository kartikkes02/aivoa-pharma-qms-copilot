# AIVOA - AI-Powered Customer Complaint Management System
## API & FDF Quality Assurance Module

An automated pharmaceutical Quality Management System (QMS) Customer Complaint Intake & Risk Assessment application built for AIVOA - AI Product Engineer (Interns) challenge.

---

## 📐 End-to-End System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND LAYER (React 18 + Redux Toolkit)                                           │
│    User enters prompt OR uploads PDF in `AiCopilotChat.jsx`                            │
│    ↓                                                                                   │
│    Dispatches Axios POST request to `/api/agent/chat` or `/api/agent/extract-document` │
└────────────────────────────────────────────────────────┬───────────────────────────────┘
                                                         │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND API LAYER (FastAPI)                                                         │
│    `endpoints.py` receives Pydantic request payload (`ChatRequest` / `UploadFile`)     │
│    ↓                                                                                   │
│    Calls `doc_parser.py` (if PDF/DOCX) to extract raw text                             │
└────────────────────────────────────────────────────────┬───────────────────────────────┘
                                                         │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. AI AGENT LAYER (LangGraph `StateGraph`)                                             │
│    `workflow.py` executes compiled `app_graph.invoke(state_input)`                     │
│    ↓                                                                                   │
│    `nodes.py`:                                                                         │
│      ├── Intent Router: Distinguishes Initial Log vs Edit vs Document Extraction       │
│      ├── Extraction Node: Uses Groq LLM (`gemma2-9b-it`) to extract structured fields  │
│      ├── Field Preserver: Modifies target fields while keeping existing state          │
│      └── QA Risk Engine: Computes Risk Index, Recommended Action, Root Cause & CAPA    │
└────────────────────────────────────────────────────────┬───────────────────────────────┘
                                                         │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. FRONTEND STATE UPDATE & RENDER                                                      │
│    FastAPI returns JSON (`ChatResponse`) containing `complaint` & `risk_assessment`    │
│    ↓                                                                                   │
│    Redux Store dispatches `setFullComplaint` action in `complaintSlice.js`             │
│    ↓                                                                                   │
│    `ComplaintForm.jsx` & `RiskAssessment.jsx` re-render live with blue highlight pulse  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Mandatory Technology Stack
- **Frontend**: React 18 UI with Redux Toolkit for state management & custom modern Vanilla CSS matching reference UI.
- **Backend**: Python FastAPI service.
- **AI Agent Framework**: LangGraph `StateGraph` workflow engine.
- **LLM Support**: Groq (`gemma2-9b-it` / `llama-3.3-70b-versatile`) with structured extraction fallback.
- **Database**: SQLite (SQLAlchemy 2.0 ORM, switchable to PostgreSQL / MySQL).
- **Typography**: Google Inter Font.

---

## 🚀 Mandatory AI Tools Implemented

### 1. Log Complaint Tool
Input natural language prompts (e.g. *"Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 milligrams."*).
- AI extracts product name, strength, batch number, customer details, defect type, and complaint description.
- Populates the **Log Customer Complaint** form on the left.
- Generates **AI Copilot Risk Assessment**: severity, recommended next action, root cause hypotheses, and CAPA suggestions.

### 2. Edit Complaint Tool
Conversational updates (e.g. *"Sorry, the batch number is BMX240602, and the affected quantity is 48 capsules."*).
- Modifies target fields while **preserving all existing complaint data**.
- Recalculates risk assessment dynamically.

### 3. Document Extraction Tool
Upload realistic pharmaceutical complaint documents (PDF, DOCX, TXT, EML) or click 1-click sample documents.
- Parses document text via `pypdf`.
- Auto-populates all form fields and risk assessment.
- Supports follow-up conversational edits (e.g. *"Sorry, the batch number is C-H-G-2-6-0-7-1-2-A, and affected quantity is 50 kilograms, 2 HDPE drums."*).

### 4. Bonus Features
- Complaint Completeness Checker.
- AI Root Cause & CAPA Recommendation Engine.
- Duplicate Complaint Detection.

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the `backend/` directory:

```env
# 1. Groq LLM API Key (Get free key from https://console.groq.com/keys)
GROQ_API_KEY=your_groq_api_key_here

# 2. Database URL Configuration
DATABASE_URL=sqlite:///./complaints.db
```

---

## 📦 Running Locally

### 1. Start FastAPI Backend
```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend runs at: `http://localhost:8000`

### 2. Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 🧪 Demo Video Scenarios to Test
Use the quick action buttons in the right-hand **AI ASSISTANT** panel:
1. **Scenario 1**: Click **💊 1. Log Amoxicillin Prompt**
2. **Scenario 2**: Click **✏️ 2. Edit Batch & Qty (BMX240602)**
3. **Scenario 3**: Click **📄 3. Upload Metformin PDF Sample**
4. **Scenario 4**: Click **✏️ 4. Edit Metformin (50kg, 2 drums)**



from typing import TypedDict, Optional, List, Dict, Any

class AgentState(TypedDict):
    user_message: str
    current_complaint: Dict[str, Any]
    extracted_text: Optional[str]
    action_type: str  # 'log_complaint', 'edit_complaint', 'document_extraction', 'query'
    updated_fields: List[str]
    response_message: str
    risk_assessment: Dict[str, Any]

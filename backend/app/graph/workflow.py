from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.graph.nodes import process_agent_workflow

def agent_node(state: AgentState) -> AgentState:
    """LangGraph node execution wrapper."""
    result = process_agent_workflow(
        user_message=state["user_message"],
        current_complaint=state.get("current_complaint") or {},
        extracted_text=state.get("extracted_text") or ""
    )
    return {
        "user_message": state["user_message"],
        "current_complaint": result["current_complaint"],
        "extracted_text": state.get("extracted_text"),
        "action_type": result["action_type"],
        "updated_fields": result["updated_fields"],
        "response_message": result["response_message"],
        "risk_assessment": result["risk_assessment"]
    }

# Build LangGraph workflow
workflow = StateGraph(AgentState)

# Add single or multi-node execution
workflow.add_node("agent_processor", agent_node)
workflow.set_entry_point("agent_processor")
workflow.add_edge("agent_processor", END)

# Compile graph
app_graph = workflow.compile()

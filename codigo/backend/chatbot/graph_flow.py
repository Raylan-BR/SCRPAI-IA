from langchain_core.messages import SystemMessage, HumanMessage
#langGraph
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, END, MessagesState, StateGraph
from codigo.backend.gemini_api.client import llm
from .prompts import instrucoes

# Define a função do nó do grafo(chama llm)
def call_model(state: MessagesState):
    messages = state["messages"]
    response = llm.invoke(messages)
    messages.append(response)  # adiciona a resposta ao histórico
    return {"messages": messages}

workflow = StateGraph(MessagesState)
workflow.add_node("model", call_model)
workflow.set_entry_point("model")
workflow.set_finish_point("model")

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

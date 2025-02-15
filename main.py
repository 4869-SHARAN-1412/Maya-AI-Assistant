from fastapi import FastAPI
from assistants.maya_core import process_prompt

app = FastAPI(title="Maya AI Assistant")

@app.post("/maya")
async def maya_route(prompt: str):
    response = process_prompt(prompt)
    return {"response": response}

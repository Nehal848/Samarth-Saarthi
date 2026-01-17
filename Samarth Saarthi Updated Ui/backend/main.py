from fastapi.middleware.cors import CORSMiddleware
import os
import json
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- SCHEMA ----------

class InterviewPayload(BaseModel):
    skill: str
    type: str  # "technical" or "communication"
    questions: list[str]
    answers: list[str]

# ---------- GEMINI CLIENT ----------

def get_gemini_client():
    return genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
        http_options={"api_version": "v1"}
    )

# ---------- REAL EVALUATION ----------

@app.post("/evaluate-interview")
def evaluate_interview(payload: InterviewPayload):
    try:
        client = get_gemini_client()

        qna = "\n".join(
            [f"Q{i+1}: {q}\nA{i+1}: {a}"
             for i, (q, a) in enumerate(zip(payload.questions, payload.answers))]
        )

        prompt = f"""
You are a strict {payload.type} interviewer evaluating a candidate for the skill: {payload.skill}.

Evaluate the following answers honestly.

Return ONLY a valid JSON object with this exact format:

{{
  "score": number between 0 and 100,
  "feedback": "clear, concise improvement-focused feedback"
}}

DO NOT add explanations, markdown, or extra text.

INTERVIEW:
{qna}
"""

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        raw = response.text.strip()

        # Safety JSON extraction
        start = raw.find("{")
        end = raw.rfind("}") + 1
        clean_json = raw[start:end]

        return json.loads(clean_json)

    except Exception as e:
        return {
            "score": 0,
            "feedback": "AI evaluation failed. Please retry.",
            "error": str(e)
        }

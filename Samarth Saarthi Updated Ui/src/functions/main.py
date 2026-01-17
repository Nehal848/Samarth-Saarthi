import os
import json
import re  # Added for better JSON cleaning
import firebase_admin
from firebase_admin import initialize_app, firestore
from firebase_functions import https_fn, logger
import google.generativeai as genai

# Initialize globally
if not firebase_admin._apps:
    initialize_app()
db = firestore.client()

@https_fn.on_call(secrets=["GEMINI_API_KEY"])
def analyze_and_reward(req: https_fn.CallableRequest):
    # 1. Setup Gemini with safety check
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("Missing GEMINI_API_KEY secret!")
        return {"error": "Server configuration error", "isCorrect": False}
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    uid = req.auth.uid if req.auth else None
    if not uid:
        return {"error": "Unauthorized", "isCorrect": False}

    data = req.data
    question = data.get("question", "N/A")
    student_answer = data.get("studentAnswer", "")
    skill = data.get("skill", "General")
    mode = data.get("mode", "technical")
    difficulty = data.get("difficulty", "beginner")

    # 2. Strict Prompt - Telling Gemini exactly what to return
    prompt = f"""
    Act as a {mode} interviewer for {skill} at {difficulty} level.
    Question: {question}
    Student Answer: {student_answer}
    
    Return ONLY a raw JSON object with these keys: 
    "isCorrect" (boolean), "score" (number 1-10), "feedback" (string).
    Do not include any conversational text or markdown backticks.
    """

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        
        # 3. Robust JSON Cleaning (The Fix for the 500 Error)
        # Extract anything between { and }
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            clean_json = match.group(0)
        else:
            clean_json = raw_text

        result = json.loads(clean_json)

        # 4. Database Updates
        is_passed = result.get("isCorrect") is True and result.get("score", 0) >= 7

        if is_passed:
            user_ref = db.collection("users").document(uid)
            user_ref.update({
                "nexusCredits": firestore.Increment(5),
                "verifiedSkills": firestore.ArrayUnion([f"{skill}_{difficulty}"]) 
            })
            result["rewarded"] = True
        else:
            result["rewarded"] = False

        return result

    except Exception as e:
        logger.error(f"Function Error: {str(e)}")
        # We return a 200 status with an error message so the frontend doesn't crash
        return {"error": str(e), "isCorrect": False}

@https_fn.on_call(secrets=["GEMINI_API_KEY"])
def claim_gauntlet_reward(req: https_fn.CallableRequest):
    uid = req.auth.uid if req.auth else None
    if not uid: return {"success": False, "error": "Unauthorized"}

    skill = req.data.get("skill")
    stage = req.data.get("stage")
    
    try:
        user_ref = db.collection("users").document(uid)
        batch = db.batch()
        
        user_ref_doc = db.collection("users").document(uid)
        batch.update(user_ref_doc, {
            "nexusCredits": firestore.Increment(50),
            "verifiedSkills": firestore.ArrayUnion([f"{skill}_{stage}"]),
            "lastVerifiedDate": firestore.SERVER_TIMESTAMP
        })

        verification_ref = db.collection("verifications").document()
        batch.set(verification_ref, {
            "uid": uid,
            "skill": skill,
            "stage": stage,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "creditsAwarded": 50
        })

        batch.commit()
        return {"success": True, "message": f"Verified in {skill} {stage}!"}
    except Exception as e:
        logger.error(f"Claim Error: {str(e)}")
        return {"success": False, "error": str(e)}


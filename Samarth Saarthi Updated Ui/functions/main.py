from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
import time

initialize_app()

@https_fn.on_call()
def save_verified_badge(req: https_fn.CallableRequest) -> any:
    """Saves a verified badge to the user's document in Firestore."""
    
    # 1. Verify Authentication
    if req.auth is None:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            message="The function must be called while authenticated."
        )
    
    uid = req.auth.uid
    data = req.data
    
    skill = data.get("skill")
    score = data.get("score")
    confidence = data.get("confidence", "high")
    badge_type = data.get("type", "technical")
    
    if not skill or score is None:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="Skill and score are required."
        )
    
    db: google.cloud.firestore.Client = firestore.client()
    user_ref = db.collection("users").document(uid)
    
    # 2. Update Firestore
    # We use a transaction or just get and set to handle the array filtering
    user_doc = user_ref.get()
    
    new_badge = {
        "id": f"{skill}-{int(time.time())}",
        "skill": skill,
        "score": score,
        "confidence": confidence,
        "verifiedAt": firestore.SERVER_TIMESTAMP,
        "type": badge_type
    }
    
    if user_doc.exists:
        current_data = user_doc.to_dict()
        current_badges = current_data.get("verifiedBadges", [])
        
        # Filter out old badge for same skill
        updated_badges = [b for b in current_badges if isinstance(b, dict) and b.get("skill") != skill]
        updated_badges.append(new_badge)
        
        user_ref.update({
            "verifiedBadges": updated_badges
        })
    else:
        user_ref.set({
            "verifiedBadges": [new_badge]
        })
        
    return {"status": "success", "skill": skill}

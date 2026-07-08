import random

def calculate_similarity(text1: str, text2: str) -> float:
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    if not union:
        return 0.0
    return round(len(intersection) / len(union), 2)

def predict_ticket_metrics(title: str, description: str, historical_tickets=None):
    combined_text = f"{title} {description}".lower()
    categories = ["Technical Issue", "General Inquiry", "Security"]
    
    keywords = []
    explanation_triggers = []

    # Simple Lexical Sentiment Valence Analysis
    frustration_words = ["furious", "terrible", "broken", "unacceptable", "refund", "worst", "annoyed", "useless", "disappointed", "urgent"]
    sentiment_score = 1.0  # Default neutral/positive baseline score
    
    match_count = sum(1 for w in frustration_words if w in combined_text)
    if match_count > 0:
        sentiment_score = max(0.1, round(1.0 - (match_count * 0.25), 2))

    if any(w in combined_text for w in ["db", "database", "mongodb", "cluster"]): 
        keywords.append("database")
        explanation_triggers.append("database system flag")
    if any(w in combined_text for w in ["login", "password", "auth", "jwt"]): 
        keywords.append("authentication")
        explanation_triggers.append("identity access tokens")
    if any(w in combined_text for w in ["slow", "latency", "timeout", "lag"]): 
        keywords.append("performance")
        explanation_triggers.append("resource bottleneck constraint")
    if any(w in combined_text for w in ["payment", "checkout", "stripe", "card"]): 
        keywords.append("billing")
        explanation_triggers.append("payment processing gate")
    if any(w in combined_text for w in ["error", "500", "404", "crash"]): 
        keywords.append("system-fault")
        explanation_triggers.append("system crash trace error")

    if not keywords:
        keywords = ["general-triage"]
        explanation_triggers.append("baseline standard textual features")

    if any(word in combined_text for word in ["security", "leak", "hack", "breach", "password", "unauthorized"]):
        primary_cat = "Security"
        priority = "High"
        confidence = 0.94
        suggested_reply = "Hello, thank you for flagging this concern. Our SecOps incident team has been automatically notified out-of-band."
    elif any(word in combined_text for word in ["down", "crash", "broken", "error 500", "fail", "timeout"]):
        primary_cat = "Technical Issue"
        priority = "High"
        confidence = 0.89
        suggested_reply = "Hi, we apologize for the interruption. Our engineering team is currently investigating a potential infrastructure fault."
    else:
        primary_cat = "General Inquiry"
        priority = "Low"
        confidence = 0.72
        suggested_reply = "Thank you for contacting TicketMind support. Your submission has been indexed into our standard triage queue."

    # Force AI Sentiment Escalation Rule Override
    if sentiment_score <= 0.45 and priority == "Low":
        priority = "Medium"
        explanation_triggers.append("Sentiment-driven out-of-band escalation trigger activated")

    remaining = round(1.0 - confidence, 2)
    other_cats = [c for c in categories if c != primary_cat]
    probabilities = [
        {"category": primary_cat, "probability": confidence},
        {"category": other_cats[0], "probability": round(remaining * 0.7, 2)},
        {"category": other_cats[1], "probability": round(remaining * 0.3, 2)}
    ]

    similar_ticket_id = None
    is_duplicate = False
    
    if historical_tickets:
        for t in historical_tickets:
            score = calculate_similarity(combined_text, f"{t.get('title','')} {t.get('description','')}")
            if score >= 0.65:
                similar_ticket_id = t.get('ticketId')
                if score >= 0.85:
                    is_duplicate = True
                break

    return {
        "category": primary_cat,
        "confidence": confidence,
        "probabilities": probabilities,
        "predicted_priority": priority,
        "keywords": keywords,
        "suggested_reply": suggested_reply,
        "is_duplicate": is_duplicate,
        "similarTicketId": similar_ticket_id,
        "sentimentScore": sentiment_score,
        "explanation": {
            "primaryReason": f"Assigned to {primary_cat} with a user sentiment valence rank of {sentiment_score}.",
            "topImpactTokens": explanation_triggers
        }
    }

import os
import json
import pickle
import math
from utils import preprocess_text

TRAINING_DATA = [
    ("Cannot login to my account, password reset not working", "Technical Issue", "High"),
    ("Getting 500 error when trying to access dashboard", "Technical Issue", "High"),
    ("App crashes every time I open settings page", "Technical Issue", "High"),
    ("Database connection timeout on production server", "Technical Issue", "High"),
    ("API returning null values for user profile endpoint", "Technical Issue", "Medium"),
    ("Slow loading times on the reports page", "Technical Issue", "Medium"),
    ("CSS not rendering properly on mobile devices", "Technical Issue", "Low"),
    ("Need help configuring webhook integration", "Technical Issue", "Medium"),
    ("SSL certificate expired on subdomain", "Technical Issue", "High"),
    ("Memory leak causing server crashes", "Technical Issue", "High"),
    ("File upload fails for files larger than 10MB", "Technical Issue", "Medium"),
    ("Search functionality not returning results", "Technical Issue", "Medium"),
    ("Email notifications not being sent", "Technical Issue", "High"),
    ("Two-factor authentication not working", "Technical Issue", "High"),
    ("Integration with third-party API broken", "Technical Issue", "Medium"),
    ("Charged twice for monthly subscription", "Billing", "High"),
    ("Need to update credit card information", "Billing", "Medium"),
    ("Invoice not received for last month", "Billing", "Medium"),
    ("Wrong amount charged on annual plan", "Billing", "High"),
    ("Need receipt for tax purposes", "Billing", "Low"),
    ("Payment failed but money deducted from account", "Billing", "High"),
    ("Want to upgrade from basic to premium plan", "Billing", "Medium"),
    ("Automatic renewal charged without notice", "Billing", "Medium"),
    ("Need to change billing address", "Billing", "Low"),
    ("Dispute charge on invoice #12345", "Billing", "High"),
    ("Refund for unused subscription period", "Billing", "Medium"),
    ("Corporate billing contact needs to be updated", "Billing", "Low"),
    ("Requesting full refund for defective product", "Refund", "High"),
    ("Product arrived damaged, need refund", "Refund", "High"),
    ("Changed mind about purchase, within 30 days", "Refund", "Medium"),
    ("Refund not processed after 7 business days", "Refund", "High"),
    ("Partial refund for missing items in order", "Refund", "Medium"),
    ("Want to return item and get store credit", "Refund", "Medium"),
    ("Refund amount is incorrect", "Refund", "High"),
    ("Need refund status update", "Refund", "Medium"),
    ("Automatic refund not received after cancellation", "Refund", "High"),
    ("Refund policy clarification needed", "Refund", "Low"),
    ("Account locked after multiple failed login attempts", "Account Access", "High"),
    ("Forgot password and recovery email not received", "Account Access", "High"),
    ("Need to transfer account ownership to new employee", "Account Access", "Medium"),
    ("Account suspended without explanation", "Account Access", "High"),
    ("Cannot access admin panel with current credentials", "Account Access", "High"),
    ("Want to close my account permanently", "Account Access", "Medium"),
    ("Need to merge two accounts into one", "Account Access", "Medium"),
    ("Account hacked, unauthorized transactions visible", "Account Access", "High"),
    ("Single sign-on not working with corporate ID", "Account Access", "High"),
    ("Permission denied when accessing shared resources", "Account Access", "Medium"),
    ("Need to reset MFA device", "Account Access", "High"),
    ("Account verification email not arriving", "Account Access", "Medium"),
    ("Would love to see dark mode option in dashboard", "Feature Request", "Low"),
    ("Need export to PDF functionality for reports", "Feature Request", "Medium"),
    ("Please add support for multiple languages", "Feature Request", "Low"),
    ("Want calendar integration with Google Calendar", "Feature Request", "Medium"),
    ("Need mobile app for iOS devices", "Feature Request", "Medium"),
    ("Would like custom dashboard widgets", "Feature Request", "Low"),
    ("Please add keyboard shortcuts for common actions", "Feature Request", "Low"),
    ("Need webhook support for real-time notifications", "Feature Request", "Medium"),
    ("Want role-based access control with custom roles", "Feature Request", "Medium"),
    ("Please add bulk import via CSV feature", "Feature Request", "Medium"),
    ("Need API rate limit increase for enterprise use", "Feature Request", "Medium"),
    ("Would like white-label options for client portals", "Feature Request", "Low"),
    ("Very disappointed with recent service degradation", "Complaint", "Medium"),
    ("Customer support was rude and unhelpful", "Complaint", "High"),
    ("Product quality has significantly declined", "Complaint", "High"),
    ("False advertising on feature capabilities", "Complaint", "High"),
    ("Long wait times for support response unacceptable", "Complaint", "Medium"),
    ("Billing practices are misleading", "Complaint", "High"),
    ("Data loss occurred during system migration", "Complaint", "High"),
    ("Service outage caused business losses", "Complaint", "High"),
    ("Terms of service changed without proper notice", "Complaint", "Medium"),
    ("Competitors offer better value for money", "Complaint", "Low"),
    ("UI redesign made workflow harder", "Complaint", "Medium"),
    ("Promised features still not delivered after 6 months", "Complaint", "High"),
    ("What are your business hours for phone support?", "General Inquiry", "Low"),
    ("Need information about enterprise pricing", "General Inquiry", "Low"),
    ("How do I enable two-factor authentication?", "General Inquiry", "Low"),
    ("Where can I find API documentation?", "General Inquiry", "Low"),
    ("What is the uptime SLA for premium plans?", "General Inquiry", "Low"),
    ("Need to know data center locations", "General Inquiry", "Low"),
    ("How do I add team members to my account?", "General Inquiry", "Low"),
    ("What security certifications do you have?", "General Inquiry", "Low"),
    ("Need case studies for enterprise clients", "General Inquiry", "Low"),
    ("How does data retention policy work?", "General Inquiry", "Low"),
    ("Want to schedule a demo with sales team", "General Inquiry", "Medium"),
    ("Need compliance documentation for SOC2", "General Inquiry", "Medium"),
    ("Clicking save button deletes instead of saving", "Bug Report", "High"),
    ("Date picker shows wrong month on leap years", "Bug Report", "Medium"),
    ("Notification badge count not updating correctly", "Bug Report", "Medium"),
    ("Export button downloads empty file", "Bug Report", "High"),
    ("Form validation allows invalid email format", "Bug Report", "Medium"),
    ("Pagination shows duplicate entries on page 2", "Bug Report", "Medium"),
    ("Dropdown menu hidden behind modal overlay", "Bug Report", "Low"),
    ("Timezone conversion off by one hour", "Bug Report", "Medium"),
    ("Chart tooltip shows undefined values", "Bug Report", "Low"),
    ("File preview not working for PDF documents", "Bug Report", "Medium"),
    ("Keyboard navigation skips form fields", "Bug Report", "Low"),
    ("Search results inconsistent between refreshes", "Bug Report", "Medium"),
    ("Order not delivered after estimated date", "Shipping", "High"),
    ("Wrong items shipped in order #67890", "Shipping", "High"),
    ("Need to change shipping address before dispatch", "Shipping", "Medium"),
    ("Package arrived damaged during transit", "Shipping", "High"),
    ("Tracking number not showing any updates", "Shipping", "Medium"),
    ("Want expedited shipping for urgent order", "Shipping", "Medium"),
    ("International shipping customs delay", "Shipping", "Medium"),
    ("Missing items from shipped package", "Shipping", "High"),
    ("Need to schedule delivery for specific time", "Shipping", "Low"),
    ("Shipping label needs to be reprinted", "Shipping", "Low"),
    ("Return shipping label not received", "Shipping", "Medium"),
    ("Order status stuck in processing for 5 days", "Shipping", "High"),
    ("Suspected unauthorized access to my account", "Security", "High"),
    ("Received phishing email claiming to be from your company", "Security", "High"),
    ("Need to report vulnerability in your API", "Security", "High"),
    ("Data breach notification required", "Security", "High"),
    ("Suspicious login activity from unknown location", "Security", "High"),
    ("Need to enforce stronger password policy", "Security", "Medium"),
    ("Want to enable IP whitelisting for admin access", "Security", "Medium"),
    ("Audit log showing deleted records", "Security", "High"),
    ("Need encryption at rest for stored files", "Security", "Medium"),
    ("Want to report malware in downloaded file", "Security", "High"),
    ("GDPR data deletion request", "Security", "Medium"),
    ("Need security assessment report", "Security", "Medium"),
]

class NaiveBayesClassifier:
    def __init__(self):
        self.class_word_counts = {}
        self.class_doc_counts = {}
        self.vocab = set()
        self.total_docs = 0
        self.classes = []
        self.priors = {}
        self.word_probs = {}
        
    def fit(self, texts, labels):
        self.classes = sorted(list(set(labels)))
        self.total_docs = len(texts)
        
        for text, label in zip(texts, labels):
            words = text.split()
            self.class_doc_counts[label] = self.class_doc_counts.get(label, 0) + 1
            if label not in self.class_word_counts:
                self.class_word_counts[label] = {}
            for word in words:
                self.class_word_counts[label][word] = self.class_word_counts[label].get(word, 0) + 1
                self.vocab.add(word)
        
        for c in self.classes:
            self.priors[c] = math.log(self.class_doc_counts[c] / self.total_docs)
        
        vocab_size = len(self.vocab)
        for c in self.classes:
            total_words = sum(self.class_word_counts[c].values())
            self.word_probs[c] = {}
            for word in self.vocab:
                count = self.class_word_counts[c].get(word, 0)
                self.word_probs[c][word] = math.log((count + 1) / (total_words + vocab_size))
    
    def predict(self, text):
        words = text.split()
        scores = {}
        for c in self.classes:
            score = self.priors[c]
            for word in words:
                if word in self.vocab:
                    score += self.word_probs[c][word]
            scores[c] = score
        return max(scores, key=scores.get)
    
    def predict_proba(self, text):
        words = text.split()
        scores = {}
        for c in self.classes:
            score = self.priors[c]
            for word in words:
                if word in self.vocab:
                    score += self.word_probs[c][word]
            scores[c] = score
        
        max_score = max(scores.values())
        exp_scores = {c: math.exp(s - max_score) for c, s in scores.items()}
        total = sum(exp_scores.values())
        return {c: exp_scores[c] / total for c in self.classes}

class PriorityClassifier:
    HIGH_KEYWORDS = [
        'urgent','critical','emergency','security','hack','breach',
        'unauthorized','down','not working','broken','failed','crash',
        'data loss','phishing','malware','suspended','locked out',
        'cannot access','login failed','payment failed','charged twice',
        'wrong amount','defective','damaged','missing items'
    ]
    
    MEDIUM_KEYWORDS = [
        'issue','problem','error','bug','slow','delay','missing',
        'wrong','not receiving','not showing','not updating','incorrect',
        'confused','need help','assistance','support','question'
    ]
    
    def predict(self, text):
        text_lower = text.lower()
        high_score = sum(1 for kw in self.HIGH_KEYWORDS if kw in text_lower)
        medium_score = sum(1 for kw in self.MEDIUM_KEYWORDS if kw in text_lower)
        if high_score >= 1:
            return 'High'
        elif medium_score >= 1:
            return 'Medium'
        return 'Low'
    
    def predict_proba(self, text):
        text_lower = text.lower()
        high_score = sum(1 for kw in self.HIGH_KEYWORDS if kw in text_lower)
        medium_score = sum(1 for kw in self.MEDIUM_KEYWORDS if kw in text_lower)
        if high_score >= 1:
            return {'High': 0.7, 'Medium': 0.2, 'Low': 0.1}
        elif medium_score >= 1:
            return {'High': 0.15, 'Medium': 0.65, 'Low': 0.2}
        return {'High': 0.1, 'Medium': 0.25, 'Low': 0.65}

def train_models():
    print("=" * 60)
    print("AI Support Ticket Classification - Model Training")
    print("=" * 60)
    
    os.makedirs('models', exist_ok=True)
    
    texts = [item[0] for item in TRAINING_DATA]
    categories = [item[1] for item in TRAINING_DATA]
    processed_texts = [preprocess_text(text) for text in texts]
    
    print("\nTraining category classifier...")
    category_model = NaiveBayesClassifier()
    category_model.fit(processed_texts, categories)
    
    correct = 0
    for text, true_label in zip(processed_texts, categories):
        if category_model.predict(text) == true_label:
            correct += 1
    print(f"Category Model Accuracy (train): {correct / len(categories):.4f}")
    
    with open('models/category_model.pkl', 'wb') as f:
        pickle.dump(category_model, f)
    print("Category model saved.")
    
    print("\nTraining priority classifier...")
    priority_model = PriorityClassifier()
    
    priorities = [item[2] for item in TRAINING_DATA]
    correct = 0
    for text, true_label in zip(texts, priorities):
        if priority_model.predict(text) == true_label:
            correct += 1
    print(f"Priority Model Accuracy (train): {correct / len(priorities):.4f}")
    
    with open('models/priority_model.pkl', 'wb') as f:
        pickle.dump(priority_model, f)
    print("Priority model saved.")
    
    metadata = {
        'categories': sorted(list(set(categories))),
        'priorities': ['Low', 'Medium', 'High'],
        'training_samples': len(TRAINING_DATA),
        'version': '1.0.0-pure-python'
    }
    
    with open('models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n" + "=" * 60)
    print("Training complete! Models saved to ./models/")
    print("=" * 60)
    
    return category_model, priority_model

if __name__ == '__main__':
    train_models()

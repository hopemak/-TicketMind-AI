import os
import json
import pickle
import math
import random
from utils import preprocess_text

TRAIN_SPLIT = 0.7
VAL_SPLIT = 0.15
TEST_SPLIT = 0.15
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

def load_dataset(filepath="data/tickets.csv"):
    import csv
    if not os.path.exists(filepath):
        print("Dataset not found at", filepath)
        from train_model import TRAINING_DATA
        return [{"text": item[0], "category": item[1], "priority": item[2]} for item in TRAINING_DATA]
    data = []
    with open(filepath, "r", encoding="utf-8") as f:
        sample = f.read(2048)
        f.seek(0)
        delimiter = "\t" if "\t" in sample else ","
        reader = csv.DictReader(f, delimiter=delimiter)
        headers = reader.fieldnames
        print("CSV headers:", headers)
        for row in reader:
            text = (row.get("Document") or row.get("document") or "").strip()
            category = (row.get("Topic_group") or row.get("topic_group") or "General Inquiry").strip()
            priority = "Medium"
            if text and category:
                data.append({"text": text, "category": category, "priority": priority})
    print("Loaded", len(data), "records")
    return data

def split_data(data):
    random.shuffle(data)
    n = len(data)
    train_end = int(n * TRAIN_SPLIT)
    val_end = int(n * (TRAIN_SPLIT + VAL_SPLIT))
    return data[:train_end], data[train_end:val_end], data[val_end:]

class ImprovedNaiveBayes:
    def __init__(self, alpha=1.0):
        self.alpha = alpha
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
                self.word_probs[c][word] = math.log((count + self.alpha) / (total_words + self.alpha * vocab_size))
    
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

class ImprovedPriorityClassifier:
    HIGH_KEYWORDS = ["urgent","critical","emergency","security","hack","breach","unauthorized","down","not working","broken","failed","crash","data loss","phishing","malware","suspended","locked out","cannot access","login failed","payment failed","charged twice","wrong amount","defective","damaged","missing items","outage","server down","system down","production issue","escalate"]
    MEDIUM_KEYWORDS = ["issue","problem","error","bug","slow","delay","missing","wrong","not receiving","not showing","not updating","incorrect","confused","need help","assistance","support","question","how to","unable to","trouble","difficulty"]
    
    def predict(self, text):
        text_lower = text.lower()
        high_score = sum(1 for kw in self.HIGH_KEYWORDS if kw in text_lower)
        medium_score = sum(1 for kw in self.MEDIUM_KEYWORDS if kw in text_lower)
        if high_score >= 2:
            return "High"
        elif high_score >= 1 or medium_score >= 2:
            return "Medium"
        return "Low"
    
    def predict_proba(self, text):
        text_lower = text.lower()
        high_score = sum(1 for kw in self.HIGH_KEYWORDS if kw in text_lower)
        medium_score = sum(1 for kw in self.MEDIUM_KEYWORDS if kw in text_lower)
        if high_score >= 2:
            return {"High": 0.85, "Medium": 0.12, "Low": 0.03}
        elif high_score >= 1:
            return {"High": 0.65, "Medium": 0.28, "Low": 0.07}
        elif medium_score >= 2:
            return {"High": 0.15, "Medium": 0.70, "Low": 0.15}
        elif medium_score >= 1:
            return {"High": 0.08, "Medium": 0.55, "Low": 0.37}
        return {"High": 0.05, "Medium": 0.20, "Low": 0.75}

def evaluate_model(model, texts, labels):
    predictions = [model.predict(text) for text in texts]
    correct = sum(1 for p, t in zip(predictions, labels) if p == t)
    accuracy = correct / len(labels) if labels else 0
    classes = sorted(set(labels))
    per_class = {}
    for c in classes:
        tp = sum(1 for p, t in zip(predictions, labels) if p == c and t == c)
        fp = sum(1 for p, t in zip(predictions, labels) if p == c and t != c)
        fn = sum(1 for p, t in zip(predictions, labels) if p != c and t == c)
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        per_class[c] = {"precision": round(precision, 4), "recall": round(recall, 4), "f1": round(f1, 4), "support": sum(1 for t in labels if t == c)}
    
    macro_precision = sum(m["precision"] for m in per_class.values()) / len(per_class) if per_class else 0
    macro_recall = sum(m["recall"] for m in per_class.values()) / len(per_class) if per_class else 0
    macro_f1 = sum(m["f1"] for m in per_class.values()) / len(per_class) if per_class else 0
    
    total_support = sum(m["support"] for m in per_class.values())
    weighted_precision = sum(m["precision"] * m["support"] for m in per_class.values()) / total_support if total_support else 0
    weighted_recall = sum(m["recall"] * m["support"] for m in per_class.values()) / total_support if total_support else 0
    weighted_f1 = sum(m["f1"] * m["support"] for m in per_class.values()) / total_support if total_support else 0
    
    return {
        "accuracy": round(accuracy, 4),
        "macro_precision": round(macro_precision, 4),
        "macro_recall": round(macro_recall, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_precision": round(weighted_precision, 4),
        "weighted_recall": round(weighted_recall, 4),
        "weighted_f1": round(weighted_f1, 4),
        "per_class": per_class
    }

def print_metrics(metrics, model_name):
    print()
    print("=" * 60)
    print(model_name + " Evaluation Results")
    print("=" * 60)
    print("Accuracy:     ", round(metrics["accuracy"], 4))
    print("Macro F1:     ", round(metrics["macro_f1"], 4))
    print("Weighted F1:  ", round(metrics["weighted_f1"], 4))
    print("\nPer-Class Metrics:")
    print(f"{'Class':<25} {'Precision':<10} {'Recall':<10} {'F1':<10} {'Support':<10}")
    print("-" * 65)
    for cls, m in sorted(metrics["per_class"].items()):
        print(f"{cls:<25} {m['precision']:<10.4f} {m['recall']:<10.4f} {m['f1']:<10.4f} {m['support']:<10}")
    print("=" * 60)

def train_models():
    print("=" * 60)
    print("TicketMind AI - Improved Model Training")
    print("=" * 60)
    os.makedirs("models", exist_ok=True)
    data = load_dataset()
    if len(data) == 0:
        print("ERROR: No data loaded!")
        return None, None
    train_data, val_data, test_data = split_data(data)
    print("\nData split: Train=" + str(len(train_data)) + ", Val=" + str(len(val_data)) + ", Test=" + str(len(test_data)))
    train_texts = [preprocess_text(d["text"]) for d in train_data]
    train_categories = [d["category"] for d in train_data]
    val_texts = [preprocess_text(d["text"]) for d in val_data]
    val_categories = [d["category"] for d in val_data]
    test_texts = [preprocess_text(d["text"]) for d in test_data]
    test_categories = [d["category"] for d in test_data]
    test_priorities = [d["priority"] for d in test_data]
    print("\nTraining category classifier...")
    category_model = ImprovedNaiveBayes(alpha=1.0)
    category_model.fit(train_texts, train_categories)
    print("\n>>> Validation Set <<<")
    val_metrics = evaluate_model(category_model, val_texts, val_categories)
    print_metrics(val_metrics, "Category Model (Validation)")
    print("\n>>> Test Set <<<")
    test_metrics = evaluate_model(category_model, test_texts, test_categories)
    print_metrics(test_metrics, "Category Model (Test)")
    with open("models/category_model.pkl", "wb") as f:
        pickle.dump(category_model, f)
    print("\nCategory model saved.")
    print("\nTraining priority classifier...")
    priority_model = ImprovedPriorityClassifier()
    priority_preds = [priority_model.predict(d["text"]) for d in test_data]
    priority_correct = sum(1 for p, t in zip(priority_preds, test_priorities) if p == t)
    priority_accuracy = priority_correct / len(test_priorities) if test_priorities else 0
    print("Priority Test Accuracy:", round(priority_accuracy, 4))
    with open("models/priority_model.pkl", "wb") as f:
        pickle.dump(priority_model, f)
    print("Priority model saved.")
    metadata = {
        "categories": sorted(list(set(train_categories))),
        "priorities": ["Low", "Medium", "High"],
        "training_samples": len(train_data),
        "validation_samples": len(val_data),
        "test_samples": len(test_data),
        "category_metrics": {"validation": val_metrics, "test": test_metrics},
        "priority_test_accuracy": round(priority_accuracy, 4),
        "version": "2.0.0-improved"
    }
    with open("models/metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    print("\nMetadata saved.")
    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)
    return category_model, priority_model

if __name__ == "__main__":
    train_models()
import os
import json
import pickle
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

from utils import preprocess_text

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

CATEGORY_MODEL = None
PRIORITY_MODEL = None
METADATA = None

def load_models():
    global CATEGORY_MODEL, PRIORITY_MODEL, METADATA
    try:
        with open('models/category_model.pkl', 'rb') as f:
            CATEGORY_MODEL = pickle.load(f)
        logger.info("Category model loaded")
        with open('models/priority_model.pkl', 'rb') as f:
            PRIORITY_MODEL = pickle.load(f)
        logger.info("Priority model loaded")
        with open('models/metadata.json', 'r') as f:
            METADATA = json.load(f)
        logger.info("Metadata loaded")
        return True
    except Exception as e:
        logger.error(f"Failed to load models: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    status = {
        'status': 'healthy' if CATEGORY_MODEL and PRIORITY_MODEL else 'unhealthy',
        'models_loaded': CATEGORY_MODEL is not None and PRIORITY_MODEL is not None,
        'timestamp': datetime.utcnow().isoformat()
    }
    return jsonify(status), 200 if status['models_loaded'] else 503

@app.route('/classify', methods=['POST'])
def classify_ticket():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        title = data.get('title', '')
        description = data.get('description', '')
        
        if not title and not description:
            return jsonify({'success': False, 'error': 'Title or description is required'}), 400
        
        combined_text = f"{title} {description}".strip()
        processed_text = preprocess_text(combined_text)
        
        if not processed_text:
            return jsonify({'success': False, 'error': 'Could not process text'}), 400
        
        category = CATEGORY_MODEL.predict(processed_text)
        category_proba = CATEGORY_MODEL.predict_proba(processed_text)
        category_confidence = float(max(category_proba.values()))
        
        all_categories = [
            {'name': cls, 'confidence': round(float(prob) * 100, 2)}
            for cls, prob in category_proba.items()
        ]
        all_categories.sort(key=lambda x: x['confidence'], reverse=True)
        
        priority = PRIORITY_MODEL.predict(combined_text)
        priority_proba = PRIORITY_MODEL.predict_proba(combined_text)
        priority_confidence = float(max(priority_proba.values()))
        
        all_priorities = [
            {'name': cls, 'confidence': round(float(prob) * 100, 2)}
            for cls, prob in priority_proba.items()
        ]
        all_priorities.sort(key=lambda x: x['confidence'], reverse=True)
        
        overall_confidence = (category_confidence + priority_confidence) / 2
        
        result = {
            'success': True,
            'data': {
                'category': category,
                'priority': priority,
                'confidence': round(overall_confidence * 100, 2),
                'categoryConfidence': round(category_confidence * 100, 2),
                'priorityConfidence': round(priority_confidence * 100, 2),
                'allCategories': all_categories[:5],
                'allPriorities': all_priorities,
                'processedText': processed_text[:200] + '...' if len(processed_text) > 200 else processed_text
            }
        }
        
        logger.info(f"Classified: category={category}, priority={priority}, confidence={overall_confidence:.2f}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Classification error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/batch-classify', methods=['POST'])
def batch_classify():
    try:
        data = request.get_json()
        if not data or 'tickets' not in data:
            return jsonify({'success': False, 'error': 'Tickets array is required'}), 400
        
        tickets = data['tickets']
        if not isinstance(tickets, list) or len(tickets) == 0:
            return jsonify({'success': False, 'error': 'Tickets must be a non-empty array'}), 400
        if len(tickets) > 100:
            return jsonify({'success': False, 'error': 'Maximum 100 tickets per batch'}), 400
        
        results = []
        for ticket in tickets:
            title = ticket.get('title', '')
            description = ticket.get('description', '')
            combined_text = f"{title} {description}".strip()
            processed_text = preprocess_text(combined_text)
            
            if not processed_text:
                results.append({
                    'category': 'Unknown',
                    'priority': 'Medium',
                    'confidence': 0.0,
                    'error': 'Could not process text'
                })
                continue
            
            category = CATEGORY_MODEL.predict(processed_text)
            category_proba = CATEGORY_MODEL.predict_proba(processed_text)
            category_confidence = float(max(category_proba.values()))
            
            priority = PRIORITY_MODEL.predict(combined_text)
            priority_proba = PRIORITY_MODEL.predict_proba(combined_text)
            priority_confidence = float(max(priority_proba.values()))
            
            overall_confidence = (category_confidence + priority_confidence) / 2
            
            results.append({
                'category': category,
                'priority': priority,
                'confidence': round(overall_confidence * 100, 2)
            })
        
        return jsonify({
            'success': True,
            'data': {'results': results, 'count': len(results)}
        }), 200
        
    except Exception as e:
        logger.error(f"Batch classification error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    if not METADATA:
        return jsonify({'success': False, 'error': 'Models not loaded'}), 503
    return jsonify({
        'success': True,
        'data': {
            'categories': METADATA.get('categories', []),
            'priorities': METADATA.get('priorities', [])
        }
    }), 200

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        feedback_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'ticketId': data.get('ticketId'),
            'predictedCategory': data.get('predictedCategory'),
            'correctedCategory': data.get('correctedCategory'),
            'predictedPriority': data.get('predictedPriority'),
            'correctedPriority': data.get('correctedPriority')
        }
        
        feedback_file = 'data/feedback.json'
        os.makedirs('data', exist_ok=True)
        
        feedback_data = []
        if os.path.exists(feedback_file):
            with open(feedback_file, 'r') as f:
                feedback_data = json.load(f)
        
        feedback_data.append(feedback_entry)
        
        with open(feedback_file, 'w') as f:
            json.dump(feedback_data, f, indent=2)
        
        logger.info(f"Feedback recorded for ticket {data.get('ticketId')}")
        return jsonify({'success': True, 'message': 'Feedback recorded'}), 200
        
    except Exception as e:
        logger.error(f"Feedback error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    if not load_models():
        logger.info("Models not found. Training new models...")
        from train_model import train_models
        train_models()
        load_models()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', 'false').lower() == 'true')

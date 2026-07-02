import re
import string
import math
import json
import pickle
import os

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords', quiet=True)
    
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet', quiet=True)
    
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    lemmatizer = None
    stop_words = set()

def preprocess_text(text):
    if not text or not isinstance(text, str):
        return ""
    
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\s+', ' ', text).strip()
    
    tokens = text.split()
    
    if NLTK_AVAILABLE and lemmatizer:
        tokens = [lemmatizer.lemmatize(word) for word in tokens 
                  if word not in stop_words and len(word) > 2]
    else:
        basic_stops = {'the','a','an','is','are','was','were','be','been',
                       'being','have','has','had','do','does','did','will',
                       'would','could','should','may','might','must','shall',
                       'can','need','to','of','in','for','on','with','at','by',
                       'from','as','into','through','during','before','after',
                       'above','below','between','under','and','but','or','yet',
                       'so','if','because','although','though','while','where',
                       'when','that','which','who','whom','whose','what','this',
                       'these','those','i','me','my','myself','we','our','you',
                       'your','he','him','his','she','her','it','its','they',
                       'them','their','am','s','t'}
        tokens = [word for word in tokens if word not in basic_stops and len(word) > 2]
    
    return ' '.join(tokens)

def extract_features(text):
    features = {}
    text_lower = text.lower()
    
    urgency_words = ['urgent','asap','immediately','critical','emergency',
                     'broken','down','not working','failed','error','bug']
    features['urgency_score'] = sum(1 for word in urgency_words if word in text_lower)
    features['word_count'] = len(text.split())
    features['char_count'] = len(text)
    features['question_count'] = text.count('?')
    features['exclamation_count'] = text.count('!')
    
    return features

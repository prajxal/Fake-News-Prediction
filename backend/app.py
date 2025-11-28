from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd
from train_model import main as train_main
import logging


app = Flask(__name__)
# Restrict CORS in production; allow all for development
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))

# Prefer root-level data directory, fallback to backend/data
DATA_DIR_CANDIDATES = [
    os.path.join(PROJECT_ROOT, 'data'),
    os.path.join(BASE_DIR, 'data'),
]

MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'fake_news_pipeline.pkl')

# Limits
MAX_TEXT_LENGTH = 10000
MAX_BATCH_SIZE = 100


def resolve_existing_path(filename):
    for directory in DATA_DIR_CANDIDATES:
        candidate = os.path.join(directory, filename)
        if os.path.exists(candidate):
            return candidate
    return None


def resolve_target_data_dir():
    for directory in DATA_DIR_CANDIDATES:
        if os.path.isdir(directory):
            return directory
    return DATA_DIR_CANDIDATES[0]


def path_in_data_dir(filename):
    return os.path.join(resolve_target_data_dir(), filename)


TRAIN_CSV = resolve_existing_path('train.csv') or path_in_data_dir('train.csv')
TRUE_CSV = resolve_existing_path('True.csv') or path_in_data_dir('True.csv')
FAKE_CSV = resolve_existing_path('Fake.csv') or path_in_data_dir('Fake.csv')


def ensure_directories():
    os.makedirs(resolve_target_data_dir(), exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)


def ensure_train_csv_exists():
    if os.path.exists(TRAIN_CSV):
        return
    if not (os.path.exists(TRUE_CSV) and os.path.exists(FAKE_CSV)):
        raise FileNotFoundError("Missing training data. Expected 'data/True.csv' and 'data/Fake.csv'.")
    df_true = pd.read_csv(TRUE_CSV)
    df_fake = pd.read_csv(FAKE_CSV)
    df_true['label'] = 0
    df_fake['label'] = 1

    def to_text(df):
        if 'title' in df.columns and 'text' in df.columns:
            return df['title'].fillna('') + ' ' + df['text'].fillna('')
        if 'text' in df.columns:
            return df['text'].fillna('')
        if 'title' in df.columns:
            return df['title'].fillna('')
        return df.astype(str).agg(' '.join, axis=1)

    df_true['text'] = to_text(df_true)
    df_fake['text'] = to_text(df_fake)
    df_true = df_true[['text', 'label']]
    df_fake = df_fake[['text', 'label']]
    df = pd.concat([df_true, df_fake], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv(TRAIN_CSV, index=False)


def load_or_train_pipeline():
    ensure_directories()
    if os.path.exists(MODEL_PATH):
        logger.info(f"Loading pipeline from {MODEL_PATH}")
        return joblib.load(MODEL_PATH)
    logger.info("Model not found. Ensuring training CSV exists and training model...")
    ensure_train_csv_exists()
    # Call user's training main; ensure it writes MODEL_PATH
    train_main()
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Expected model file at {MODEL_PATH} after training.")
    return joblib.load(MODEL_PATH)


# Lazy-loaded pipeline
pipeline = None


def get_pipeline():
    global pipeline
    if pipeline is None:
        pipeline = load_or_train_pipeline()
    return pipeline


# Simple validators and sanitizer
CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0B-\x0C\x0E-\x1F]")


def validate_text_input(text, field_name='text'):
    """Return (is_valid: bool, error_message: str|None)"""
    if text is None:
        return False, f"{field_name} cannot be null."
    if not isinstance(text, str):
        return False, f"{field_name} must be a string."
    if not text.strip():
        return False, f"{field_name} cannot be empty or whitespace only."
    if len(text) > MAX_TEXT_LENGTH:
        return False, f"{field_name} exceeds maximum length of {MAX_TEXT_LENGTH} characters."
    # Reject control chars that may break downstream
    if CONTROL_CHAR_RE.search(text):
        return False, f"{field_name} contains invalid control characters."
    return True, None


def sanitize_text(text):
    """Basic sanitizer: strip, collapse whitespace, remove dangerous control chars."""
    if not isinstance(text, str):
        return str(text)
    # Remove low control characters
    text = CONTROL_CHAR_RE.sub(' ', text)
    # Collapse whitespace
    text = re.sub(r"\s+", ' ', text).strip()
    return text


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict whether news text is fake or real.
    """
    # Check content type
    if not request.is_json:
        return jsonify({'error': "Content-Type must be application/json"}), 415

    data = request.get_json()

    # Validate request structure
    if not data:
        return jsonify({'error': "Request body cannot be empty."}), 400

    if 'text' not in data:
        return jsonify({'error': "Request JSON must include 'text' field."}), 400

    text = data['text']

    # Validate text input
    is_valid, error_message = validate_text_input(text)
    if not is_valid:
        return jsonify({'error': error_message}), 400

    # Sanitize text
    text = sanitize_text(text)

    try:
        model = get_pipeline()
        texts = [text]
        preds = model.predict(texts)
        probs = model.predict_proba(texts).tolist() if hasattr(model, 'predict_proba') else None

        label = int(preds[0])
        probabilities = probs[0] if probs else None

        # Calculate confidence as the maximum probability
        confidence = max(probabilities) if probabilities else None

        return jsonify({
            'label': label,
            'label_name': 'fake' if label == 1 else 'real',
            'probabilities': probabilities,
            'confidence': confidence
        }), 200

    except Exception as e:
        # Log the error (in production, use proper logging)
        logger.exception("Prediction error")
        return jsonify({'error': "Prediction failed. Please try again later."}), 500


@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Predict multiple news articles at once.
    """
    # Check content type
    if not request.is_json:
        return jsonify({'error': "Content-Type must be application/json"}), 415

    data = request.get_json()

    # Validate request structure
    if not data:
        return jsonify({'error': "Request body cannot be empty."}), 400

    if 'texts' not in data:
        return jsonify({'error': "Request JSON must include 'texts' field."}), 400

    texts = data['texts']

    # Validate texts is a list
    if not isinstance(texts, list):
        return jsonify({'error': "'texts' must be an array."}), 400

    # Validate list is not empty
    if len(texts) == 0:
        return jsonify({'error': "'texts' array cannot be empty."}), 400

    # Validate batch size
    if len(texts) > MAX_BATCH_SIZE:
        return jsonify({'error': f"Batch size exceeds maximum of {MAX_BATCH_SIZE}."}), 400

    # Validate and sanitize each text
    valid_texts = []
    validation_errors = []

    for idx, t in enumerate(texts):
        is_valid, error_message = validate_text_input(t, f"texts[{idx}]")
        if not is_valid:
            validation_errors.append({
                'index': idx,
                'error': error_message
            })
        else:
            valid_texts.append(sanitize_text(t))

    # If no valid texts, return errors
    if len(valid_texts) == 0:
        return jsonify({
            'error': "No valid texts to process.",
            'validation_errors': validation_errors
        }), 400

    try:
        model = get_pipeline()
        preds = model.predict(valid_texts)
        probs = model.predict_proba(valid_texts).tolist() if hasattr(model, 'predict_proba') else None

        predictions = []
        for i, pred in enumerate(preds):
            label = int(pred)
            probabilities = probs[i] if probs else None
            confidence = max(probabilities) if probabilities else None

            predictions.append({
                'label': label,
                'label_name': 'fake' if label == 1 else 'real',
                'probabilities': probabilities,
                'confidence': confidence
            })

        response = {
            'predictions': predictions,
            'total': len(predictions),
            'processed': len(valid_texts),
            'requested': len(texts)
        }

        # Include validation errors if any
        if validation_errors:
            response['validation_errors'] = validation_errors

        return jsonify(response), 200

    except Exception as e:
        logger.exception("Batch prediction error")
        return jsonify({'error': "Batch prediction failed. Please try again later."}), 500


if __name__ == '__main__':
    # Do not call load/ train at import time; lazy-loading will occur on first request
    app.run(host='0.0.0.0', port=5000, debug=True)

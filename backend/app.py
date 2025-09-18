from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd
from train_model import main as train_main


app = Flask(__name__)
CORS(app)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))

# Prefer root-level data directory, fallback to backend/data
DATA_DIR_CANDIDATES = [
    os.path.join(PROJECT_ROOT, 'data'),
    os.path.join(BASE_DIR, 'data'),
]

def resolve_existing_path(filename):
    for directory in DATA_DIR_CANDIDATES:
        candidate = os.path.join(directory, filename)
        if os.path.exists(candidate):
            return candidate
    return None

def resolve_target_data_dir():
    # Use the first candidate that exists or default to root data dir
    for directory in DATA_DIR_CANDIDATES:
        if os.path.isdir(directory):
            return directory
    return DATA_DIR_CANDIDATES[0]

MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'fake_news_pipeline.pkl')

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
        return joblib.load(MODEL_PATH)
    ensure_train_csv_exists()
    train_main()
    return joblib.load(MODEL_PATH)


pipeline = load_or_train_pipeline()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': "Request JSON must include 'text' field."}), 400
    texts = [data['text']]
    preds = pipeline.predict(texts)
    probs = pipeline.predict_proba(texts).tolist() if hasattr(pipeline, 'predict_proba') else None
    label = int(preds[0])
    return jsonify({
        'label': label,
        'label_name': 'fake' if label == 1 else 'real',
        'probabilities': probs[0] if probs else None
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
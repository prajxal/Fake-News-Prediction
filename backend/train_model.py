import os
import pandas as pd
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score


# Paths and resolution helpers
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))

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

def default_model_path():
    models_dir = os.path.join(BASE_DIR, 'models')
    os.makedirs(models_dir, exist_ok=True)
    return os.path.join(models_dir, 'fake_news_pipeline.pkl')




def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text




def main():
    # Determine dataset and model paths
    train_csv_path = os.getenv('TRAIN_CSV_PATH') or resolve_existing_path('train.csv') or os.path.join(PROJECT_ROOT, 'data', 'train.csv')
    model_out_path = os.getenv('MODEL_PATH') or default_model_path()

    # Load dataset. Expect columns: 'text', 'label' (0 = real, 1 = fake)
    df = pd.read_csv(train_csv_path)
    df = df.dropna(subset=['text', 'label'])
    df['text'] = df['text'].astype(str).map(clean_text)


    X = df['text']
    y = df['label'].astype(int)


    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)


    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=20000, ngram_range=(1,2), stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000, class_weight='balanced', solver='saga'))
    ])


    pipeline.fit(X_train, y_train)


    preds = pipeline.predict(X_test)
    print('Accuracy:', accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))


    # Save the whole pipeline
    joblib.dump(pipeline, model_out_path)
    print(f'Saved {model_out_path}')




if __name__ == '__main__':
    main()
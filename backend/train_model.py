import pandas as pd
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score




def clean_text(text):
text = text.lower()
text = re.sub(r"[^a-z0-9\s]", " ", text)
text = re.sub(r"\s+", " ", text).strip()
return text




def main():
# Replace 'data/train.csv' with your dataset path. Expect columns: 'text', 'label'
# label: 0 = real, 1 = fake (or adapt accordingly)
df = pd.read_csv('data/train.csv')
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
joblib.dump(pipeline, 'models/fake_news_pipeline.pkl')
print('Saved models/fake_news_pipeline.pkl')




if __name__ == '__main__':
main()
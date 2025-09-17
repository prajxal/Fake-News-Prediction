from flask import Flask, request, jsonify
import joblib


app = Flask(__name__)


# Load pipeline trained earlier
pipeline = joblib.load('models/fake_news_pipeline.pkl')


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
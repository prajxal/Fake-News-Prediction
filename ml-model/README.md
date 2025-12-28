# ML Model Directory

This directory should contain your pre-trained fake news detection model.

## Supported Formats

1. **HuggingFace Model**: Place your model files here
2. **sklearn Pickle**: Save your model as `fake_news_model.pkl`
3. **TensorFlow/PyTorch**: Place model files here

## Current Implementation

The backend uses a heuristic-based approach for demonstration purposes. To integrate a real ML model:

1. Update `backend/src/utils/mlService.js`
2. Install required ML libraries (e.g., `tensorflow`, `scikit-learn`, `@huggingface/inference`)
3. Load and use your model in the `detectFakeNews` function

## Example Integration (sklearn pickle)

```javascript
const fs = require('fs');
const pickle = require('pickle'); // or use python-shell to call Python

const loadModel = () => {
  const modelData = fs.readFileSync('./ml-model/fake_news_model.pkl');
  return pickle.loads(modelData);
};

const detectFakeNews = async (title, content) => {
  const model = loadModel();
  const features = extractFeatures(title, content);
  const prediction = model.predict_proba([features])[0];
  return {
    fake_probability: prediction[1],
    confidence_score: Math.abs(prediction[0] - prediction[1])
  };
};
```

## Example Integration (HuggingFace)

```javascript
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_TOKEN);

const detectFakeNews = async (title, content) => {
  const result = await hf.textClassification({
    model: 'your-model-name',
    inputs: `${title} ${content}`
  });
  
  return {
    fake_probability: result[0].score,
    confidence_score: result[0].score
  };
};
```


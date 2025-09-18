from app import predict_fake_news

def test_prediction():
    text = "Breaking news: the world is flat!"
    result = predict_fake_news(text)
    assert result in [0, 1]  # 0 = real, 1 = fake

from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import numpy as np

# Initialize FastAPI app
app = FastAPI()

# Load the trained model and tokenizer
model = tf.keras.models.load_model("sentiment_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# Define input data model using Pydantic
class Review(BaseModel):
    text: str

# Define prediction endpoint
@app.post("/predict")
def predict_sentiment(review: Review):
    # Tokenize and pad the input review
    sequence = tokenizer.texts_to_sequences([review.text])
    padded_sequence = pad_sequences(sequence, maxlen=200)
    
    # Make prediction
    prediction = model.predict(padded_sequence)
    sentiment = "positive" if prediction[0][0] > 0.5 else "negative"
    
    return {"sentiment": sentiment}

# Run the app (for local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
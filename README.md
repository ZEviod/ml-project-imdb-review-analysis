# IMDB Reviews Sentiment Analysis

## Table of Contents

- [IMDB Reviews Sentiment Analysis](#imdb-reviews-sentiment-analysis)
- [Project Structure](#project-structure)
- [Features](#features)
- [Live Backend Endpoint](#live-backend-endpoint)
- [Machine Learning](#machine-learning)
- [Tech Stack](#tech-stack)
- [React Native UI](#react-native-ui)
- [FastAPI Backend](#fastapi-backend)
- [How to Run Locally](#how-to-run-locally)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Downloadable APK](#downloadable-apk)
- [Sample API Request](#sample-api-request)
- [Media](#media)
  - [Images](#images)
  - [Video](#video)
- [Future Improvements](#future-improvements)
- [Authors](#authors)

This repository contains a complete pipeline for sentiment analysis of IMDB reviews using an LSTM model. The project includes the model, API, frontend application, and a video demonstration.

## Project Structure

- **Model**: The LSTM model for sentiment analysis is implemented in the Jupyter Notebook [`IMDB_reviews_Sentiment_Analysis_LSTM.ipynb`](Model/IMDB_reviews_Sentiment_Analysis_LSTM.ipynb).
- **API Backend**: The backend API is built using FastAPI and deployed on Render. It includes the following files:
  - [`main.py`](APP_Backend/fast_api-main/fast_api-main/main.py): The main API logic.
  - [`sentiment_model.h5`](APP_Backend/fast_api-main/fast_api-main/sentiment_model.h5): The trained LSTM model.
  - [`tokenizer.pkl`](APP_Backend/fast_api-main/fast_api-main/tokenizer.pkl): Tokenizer for preprocessing text.
  - [`render.yaml`](APP_Backend/fast_api-main/fast_api-main/render.yaml): Configuration for deployment on Render.
- **Frontend Application**: A React Native-based frontend application for interacting with the sentiment analysis API. Key files include:
  - [`MainLayout.tsx`](APP_Frontend/components/MainLayout.tsx), [`SentimentBadge.tsx`](APP_Frontend/components/SentimentBadge.tsx), [`SentimentIndicator.tsx`](APP_Frontend/components/SentimentIndicator.tsx): Core components.
  - [`sentimentAnalysis.ts`](APP_Frontend/utils/sentimentAnalysis.ts): Utility functions for API interaction.
- **Video**: A demonstration video showcasing the project.

## Features

- Sentiment analysis of IMDB reviews using an LSTM model.
- Backend API built with FastAPI and deployed on Render.
- Frontend application for user interaction.
- Video demonstration.

## Live Backend Endpoint

The backend API is live and accessible at: [Live API Endpoint](https://sentiment-prediction-api.onrender.com/predict) -> https://sentiment-prediction-api.onrender.com/predict.

## Machine Learning

- **LSTM**: The Long Short-Term Memory (LSTM) model is used for sentiment analysis of IMDB reviews.

## Tech Stack

- **React Native**: For building the frontend UI.
- **FastAPI**: For the backend API.
- **Render**: For API deployment.
- **Python**: For machine learning model development.

## React Native UI

The frontend application is built using React Native, providing a seamless user experience for interacting with the sentiment analysis API.

## FastAPI Backend

The backend API is built using FastAPI, a modern web framework for building APIs with Python.

## How to Run Locally

### Backend

1. Navigate to the backend directory:
   ```bash
   cd APP_Backend/fast_api-main/fast_api-main
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd APP_Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npx expo start
   ```

## Downloadable APK

The APK for the React Native frontend application can be downloaded from the following link:

[Download APK](https://expo.dev/accounts/jay-shah/projects/ml-expo-nativewind/builds/7def31c5-291a-4485-b50e-9af5cecc28ad)

## Sample API Request

To test the API, you can send a POST request to the `/predict` endpoint with the following JSON payload:

```json
{
  "review": "The movie was fantastic!"
}
```

The API will return a sentiment prediction, such as:

```json
{
  "sentiment": "positive"
}
```

## Media

### Images

- **Accuracy**:
  
  ![Accuracy](Images/accuracy.png)
- **Confusion Matrix**:
  
  ![Confusion Matrix](Images/confusion_matrix.png)
- **Example Usage**:
  
  ![Example Usage](Images/example_usage.png)

### Video

A detailed video explanation of the project can be viewed here:

[Watch Video](video/video_explanation.mp4)

## Future Improvements

- Add support for additional languages.
- Improve the accuracy of the sentiment analysis model.
- Add a web-based frontend for broader accessibility.
- Include a detailed video demonstration.

## Authors

> Built by [Vivek Poonia, Swetaly Das, Ravita]  
> Contact: [vivekpoonia.wx@gmail.com]  
> NIT Surat | Electronics & Communication Engineering

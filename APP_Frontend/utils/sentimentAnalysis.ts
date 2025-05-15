export async function analyzeSentiment(text: string): Promise<{
  sentiment: string;
}> {
  try {
    const response = await fetch(
      'https://sentiment-prediction-api.onrender.com/predict',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Assuming the API response contains a `sentiment` field
    return {
      sentiment: data.sentiment,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);

    // Return a default neutral response in case of an error
    return {
      sentiment: 'neutral',
    };
  }
}

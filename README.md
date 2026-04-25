# Sentiment Analysis API & Web App

A lightweight, fast, and easy-to-use Sentiment Analysis web application and REST API built with Python, Flask, and TextBlob. It analyzes text in real-time to determine polarity, subjectivity, and sentiment classification.

## Features

*   **Web Interface & REST API**: Interact with the tool via a clean UI or programmatically via the `/analyze` endpoint.
*   **Accurate Analysis**: Powered by TextBlob to calculate polarity (-1.0 to 1.0) and subjectivity (0.0 to 1.0).
*   **Rich Responses**: Classifies text as POSITIVE 😊, NEGATIVE 😞, or NEUTRAL 😐 and extracts character/word counts and processing times.
*   **CORS Enabled**: Ready to be consumed by other frontend applications.
*   **Built-in Documentation**: Includes `/docs`, `/api`, and `/about` pages directly in the app.

## Technologies Used

*   **Backend**: Python, Flask, Flask-CORS
*   **NLP Processing**: TextBlob
*   **Frontend**: HTML, CSS, JavaScript

## Setup & Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone https://github.com/yourusername/sentiment-analysis-app.git
    cd sentiment-analysis-app
    ```

2.  **Install the required dependencies**:
    You will need `Flask`, `flask-cors`, and `textblob`. You can install them via pip:
    ```bash
    pip install Flask flask-cors textblob
    ```

3.  **Run the application**:
    ```bash
    python app.py
    ```
    The application will start on `http://0.0.0.0:5000/`.

## API Reference

### Analyze Text

**Endpoint:** `/analyze`
**Method:** `POST`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "text": "Flask makes building web apps incredibly fun and easy!"
}
```

**Success Response (200 OK):**
```json
{
  "char_count": 54,
  "color_class": "positive",
  "emoji": "😊",
  "polarity": 0.4583,
  "processing_time_ms": 1.2,
  "sentiment": "POSITIVE",
  "subjectivity": 0.5167,
  "word_count": 9
}
```

**Error Responses:**
*   `400 Bad Request` if no text is provided: `{"error": "No text provided"}`
*   `400 Bad Request` if text exceeds 5000 characters: `{"error": "Text too long. Maximum 5000 characters."}`

## File Structure

```text
sentiment_app/
│
├── app.py               # Main Flask application and API logic
├── static/
│   ├── css/style.css    # Styles for the web UI
│   └── js/script.js     # Frontend logic for calling the API
├── templates/
│   ├── index.html       # Main Web Interface
│   ├── about.html       # About Page
│   ├── docs.html        # Documentation Page
│   └── api.html         # API Reference Page
└── README.md            # Project documentation
```

## License

This project is open-source and available under the [MIT License](LICENSE).

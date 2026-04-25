from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import time

app = Flask(__name__)
CORS(app)


def analyze_sentiment(text):
    """Perform sentiment analysis using TextBlob."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity        # Range: -1.0 to 1.0
    subjectivity = blob.sentiment.subjectivity  # Range: 0.0 to 1.0

    # Classify sentiment
    if polarity > 0.1:
        sentiment = "POSITIVE"
        emoji = "😊"
        color_class = "positive"
    elif polarity < -0.1:
        sentiment = "NEGATIVE"
        emoji = "😞"
        color_class = "negative"
    else:
        sentiment = "NEUTRAL"
        emoji = "😐"
        color_class = "neutral"

    return {
        "sentiment": sentiment,
        "polarity": round(polarity, 4),
        "subjectivity": round(subjectivity, 4),
        "emoji": emoji,
        "color_class": color_class,
        "word_count": len(text.split()),
        "char_count": len(text),
    }


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/docs")
def docs():
    return render_template("docs.html")

@app.route("/api")
def api():
    return render_template("api.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if len(text) > 5000:
        return jsonify({"error": "Text too long. Maximum 5000 characters."}), 400

    start = time.time()
    result = analyze_sentiment(text)
    elapsed_ms = round((time.time() - start) * 1000, 1)
    result["processing_time_ms"] = elapsed_ms

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

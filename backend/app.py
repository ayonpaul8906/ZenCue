# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.route("/explain", methods=["POST"])
def explain():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant who simplifies and explains complex text for neurodivergent users."
            },
            {
                "role": "user",
                "content": f"Please explain this text simply: {text}"
            }
        ]
    }

    try:
        res = requests.post(GROQ_API_URL, headers=headers, json=payload)
        print("Groq Raw Response:", res.text)  # ✅ Add this
        res.raise_for_status()
        result = res.json()
        explanation = result['choices'][0]['message']['content']
        return jsonify({"explanation": explanation})
    except requests.exceptions.HTTPError as http_err:
        print("Groq API returned error:", res.status_code, res.text)  # ✅ Full response info
        return jsonify({"error": f"Groq API error: {res.status_code} {res.text}"}), 500
    except Exception as e:
        print("Unexpected error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

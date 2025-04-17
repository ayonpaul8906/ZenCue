from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

groq_client = Groq(api_key=GROQ_API_KEY)


@app.route("/explain", methods=["POST"])
def explain():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant who simplifies and explains complex text for neurodivergent users.",
            },
            {"role": "user", "content": f"Please explain this text simply: {text}"},
        ],
    }

    try:
        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        result = res.json()
        explanation = result["choices"][0]["message"]["content"]
        return jsonify({"explanation": explanation})
    except Exception as e:
        print("❌ Error in /explain:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/explain-image", methods=["POST"])
def explain_image():
    data = request.json
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    print(f"🔗 Received image URL: {image_url}")

    try:
        test_img = requests.get(image_url)
        test_img.raise_for_status()
        if not test_img.headers["Content-Type"].startswith("image/"):
            return jsonify({"error": "URL does not point to an image"}), 400
    except Exception as img_err:
        print("🚫 Image fetch error:", img_err)
        return jsonify({"error": f"Unable to fetch image from URL: {str(img_err)}"}), 400

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Please extract and explain any visible text in this image for a neurodivergent user.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url},
                    },
                ],
            }
        ],
    }

    try:
        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        result = res.json()
        explanation = result["choices"][0]["message"]["content"]
        return jsonify({"explanation": explanation})
    except Exception as e:
        print("🔥 Error in /explain-image:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/speak", methods=["POST"])
def speak():
    data = request.json
    text = data.get("text", "")
    print("🗣️ Received text for TTS:", repr(text))


    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        speech_path = "speech.wav"
        payload = {
            "model": "playai-tts",  # GROQ supports PlayAI for TTS
            "input": text,
            "voice": "Fritz-PlayAI",  # Or try "Nova-PlayAI" or "Shimmer-PlayAI"
            "response_format": "wav"
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/audio/speech",
            headers=HEADERS,
            json=payload,
            stream=True  # Important for streaming audio
        )

        if response.status_code != 200:
            raise Exception(response.text)

        # Write the streamed audio to file
        with open(speech_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        return send_file(speech_path, mimetype="audio/wav", as_attachment=False)

    except Exception as e:
        import traceback
        print("🎙️ Error in /speak:", e)
        traceback.print_exc()

        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)

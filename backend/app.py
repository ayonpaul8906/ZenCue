from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import speech_recognition as sr


load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) 

# Config
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

# Upload folder setup
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Helper
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ✅ 1. Simplify Complex Text
@app.route("/explain", methods=["POST"])
def explain():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {"role": "system", "content": "You are an assistant who simplifies and explains complex text for neurodivergent users."},
            {"role": "user", "content": f"Please explain this text simply: {text}"},
        ],
    }

    try:
        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        explanation = res.json()["choices"][0]["message"]["content"]
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ 2. Explain Image Text
@app.route("/explain-image", methods=["POST"])
def explain_image():
    image_url = request.json.get("image_url")
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:
        img = requests.get(image_url)
        img.raise_for_status()
        if not img.headers["Content-Type"].startswith("image/"):
            return jsonify({"error": "Invalid image URL"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Please extract and explain any visible text in this image for a neurodivergent user."},
                {"type": "image_url", "image_url": {"url": image_url}},
            ],
        }]
    }

    try:
        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        explanation = res.json()["choices"][0]["message"]["content"]
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ 3. General Chat from Text
@app.route("/chat/text", methods=["POST"])
def chat_text():
    try:
        data = request.json
        text = data.get("text", "")
        history = data.get("history", [])
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        print("Received history:", history)  # Debug print

        # Convert history to the format expected by the model
        formatted_history = []
        for msg in history:
            role = "assistant" if msg["sender"] == "bot" else "user"
            formatted_history.append({"role": role, "content": msg["text"]})

        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant who maintains context of the conversation."},
                *formatted_history,
                {"role": "user", "content": text}  # Add current message
            ],
        }

        print("Sending payload:", payload)  # Debug print

        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        reply = res.json()["choices"][0]["message"]["content"]
        
        print("Received reply:", reply)  # Debug print
        
        return jsonify({"response": reply})
    except Exception as e:
        print("Error in /chat/text:", e)
        return jsonify({"error": str(e)}), 500


# ✅ 4. General Chat from Audio
@app.route("/chat/audio", methods=["POST"])
def chat_audio():
    if "audio" not in request.files:
        return jsonify({"error": "Audio file is required"}), 400

    audio_file = request.files["audio"]
    if not allowed_file(audio_file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], audio_file.filename)
    audio_file.save(filepath)

    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(filepath) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)

        os.remove(filepath)

        # Use chat endpoint to respond
        return chat_text()

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ 5. Speak Text (TTS) — Used by both `/speak` and `/chat/speak`
@app.route("/speak", methods=["POST"])
@app.route("/chat/speak", methods=["POST"])
def speak():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        print("🔈 TTS Request Received:", text)

        speech_path = "speech.wav"
        payload = {
            "model": "playai-tts",
            "input": text,
            "voice": "Fritz-PlayAI",
            "response_format": "wav",
        }

        res = requests.post(
            "https://api.groq.com/openai/v1/audio/speech",
            headers=HEADERS,
            json=payload,
            stream=True,
        )

        print("🔁 TTS API Response Status:", res.status_code)
        if res.status_code != 200:
            print("❌ Response Error Text:", res.text)
            raise Exception(res.text)

        with open(speech_path, "wb") as f:
            for chunk in res.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print("✅ Audio saved. Sending back audio...")
        return send_file(speech_path, mimetype="audio/wav", as_attachment=False)

    except Exception as e:
        import traceback
        print("🔥 Exception in /speak route:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

        with open(speech_path, "wb") as f:
            for chunk in res.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print("✅ Audio saved. Sending back audio...")
        return send_file(speech_path, mimetype="audio/wav", as_attachment=False)

    except Exception as e:
        print("🔥 Exception in /speak route:", e)
        return jsonify({"success": False}), 200 



if __name__ == "__main__":
    app.run(debug=True, port=5000)

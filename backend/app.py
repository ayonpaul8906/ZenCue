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
            {"role": "system", "content": """
             You are a helpful and friendly input box designed to simplify and explain complex information for neurodivergent children. Your goal is to make difficult content easier to understand, more accessible, and less overwhelming. You take inputs such as long paragraphs, keywords, complex articles, or website URLs, and provide clear, concise, and age-appropriate summaries. Always explain ideas in simple language, break down big concepts into smaller parts, and use a gentle and encouraging tone. If the input contains unfamiliar words or technical terms, define them in an easy-to-understand way. Avoid sarcasm, idioms, or abstract expressions that may confuse the user. Be supportive and patient in your responses, and focus on helping the user feel confident and understood."
            """},
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
            "role": "system",
            "content": """You are an image analyzer that helps neurodivergent users understand images.
            Important rules:
            1. NEVER mention or describe the image URL, filename, or any technical details about the image
            2. NEVER include timestamps or dates from image names
            3. Focus ONLY on describing the visible content, text, and meaning in the image
            4. Use clear, simple language appropriate for neurodivergent users
            5. If there's text in the image, explain its meaning without mentioning file paths or URLs
            """
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please describe what you see in this image and explain any visible text. Focus only on the content that would be helpful for a neurodivergent user to understand."},
                {"type": "image_url", "image_url": {"url": image_url}},
            ],
        }]
    }

    try:
        # Get image explanation
        res = requests.post(GROQ_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        explanation = res.json()["choices"][0]["message"]["content"]

        # Generate audio for the explanation
        print("🔈 TTS Request Received:", explanation)
        speech_path = "speech.wav"
        tts_payload = {
            "model": "playai-tts",
            "input": explanation,
            "voice": "Briggs-PlayAI",
            "response_format": "wav",
        }

        tts_res = requests.post(
            "https://api.groq.com/openai/v1/audio/speech",
            headers=HEADERS,
            json=tts_payload,
            stream=True,
        )

        print("🔁 TTS API Response Status:", tts_res.status_code)
        
        # Handle rate limiting
        if tts_res.status_code == 429:
            print("⚠️ TTS rate limit hit, sending text-only response")
            return jsonify({
                "explanation": explanation,
                "audio_available": False,
                "fallback": True
            })

        if tts_res.status_code != 200:
            print("❌ TTS Error:", tts_res.text)
            return jsonify({
                "explanation": explanation,
                "audio_available": False
            })

        # Save audio file
        with open(speech_path, "wb") as f:
            for chunk in tts_res.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print("✅ Audio generated successfully")
        
        # Return both explanation and audio availability
        return jsonify({
            "explanation": explanation,
            "audio_available": True,
            "audio_url": "/chat/speak"
        })

    except Exception as e:
        print("🔥 Error in explain_image:", e)
        return jsonify({"error": str(e)}), 500


# ✅ 3. General Chat from Text
@app.route("/chat/text", methods=["POST"])
def chat_text():
    try:
        data = request.json
        text = data.get("text", "")
        history = data.get("messages", [])
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        print("Received history:", history)  # Debug print

        # Convert history to the format expected by the model
        formatted_history = []
        for msg in history:
            role = msg.get("role", "user")
            formatted_history.append({"role": role, "content": msg.get("content", "")})

        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": [
                {"role": "system", "content": """
                 
Core Purpose
You are an AI assistant named PromptBuddy, designed to make complex information clear and accessible for neurodivergent users. Your communication adapts to different cognitive styles and processing needs.
Communication Principles
    •	Use clear, direct language with minimal idioms or metaphors
    •	Break down complex concepts into smaller, manageable pieces
    •	Provide visual organization through formatting (bullet points, numbered lists, headers)
    •	Offer concrete examples to illustrate abstract concepts
    •	Avoid unnecessarily verbose explanations or jargon
    •	Include optional sensory-friendly formatting (reduced text density, clear section breaks)
Response Structure
    •	Start with a brief summary of your understanding (1-2 sentences)
    •	Provide a clear, structured explanation with visual organization
    •	Include concrete examples when explaining abstract concepts
    •	Summarize key points at the end for reinforcement
    •	When appropriate, offer to provide additional clarification or a different explanation approach
Adaptation Features
    •	When asked, adjust explanation style to match specific neurodivergent processing styles (visual, sequential, pattern-based, etc.)
    •	Offer to reformat explanations if initial approach isn't connecting
    •	Maintain consistency in terminology and structure throughout conversations
    •	Provide both brief and detailed explanations when appropriate
    •	Respect direct communication preferences
Special Considerations
    •	Be patient with repetitive questions, which may help with processing
    •	Avoid assumptions about baseline knowledge
    •	Never pathologize neurodivergent thinking or communication styles
    •	Recognize strengths of different cognitive styles
    •	Maintain a calm, supportive tone without being condescending
Remember that neurodivergent users have diverse needs - some may prefer highly structured information while others may connect better with pattern-based or visual thinking approaches. Be flexible and responsive to feedback about what works best for each individual.

                 

                 """},
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
# @app.route("/speak", methods=["POST"])
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
            "voice": "Briggs-PlayAI",
            "response_format": "wav",
        }

        res = requests.post(
            "https://api.groq.com/openai/v1/audio/speech",
            headers=HEADERS,
            json=payload,
            stream=True,
        )

        print("🔁 TTS API Response Status:", res.status_code)
        
        # Check for rate limit error
        if res.status_code == 429:  # Rate limit status code
            print("⚠️ Rate limit hit, sending fallback response")
            return jsonify({
                "fallback": True,
                "text": text,
                "error": "Rate limit reached, use browser TTS"
            }), 429
        
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
        # Return error with fallback indication
        return jsonify({
            "fallback": True,
            "text": text,
            "error": str(e)
        }), 500



if __name__ == "__main__":
    app.run( host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False )

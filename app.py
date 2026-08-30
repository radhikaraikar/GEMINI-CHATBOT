import os

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

SYSTEM_INSTRUCTIONS = """
You are a helpful, friendly and professional AI assistant.

Give clear, accurate and useful answers.
Keep answers easy to understand.
Use markdown when it improves readability.
If you are unsure about something, say so instead of making up information.
"""


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():

    if not GEMINI_API_KEY:
        return jsonify({
            "error": "GEMINI_API_KEY is missing. Check your .env file."
        }), 500

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Invalid request."
        }), 400

    messages = data.get("messages", [])

    if not isinstance(messages, list) or not messages:
        return jsonify({
            "error": "No messages were provided."
        }), 400

    conversation = []

    for message in messages[-20:]:

        if not isinstance(message, dict):
            continue

        role = message.get("role")
        content = message.get("content")

        if role not in ("user", "assistant"):
            continue

        if not isinstance(content, str):
            continue

        content = content.strip()

        if not content:
            continue

        if role == "user":
            conversation.append(f"User: {content[:8000]}")
        else:
            conversation.append(f"Assistant: {content[:8000]}")

    if not conversation:
        return jsonify({
            "error": "No valid messages were provided."
        }), 400

    prompt = f"""
{SYSTEM_INSTRUCTIONS}

Conversation:

{chr(10).join(conversation)}

Assistant:
"""

    try:

        response = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt
        )

        reply = response.output_text

        if not reply:
            return jsonify({
                "error": "Gemini returned an empty response."
            }), 500

        return jsonify({
            "reply": reply
        })

    except Exception as exc:

        app.logger.exception("Gemini API request failed")

        return jsonify({
            "error": str(exc)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
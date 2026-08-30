# AI Chatbot

A modern, responsive AI chatbot built with **Python Flask**, **OpenAI's API**, **HTML**, **CSS**, and **Vanilla JavaScript**.

This is a real API-powered application, not a static chatbot demo.

## Features

- Modern responsive chatbot interface
- Real AI responses through the OpenAI API
- Secure API key stored in `.env`
- Browser-based chat history using `localStorage`
- Typing/loading indicator
- Send messages with Enter
- Shift + Enter for a new line
- Clear chat history
- Error handling
- Mobile-friendly layout
- Clean Flask project structure
- Beginner-friendly code
- Portfolio-ready UI

## Project Structure

```text
ai-chatbot/
├── app.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

> Important: `app.py` must be in the project root, NOT inside `templates/`.

## Requirements

- Python 3.10+
- An OpenAI API key
- Internet connection

## 1. Create a virtual environment

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

## 3. Add your API key

Open `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Replace the placeholder with your actual API key.

**Never commit your real API key to GitHub.** The `.gitignore` file already excludes `.env`.

## 4. Run the application

```bash
python app.py
```

You should see Flask start locally.

Open:

```text
http://127.0.0.1:5000
```

## How it works

1. The browser stores the conversation in `localStorage`.
2. When you send a message, JavaScript sends the conversation to `/api/chat`.
3. Flask validates the messages.
4. Flask calls the OpenAI Responses API using the server-side API key.
5. The AI response is returned as JSON.
6. JavaScript displays the response in the chat.

The API key is never placed in the frontend JavaScript.

## GitHub Upload

### 1. Initialize Git

From the project folder:

```bash
git init
```

### 2. Check your files

```bash
git status
```

Make sure `.env` is NOT listed as a file to commit.

### 3. Add files

```bash
git add .
```

### 4. Create the first commit

```bash
git commit -m "Initial AI chatbot"
```

### 5. Create a repository on GitHub

Create a new empty repository named:

```text
ai-chatbot
```

Do not upload your `.env` file.

### 6. Connect your local project

Replace the URL with your own GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-chatbot.git
```

### 7. Push

```bash
git branch -M main
git push -u origin main
```

## GitHub Security

Your `.env` contains a secret API key and is intentionally ignored by Git.

If you accidentally commit an API key:

1. Revoke/rotate that key immediately.
2. Generate a new key.
3. Remove the secret from Git history if necessary.
4. Never paste API keys into frontend JavaScript.

## Customization

### Change the AI model

Edit `.env`:

```env
OPENAI_MODEL=gpt-5.4-mini
```

The application reads the model from the environment, so you can change it without modifying the Python code.

### Change the UI

Edit:

```text
static/css/style.css
```

### Change chatbot behavior

Edit the `SYSTEM_INSTRUCTIONS` value in:

```text
app.py
```

### Change frontend behavior

Edit:

```text
static/js/script.js
```

## Troubleshooting

### `ModuleNotFoundError`

Activate the virtual environment and run:

```bash
pip install -r requirements.txt
```

### API key error

Check that `.env` exists in the same folder as `app.py`:

```text
ai-chatbot/
├── app.py
└── .env
```

Also check that the variable is exactly:

```env
OPENAI_API_KEY=your_key_here
```

### `python` is not recognized

Try:

```bash
py --version
```

If that works, run:

```bash
py -m venv venv
venv\Scripts\activate
py app.py
```

## License

This project is provided for learning, portfolio, and personal development purposes.

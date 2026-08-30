const STORAGE_KEY = "ai-chatbot-history";

const chatMessages = document.getElementById("chatMessages");
const welcomeMessage = document.getElementById("welcomeMessage");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const typingIndicator = document.getElementById("typingIndicator");

let messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let isSending = false;

function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function renderMessage(role, content, isError = false) {
    const row = document.createElement("div");
    row.className = `message-row ${role}`;

    const bubble = document.createElement("div");
    bubble.className = `message ${role}${isError ? " error" : ""}`;
    bubble.innerHTML = escapeHtml(content);

    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderHistory() {
    chatMessages.innerHTML = "";

    if (!messages.length) {
        chatMessages.appendChild(welcomeMessage);
        return;
    }

    messages.forEach(message => {
        renderMessage(message.role, message.content);
    });
}

function setLoading(loading) {
    isSending = loading;
    typingIndicator.classList.toggle("hidden", !loading);
    sendBtn.disabled = loading;
    messageInput.disabled = loading;

    if (loading) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function sendMessage(content) {
    const text = content.trim();

    if (!text || isSending) return;

    if (!messages.length) {
        chatMessages.innerHTML = "";
    }

    messages.push({ role: "user", content: text });
    renderMessage("user", text);
    saveHistory();

    messageInput.value = "";
    autoResize();
    setLoading(true);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        const reply = data.reply || "I couldn't generate a response.";

        messages.push({ role: "assistant", content: reply });
        renderMessage("assistant", reply);
        saveHistory();

    } catch (error) {
        renderMessage(
            "assistant",
            `Sorry, I couldn't process that request.\n\n${error.message}`,
            true
        );
    } finally {
        setLoading(false);
        messageInput.focus();
    }
}

function autoResize() {
    messageInput.style.height = "auto";
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 150)}px`;
}

chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(messageInput.value);
});

messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

messageInput.addEventListener("input", autoResize);

clearChatBtn.addEventListener("click", () => {
    if (!messages.length) return;

    if (confirm("Clear your chat history?")) {
        messages = [];
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
        messageInput.focus();
    }
});

document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
        sendMessage(button.textContent);
    });
});

renderHistory();
messageInput.focus();

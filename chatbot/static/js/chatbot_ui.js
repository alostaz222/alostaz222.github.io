// File: chatbot/static/js/chatbot_ui.js

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output");

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const question = chatInput.value.trim();
        if (!question) return;

        // Add user question to chat output
        chatOutput.innerHTML += `<div class="user-message">${question}</div>`;
        chatInput.value = "";

        // Send question to chatbot API
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();
        chatOutput.innerHTML += `<div class="bot-message">${data.answer}</div>`;
    });
});

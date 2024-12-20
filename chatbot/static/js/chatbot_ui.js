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

        // Add a "bot is typing" message
        chatOutput.innerHTML += `<div class="bot-message typing">...</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // Send question to chatbot API
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();
        // Remove typing and display the actual answer
        document.querySelector(".typing").remove();
        chatOutput.innerHTML += `<div class="bot-message">${data.answer}</div>`;
    });
});

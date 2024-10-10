const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
// API configuration
const API_KEY = "PASTE-YOUR-API-KEY"; // Your API key here
const API_URL = `https:erateContent?key=${API_KEY}`;

// Predefined responses for common questions
const predefinedResponses = {
  "hello": "Hey Adil! How can I assist you today?",
"how are you": "I'm just a digital assistant, but I appreciate you asking!",
"what is AI": "AI, or Artificial Intelligence, is the simulation of human-like intelligence in machines.",
"who created you": "I was built by a team of engineers and developers at OpenAI.",
"tell me a joke": "Why do programmers avoid nature? Too many bugs!",
"what's the weather like": "I can't check the weather at the moment, but a weather app should have you covered!",
"what is your name": "I'm your virtual assistant, here to help with any questions you have.",
"can you help me": "Absolutely! Let me know what you need assistance with, and I'll do my best.",
"goodbye": "Take care, Adil! Feel free to chat with me anytime.",
"thank you": "You're very welcome! I'm always here to help.",
"what can you do": "I can help with answering questions, solving general queries, or just having a chat!",
"who is your creator": "I was developed by a talented team of engineers and researchers at OpenAI.",
"what's your purpose": "My purpose is to assist you with your inquiries and engage in meaningful conversations.",
"can you learn": "I don't learn from individual interactions, but I improve continuously through updates!",
"what is your favorite color": "I don’t have personal favorites, but blue is often considered a calming color!"
}
const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");
  
  // Check if the user's message has a predefined response
  if (predefinedResponses[userMessage.toLowerCase()]) {
    messageElement.textContent = predefinedResponses[userMessage.toLowerCase()];
  } else {
    // Define the properties and message for the API request
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          role: "user", 
          parts: [{ text: userMessage }] 
        }] 
      }),
    }

    // Send POST request to API, get response and set the response as paragraph text
    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);
      
      // Get the API response text and update the message element
      messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    } catch (error) {
      // Handle error
      messageElement.classList.add("error");
      messageElement.textContent = error.message;
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  }
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;
  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);
  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window 
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

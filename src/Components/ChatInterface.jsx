import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: inputMessage,
      sender: "user"
    }]);
    
    // Clear input
    setInputMessage("");
    
    // Simulate bot response (you would replace this with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: "Thanks for your message! This is a sample response.",
        sender: "bot"
      }]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-500 to-blue-700 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-semibold">Chat Assistant</h1>
          <p className="text-sm text-blue-100">Online • Ready to help</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${message.sender === "user" ? "bg-blue-600" : "bg-gray-200"}`}>
                {message.sender === "user" ? 
                  <User className="w-5 h-5 text-white" /> : 
                  <Bot className="w-5 h-5 text-gray-600" />
                }
              </div>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
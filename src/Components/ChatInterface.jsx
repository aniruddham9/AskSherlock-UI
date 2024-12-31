// ChatInterface.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { X } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello, I am Sherlock. How can I help you today?",
      sender: "bot",
      feedback: null
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, messageId: null, type: null });
  const [feedbackText, setFeedbackText] = useState("");

  const handleSubmit = async (e, inputMessage) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      feedback: null
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user: inputMessage 
        }),
      });
      
      const data = await response.json();
      console.log("Response : " , data);
      
      // Extract and clean the message content
      let botMessageContent;
      if (data.ai) {
        botMessageContent = data.ai;
      } else if (data.response) {
        botMessageContent = data.response;
      } else if (data.assistant) {
        botMessageContent = data.assistant;
      } else if (typeof data === 'string') {
        botMessageContent = data;
      } else {
        botMessageContent = "I couldn't process that request properly.";
      }
      
      // Clean up the content
      botMessageContent = botMessageContent
        .replace(/\[doc\d+\]/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      const botMessage = {
        id: Date.now() + 1,
        content: botMessageContent,
        sender: "bot",
        feedback: null
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        feedback: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex relative  bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={[]}
      />
     
      <div className="flex-1 flex flex-col">
        <ChatHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          username="John Doe"
        />
       
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-r from-gray-100 to-gray-200 p-2 ">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <ChatMessage
              message={{
                id: 'loading',
                content: "Thinking...",
                sender: "bot"
              }}
            />
          )}
        </div>

        <div className="border-t bg-gradient-to-r from-gray-300 to-gray-300 p-2  ">
          <div className="max-w-4xl mx-auto ">
            <ChatInput handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {feedbackModal.type === 'up' ? 'Positive' : 'Negative'} Feedback
              </h3>
              <button 
                onClick={() => setFeedbackModal({ isOpen: false, messageId: null, type: null })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Please provide additional feedback (optional)"
              className="w-full p-3 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setFeedbackModal({ isOpen: false, messageId: null, type: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setFeedbackModal({ isOpen: false, messageId: null, type: null });
                  setFeedbackText("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
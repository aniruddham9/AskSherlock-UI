// ChatInterface.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { X } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, messageId: null, type: null });
  const [feedbackText, setFeedbackText] = useState("");
  const [username, setUsername] = useState("User Name"); // Default username
  const [introMessage, setIntroMessage] = useState(""); // For welcome message

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/get_user', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit'
        });

        console.log("response json")
        console.log("Before Awaiting Response")
        const data = await response.json();
        console.log("After getting Response - " || data)
        setUsername(data.user || "Guest User");
        setIntroMessage(data.intro_message || "Welcome to Ask Sherlock!");
        setMessages([
          {
            id: Date.now(),
            content: data.intro_message || "Welcome to Ask Sherlock!",
            sender: "bot",
            feedback: null,
          },
          
        ]);
        console.dir(data)

      } catch (error) {
        // console.error("Error fetching user data:", error);
        console.log("Error fetching user data");
        
        setUsername("Guest User");
        setIntroMessage("Welcome to Ask Sherlock!");
        setMessages([
          {
            id: Date.now(),
            content: "Welcome to Ask Sherlock (Guest)",
            sender: "bot",
            feedback: null,
          },
        ]);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e, inputMessage) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      feedback: null,
    };
    setMessages((prev) => [...prev, userMessage]);
  
    setIsLoading(true);
  
    try {
      const userHistory = messages
        .filter((msg) => msg.sender === "user")
        .map((msg) => msg.content)
        .join("\n");
      const aiHistory = messages
        .filter((msg) => msg.sender === "bot")
        .map((msg) => msg.content)
        .join("\n");
  
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: {
            user: userHistory || "", // Send empty string if no user messages
            ai: aiHistory || "",    // Send empty string if no AI messages
          },
          query: inputMessage,
        }),
      });
  
      // if (!response.ok) {
      //   console.error(`Server error: ${response.status}`);
      //   throw new Error(`Server returned status: ${response.status}`);
      // }
  
      const data = await response.json();
  
      const botMessage = {
        id: Date.now() + 1,
        content: data.ai || data.response || "I couldn't process that request.",
        sender: "bot",
        feedback: null,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error submitting chat input:", error);
  
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          feedback: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFeedbackSubmit = async () => {
    const feedbackPayload = {
      user: username,
      ai: messages.find((msg) => msg.id === feedbackModal.messageId)?.content || "",
      feedback: {
        type: feedbackModal.type,
        comment: feedbackText,
      },
    };

    try {
      await fetch('https://asksherlock.azurewebsites.net/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackPayload),
      });
      console.log("Feedback submitted successfully.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackModal({ isOpen: false, messageId: null, type: null });
      setFeedbackText("");
    }
  };

  return (
    <div className="h-screen flex relative bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={[]}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          username={username}
        />
{/* 
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-r from-gray-100 to-gray-200 p-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <ChatMessage
              message={{
                id: 'loading',
                content: "Thinking...",
                sender: "bot",
              }}
            />
          )}
        </div> */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-r from-gray-100 to-gray-200 p-2">
  {messages.map((message ,index) => (
    <ChatMessage 
      key={message.id} 
      message={message} 
      onFeedback={(messageId, type) =>
        setFeedbackModal({ isOpen: true, messageId, type })
      }
      isLastMessage={index === messages.length - 1}
    />
  ))}

  {isLoading && (
    <ChatMessage
      message={{
        id: 'loading',
        content: "Thinking...",
        sender: "bot",
      }}
    />
  )}
</div>


        <div className="border-t bg-gradient-to-r from-gray-300 to-gray-300 p-2">
          <div className="max-w-4xl mx-auto">
            <ChatInput handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>

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
                onClick={handleFeedbackSubmit}
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


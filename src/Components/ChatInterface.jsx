import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { User, Bot, Check, ThumbsUp, ThumbsDown, X } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      feedback: null
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, messageId: null, type: null });
  const [feedbackText, setFeedbackText] = useState("");

  const chatHistory = [
    { id: 1, title: "Previous Chat", date: "2024-12-23" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
   
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      feedback: null
    }]);
   
    setInputMessage("");
   
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: "Thanks for your message! This is a sample response that demonstrates how longer messages will wrap in the enhanced interface layout.",
        sender: "bot",
        feedback: null
      }]);
    }, 1000);
  };

  const handleFeedback = (messageId, type) => {
    setFeedbackModal({ isOpen: true, messageId, type });
  };

  const submitFeedback = () => {
    setMessages(prev => prev.map(message => 
      message.id === feedbackModal.messageId 
        ? { ...message, feedback: { type: feedbackModal.type, text: feedbackText } }
        : message
    ));
    setFeedbackModal({ isOpen: false, messageId: null, type: null });
    setFeedbackText("");
  };

  const MessageAvatar = ({ sender }) => (
    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full 
      ${sender === 'user' ? 'bg-gray-100' : 'bg-gray-200'}`}>
      {sender === 'user' ? (
        <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      ) : (
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      )}
    </div>
  );

  const FeedbackModal = () => (
    feedbackModal.isOpen && (
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
            className="w-full p-3 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setFeedbackModal({ isOpen: false, messageId: null, type: null })}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={submitFeedback}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="h-screen flex relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chatHistory}
      />
     
      <div className="flex-1 flex flex-col bg-gradient-to-r from-gray-100 to-gray-200 w-full">
        <ChatHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          username="John Doe"
        />
       
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <MessageAvatar sender={message.sender} />
                
                <div className={`relative flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[65%] 
                  ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm 
                    ${message.sender === 'user' 
                      ? 'bg-gray-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none'}`}>
                    <p className="text-sm sm:text-base whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1 text-xs 
                    ${message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'}`}>
                    <span>
                      {new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.sender === 'user' && (
                      <Check className="w-4 h-4 text-gray-600" />
                    )}
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => handleFeedback(message.id, 'up')}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            message.feedback?.type === 'up' ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'down')}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            message.feedback?.type === 'down' ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSubmit={handleSubmit}
        />
      </div>

      <FeedbackModal />
    </div>
  );
};

export default ChatInterface;
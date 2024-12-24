// components/Chat/ChatMessage.jsx
import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => (
  <div className="max-w-4xl mx-auto">
    <div className={`flex items-start gap-3 md:gap-6 ${message.sender === 'user' ? 'justify-end' : ''}`}>
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${message.sender === "user" ? "bg-gray-600" : "bg-gray-100"}`}>
        {message.sender === "user" ? 
          <User className="w-5 h-5 md:w-6 md:h-6 text-white" /> : 
          <Bot className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        }
      </div>
      <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
        <div className="font-medium text-gray-800 text-sm md:text-base">
          {message.sender === "user" ? "You" : "Assistant"}
        </div>
        <div className="text-gray-700 leading-relaxed text-sm md:text-base break-words">
          {message.content}
        </div>
      </div>
    </div>
  </div>
);

export default ChatMessage;
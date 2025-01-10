import React from 'react';
import { User, ThumbsUp, ThumbsDown } from 'lucide-react';
import Robot from "../assets/robot2.png";

const parseTextWithPatterns = (text) => {
  if (typeof text !== 'string') return text;

  const parts = text.split(/(\[doc\d+\](?:\[doc\d+\])*)/g);

  return parts
    .map((part, index) => {
      if (!part) return null;

      if (part.match(/^\[((.*?)\d+|string)\]*$/)) {
        return (
          <span
            key={index}
            className="text-blue-600 hover:underline break-words cursor-pointer"
          >
            {part}
          </span>
        );
      }

      const subParts = part.split(/(\*\*[\s\S]*?\*\*|\[[^\]]+\]\(https?:\/\/[^\)]+\))/g);
      return subParts
        .map((subPart, subIndex) => {
          if (!subPart) return null;

          const boldMatch = subPart.match(/^\*\*([\s\S]*?)\*\*$/);
          if (boldMatch) {
            return (
              <strong
                key={`${index}-${subIndex}`}
                className="font-semibold break-words"
              >
                {boldMatch[1]}
              </strong>
            );
          }

          const linkMatch = subPart.match(/\[(.*?)\]\((https?:\/\/.*?)\)(?=\s|[^\w\s]|$)/);
          if (linkMatch) {
            const [, displayText, url] = linkMatch;
            return (
              <a
                key={`${index}-${subIndex}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {displayText}
              </a>
            );
          }

          return (
            <span key={`${index}-${subIndex}`} className="break-words">
              {subPart}
            </span>
          );
        })
        .filter(Boolean);
    })
    .filter(Boolean);
};

const ChatMessage = ({ message, showFeedback, onFeedback }) => {
  const isUser = message.sender === 'user';

  return (
    <div className="flex w-full max-w-4xl mx-auto px-4">
      <div className={`flex items-start gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start gap-4 max-w-[85%] md:max-w-[75%] min-w-0 
          ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser ? 'bg-gray-600' : ''}`}>
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <img 
                src={Robot} 
                alt="Bot" 
                className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-2xl sm:w-6 sm:h-6" 
              />
            )}
          </div>

          <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl text-sm md:text-base w-full
              ${isUser ?
                'bg-gray-600 text-white rounded-tr-none' :
                'bg-white shadow-md text-gray-800 rounded-tl-none'}`}>
              <div className="min-w-0 max-w-full">
                {parseTextWithPatterns(message.content)}
              </div>
            </div>

            {!isUser && showFeedback && (
              <div className="flex gap-2 mt-2 text-gray-500 text-sm">
                <button
                  onClick={() => onFeedback('up', message.id)}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <ThumbsUp className="w-4 h-4" /> Positive
                </button>
                <button
                  onClick={() => onFeedback('down', message.id)}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <ThumbsDown className="w-4 h-4" /> Negative
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

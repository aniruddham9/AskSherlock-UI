import React, { useState } from 'react';
import Robot from "../assets/robot2.png";
import { User, ThumbsUp, ThumbsDown } from 'lucide-react';

const parseTextWithPatterns = (text) => {
  if (typeof text !== 'string') return text;

  // Split the text into parts, keeping document references and links.
  const parts = text.split(/(\[doc\d+\](?:\[doc\d+\])*)/g);

  return parts
    .map((part, index) => {
      if (!part) return null;

      // Handle document references
      if (part.match(/^\[(?:doc\d+|\[doc\d+\])+\]$/)) {
        return (
          <span key={index} className="text-blue-600 hover:underline break-words cursor-pointer">
            {part}
          </span>
        );
      }

      // Process Bold and Links
      const subParts = [];
      let lastIndex = 0;
      let match;
      
      // Regex for bold text (**bold**)
      const boldPattern = /\*\*([^\*]+)\*\*/g; // Matches text between **...**
      const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g; // Matches [text](url)

      // Find all bold text first
      while ((match = boldPattern.exec(part)) !== null) {
        // Push text before the bold
        if (match.index > lastIndex) {
          subParts.push(part.slice(lastIndex, match.index));
        }

        // Push the bolded text
        const boldText = match[1]; // Bold text content
        subParts.push(
          <strong key={`${index}-${match.index}`} className="font-semibold break-words">
            {boldText}
          </strong>
        );

        lastIndex = boldPattern.lastIndex;
      }

      // After bold text, handle links
      while ((match = linkPattern.exec(part)) !== null) {
        // Push text before the link
        if (match.index > lastIndex) {
          subParts.push(part.slice(lastIndex, match.index));
        }

        // Push the link as a clickable element
        const linkText = match[1]; // The link text
        const url = match[2]; // The URL
        subParts.push(
          <a key={`${index}-${match.index}`} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
            {linkText}
          </a>
        );

        lastIndex = linkPattern.lastIndex;
      }

      // Add any remaining text after all bold or links have been processed
      if (lastIndex < part.length) {
        subParts.push(part.slice(lastIndex));
      }

      // Return the processed subParts or the original part
      return subParts.length > 0 ? subParts : [part];
    })
    .filter(Boolean);
};




const processListStructure = (content) => {
  if (!content) return [];
  const parts = content.split(/(?=These case studies)/);
  const mainContent = parts[0];
  const conclusionText = parts[1] || '';
  
  const lines = mainContent.split('\n').map(line => line.trim()).filter(line => line);
  const result = [];
  let currentMainItem = null;
  let currentNumber = '';
  let currentSubItems = [];

  lines.forEach(line => {
    const numberMatch = line.match(/^(\d+)\./);
    if (numberMatch) {
      if (currentMainItem) {
        result.push({
          number: currentNumber,
          mainItem: currentMainItem,
          subItems: [...currentSubItems]
        });
        currentSubItems = [];
      }
      currentNumber = numberMatch[1];
      const mainContent = line.slice(numberMatch[0].length).trim();
      currentMainItem = mainContent;
    } else if (line.startsWith('-')) {
      const subContent = line.slice(1).trim();
      currentSubItems.push(subContent);
    } else {
      if (currentMainItem) {
        currentMainItem += ' ' + line;
      }
    }
  });

  if (currentMainItem) {
    result.push({
      number: currentNumber,
      mainItem: currentMainItem,
      subItems: [...currentSubItems]
    });
  }

  return { items: result, conclusion: conclusionText };
};

const FormattedListItem = ({ number, mainItem, subItems }) => {
  return (
    <div className="mb-4 min-w-0">
      <div className="flex min-w-0">
        <span className="mr-2 flex-shrink-0">{number}.</span>
        <span className="break-words min-w-0 flex-1">
          {parseTextWithPatterns(mainItem)}
        </span>
      </div>
      {subItems.length > 0 && (
        <ul className="ml-8 mt-2 space-y-2">
          {subItems.map((item, index) => (
            <li key={index} className="flex items-start min-w-0">
              <span className="mr-2 flex-shrink-0">•</span>
              <div className="break-words min-w-0 flex-1">
                {parseTextWithPatterns(item)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const formatMessage = (content) => {
  if (!content) return null;

  const cleanContent = content.trim();

  const hasNumberedList = /^\d+\./.test(cleanContent) || /\n\d+\./.test(cleanContent);

  if (hasNumberedList) {
    const parts = cleanContent.split(/(?=(?:^|\n)1\.)/);
    const introText = parts[0].trim();
    const listContent = parts.slice(1).join('');
    const { items: structuredContent, conclusion } = processListStructure(listContent);

    return (
      <div className="space-y-4 min-w-0">
        {introText && <div className="whitespace-pre-wrap break-words">{parseTextWithPatterns(introText)}</div>}
        <div className="space-y-2 min-w-0">
          {structuredContent.map((item, index) => (
            <FormattedListItem key={index} number={item.number} mainItem={item.mainItem} subItems={item.subItems} />
          ))}
        </div>
        {conclusion.trim() && <div className="whitespace-pre-wrap break-words mt-4">{parseTextWithPatterns(conclusion.trim())}</div>}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap break-words min-w-0">{parseTextWithPatterns(cleanContent)}</div>;
};

const ChatMessage = ({ message, onFeedback, isLastMessage }) => {
  const isUser = message.sender === 'user';
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (type) => {
    if (!feedback) {
      setFeedback(type);
      onFeedback(message.id, type);
    }
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex w-full max-w-4xl mx-auto px-4">
      <div className={`flex items-start gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start gap-4 max-w-[85%] md:max-w-[75%] min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gray-600' : ''}`}>
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <img src={Robot} alt="Bot" className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-2xl sm:w-6 sm:h-6" />
            )}
          </div>

          <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl text-sm md:text-base w-full ${isUser ? 'bg-gray-600 text-white rounded-tr-none' : 'bg-white shadow-md text-gray-800 rounded-tl-none'}`}>
              <div className="min-w-0 max-w-full">{formatMessage(message.content)}</div>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-gray-500">
              <span className="text-xs">{formatTime()}</span>
              {!isUser && isLastMessage && (
                <div className="flex items-center gap-2">
                  {!feedback && (
                    <>
                      <button onClick={() => handleFeedback('up')} className="hover:text-blue-600" aria-label="Thumbs up">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleFeedback('down')} className="hover:text-red-600" aria-label="Thumbs down">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {feedback === 'up' && <ThumbsUp className="w-4 h-4 text-blue-600" />}
                  {feedback === 'down' && <ThumbsDown className="w-4 h-4 text-red-600" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

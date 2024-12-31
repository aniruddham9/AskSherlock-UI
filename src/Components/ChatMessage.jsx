import React from 'react';
import { User } from 'lucide-react';
import Robot from "../assets/robot2.png";

const parseTextWithPatterns = (text) => {
  if (typeof text !== 'string') return text;

  // Split the text into sections, preserving document references of any length
  const parts = text.split(/(\[doc\d+\](?:\[doc\d+\])*)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    // Handle consecutive document references
    if (part.match(/^\[doc\d+\](?:\[doc\d+\])*$/)) {
      // Keep the document references exactly as they appear
      return (
        <span
          key={index}
          className="text-blue-600 hover:underline break-words cursor-pointer"
        >
          {part}
        </span>
      );
    }

    // Process other text patterns
    const subParts = part.split(/(\*\*[\s\S]*?\*\*|\[.*?\]\(.*?\))/g);
    return subParts.map((subPart, subIndex) => {
      if (!subPart) return null;

      // Bold text pattern
      const boldMatch = subPart.match(/^\*\*([\s\S]*?)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={`${index}-${subIndex}`} className="font-semibold break-words">
            {boldMatch[1]}
          </strong>
        );
      }

      // Link pattern
      const linkMatch = subPart.match(/^\[(.*?)\]\((https?:\/\/.*?\.pptx)\)$/);
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

      return <span key={`${index}-${subIndex}`} className="break-words">{subPart}</span>;
    }).filter(Boolean);
  }).filter(Boolean);
};

const processListStructure = (content) => {
  if (!content) return [];

  // Split content to separate conclusion text
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
      // Handle non-list content within a numbered item
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
  
  // Check for numbered list pattern
  const hasNumberedList = /^\d+\./.test(cleanContent) || /\n\d+\./.test(cleanContent);
  
  if (hasNumberedList) {
    // Split only if there's a clear numbered list pattern
    const parts = cleanContent.split(/(?=(?:^|\n)1\.)/);
    const introText = parts[0].trim();
    const listContent = parts.slice(1).join('');
    const { items: structuredContent, conclusion } = processListStructure(listContent);

    return (
      <div className="space-y-4 min-w-0">
        {introText && (
          <div className="whitespace-pre-wrap break-words">
            {parseTextWithPatterns(introText)}
          </div>
        )}
        <div className="space-y-2 min-w-0">
          {structuredContent.map((item, index) => (
            <FormattedListItem
              key={index}
              number={item.number}
              mainItem={item.mainItem}
              subItems={item.subItems}
            />
          ))}
        </div>
        {conclusion && (
          <div className="whitespace-pre-wrap break-words mt-4">
            {parseTextWithPatterns(conclusion)}
          </div>
        )}
      </div>
    );
  }

  // For non-list content, preserve everything exactly as is
  return (
    <div className="whitespace-pre-wrap break-words min-w-0">
      {parseTextWithPatterns(cleanContent)}
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                {formatMessage(message.content)}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-1 px-1">
              {formatTime()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
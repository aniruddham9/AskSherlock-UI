// components/Sidebar/ChatHistoryItem.jsx
import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

const ChatHistoryItem = ({ chat }) => (
  <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer mb-1 group">
    <div className="flex items-center gap-3">
      <MessageSquare className="w-5 h-5 text-gray-600" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">{chat.title}</div>
        <div className="text-sm text-gray-500">{chat.date}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
    </div>
  </div>
);

export default ChatHistoryItem;
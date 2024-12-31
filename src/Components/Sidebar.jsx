import React from 'react';
import { Plus, Settings } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import ChatHistoryItem from './ChatHistoryItem';

const Sidebar = ({ isOpen, onClose, chatHistory }) => (
  <div 
    className={`fixed  md:relative z-50 h-full bg-gradient-to-t from-gray-400 to-gray-100 border-b-2 border-r border-b-gray-600 border-gray-200 transition-transform duration-300 flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:w-60 w-[280px]`}
  >
    <SidebarHeader onClose={onClose} />
    <div className="flex-1 overflow-y-auto p-2">    
      {chatHistory.map(chat => (
        <ChatHistoryItem key={chat.id} chat={chat} />
      ))}
    </div>

    <div className="p-4  border-t border-gray-200 flex flex-col">
      <button className="mt-4 mb-2 flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
        <Plus className="w-5 h-5" />
        <span>New Chat</span>
      </button>
      <button className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg w-full">
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>
    </div>
  </div>
);

export default Sidebar;

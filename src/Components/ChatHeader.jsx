import React from 'react';
import { Menu, User } from 'lucide-react';
import Robot from "../assets/robot2.png";

const ChatHeader = ({ onOpenSidebar, username }) => {
  return (
    <div className=" border-b border-gray-200  p-4 flex items-center justify-between ">
      {/* Left Section */}
      <div className="flex items-center  gap-3">
        <button 
          onClick={onOpenSidebar} 
          className="p-1 hover:bg-gray-100  rounded-full md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <img src={Robot} alt="Bot" className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10 rounded-2xl sm:w-6 sm:h-6" />

        <div className="flex flex-col">

          <h1 className="text-lg md:text-xl agbalumo-regular  font-black text-purple-800">
          Ask Sherlock
          </h1>
          <span className="text-xs sm:text-xs text-orange-500 font-medium">
            Powered by Gen AI
          </span>
        </div>
      </div>

      {/* Right Section - User Info */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm md:text-base agbalumo-regular text-gray-700">
        {username || "Guest User"}
        </span>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
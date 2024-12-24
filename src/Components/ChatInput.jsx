import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ inputMessage, setInputMessage, handleSubmit }) => {
  const [isListening, setIsListening] = useState(false);
  
  // Function to handle voice input
  const handleVoiceInput = () => {
    // Create a new SpeechRecognition instance
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    // Configure recognition settings
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Start listening
    recognition.start();
    setIsListening(true);

    // Handle results
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    // Handle end of speech
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Function to stop voice input
  const stopVoiceInput = () => {
    window.speechRecognition?.stop();
    setIsListening(false);
  };

  // Handle microphone toggle
  const toggleMicrophone = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      handleVoiceInput();
    }
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (isListening) {
      stopVoiceInput();
    }
    handleSubmit(e);
  };

  return (
    <div className="border-t border-gray-200  bg-gradient-to-r from-gray-300 to-gray-300 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? "Listening..." : "Message your AI assistant..."}
            className="w-full p-3 md:p-4 pr-24 border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-gray-50 text-sm md:text-base"
          />
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`p-1.5 md:p-2 transition-colors duration-200 ${
                isListening 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-600 hover:text-gray-700'
              }`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
            <button
              type="submit"
              className="p-1.5 md:p-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </form>
        <div className="mt-2 text-xs text-center text-gray-500">
          AI assistant may display inaccurate info • Your privacy is protected
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
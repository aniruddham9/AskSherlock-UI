import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import magnifierGlass from '../assets/magnifier-glass.png'; // Import magnifier image
import background from '../assets/bg1.jpg'; 

const MagnifierScreen = () => {
  const [isPingActive, setIsPingActive] = useState(false);
  const navigate = useNavigate(); 

  const handleAskSherlockClick = () => {
    setIsPingActive(true); 
    setTimeout(() => {
      setIsPingActive(false); 
      navigate('/chat');
    }, 500);
  };

  return (
    <div className={`relative w-full min-h-screen ${isPingActive ? 'animate-ping' : ''}`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-85 filter grayscale"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute inset-0 flex flex-col justify-center md:mr-72 md:mb-72 lg:mb-0 lg:mr-0 animate-minimal-bounce items-center">
        <img
          src={magnifierGlass}
          alt="Magnifier"
          className="-mt-72 -ml-40 sm:mt-0 sm:ml-0 max-w-lg md:max-w-xl pl-36 pt-28 lg:max-w-2xl drop-shadow-2xl object-contain animate-pulse"
        />

        <p
          onClick={handleAskSherlockClick}
          className="text-center cursor-pointer absolute font-semibold text-gray-800 z-10 lg:pb-12 -mt-72 sm:mt-0 -ml-32 sm:ml-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none animate-fade-in animate-pulse md:pb-4 md:pr-6 sm:pl-10 lg:pr-10"
        >
          Ask Sherlock
        </p>
      </div>
    </div>
  );
};

export default MagnifierScreen;

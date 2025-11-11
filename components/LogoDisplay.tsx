
import React, { useState, useEffect } from 'react';

interface LogoDisplayProps {
  imageUrl: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ imageUrl }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Reset animation state when imageUrl changes
    setIsAnimated(false);
    
    // Trigger animation shortly after the component mounts/updates
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100); // 100ms delay to ensure the transition is visible

    return () => clearTimeout(timer);
  }, [imageUrl]);

  return (
    <div className="flex justify-center items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-lg">
      <img
        src={imageUrl}
        alt="Generated AI Logo"
        className={`max-w-full h-auto rounded-lg shadow-2xl transition-all duration-1000 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3'
        }`}
      />
    </div>
  );
};

export default LogoDisplay;

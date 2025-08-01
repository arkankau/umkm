'use client';

import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(60); // Start at 60 minutes
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime === 1) {
          setIsHighlighted(true);
        }
        return newTime;
      });
    }, 50); // Very fast countdown with motion blur effect

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (minutes: number) => {
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
  };

  return (
    <span 
      className={`px-1 transition-all duration-75 ${
        isHighlighted 
          ? 'bg-yellow-300 animate-pulse shadow-lg' 
          : 'bg-[#C6AFFF]'
      } ${timeLeft > 1 ? 'animate-pulse blur-[0.5px]' : ''}`}
      style={{
        filter: timeLeft > 1 ? 'blur(0.5px)' : 'none',
        textShadow: timeLeft > 1 ? '0 0 3px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      {formatTime(timeLeft)}
    </span>
  );
};

export default Countdown;
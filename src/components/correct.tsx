import React, { useEffect } from 'react';

interface CorrectProps {
  isCorrect: boolean;
  onNextCouncil: () => void;
  zoneName: string; 
}

export default function Correct({ isCorrect, onNextCouncil, zoneName }: CorrectProps) {
  useEffect(() => {
    const handleKeyPress = (e: { key: string; }) => {
      if (e.key === 'Enter') {
        onNextCouncil();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="overlay">
        <div className="welcome-popup">
          <div className="h1-wrapper">
            <h1 className="welcome">{isCorrect ? 'Correct' : 'Incorrect'}</h1>
            <h2>This is <span className="bold">{zoneName}</span></h2>
          </div>
          <button id="fly" onClick={onNextCouncil}>Next Council</button>
        </div>
      </div>
    </div>
  );
}

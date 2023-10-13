import React from 'react';
// defines WelcomePopup component with prop onStartGame
export default function CongratulationsPopup({ onStartGame }) {
  return (
    <div className="flex w-full h-full">
      <div className="overlay">
        <div className="welcome-popup">
          <div className="h1-wrapper">
            <h1 className="welcome">Congratulations! You have correctly guessed all 361 UK Councils!</h1>
          </div>
          <h1>🎉</h1>
          <button id="fly" onClick={onStartGame}>Play Again</button> 
        </div>
      </div>
    </div>
  );
}
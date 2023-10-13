import React from 'react';
// defines WelcomePopup component with prop onStartGame
export default function WelcomePopup({ onStartGame }) {
  return (
    <div className="flex w-full h-full">
      <div className="overlay">
        <div className="welcome-popup">
          <div className="h1-wrapper">
            <h1 className="welcome">UK Councils Quiz</h1>
          </div>
          <button id="fly" onClick={onStartGame}>Start</button> {/* Use onStartGame prop */}
        </div>
      </div>
    </div>
  );
}
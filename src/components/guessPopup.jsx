import React, { useState, useEffect } from 'react';

export default function GuessPopup({ onGuessSubmit, randomZone, correctAnswers, incorrectAnswers }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [guessResult, setGuessResult] = useState(null);
  const [userGuess, setUserGuess] = useState('');


  const handleGuessSubmit = () => {
    console.log("User Entry in handleGuessSubmit:", userGuess);
    const isCorrect = userGuess.toLowerCase() === randomZone.properties.LAD23NM.toLowerCase();

    if (isCorrect) {
      setGuessResult(true);
      onGuessSubmit(true);
      if (!correctAnswers.includes(randomZone.id)) {
        correctAnswers.push(randomZone.id);
      }
      if (incorrectAnswers.includes(randomZone.id)) {
        for (let i = 0; i < incorrectAnswers.length; i++) {
          if (incorrectAnswers[i] === randomZone.id) {
            incorrectAnswers.splice(i, 1);
          }
        }
      }
      console.log('Correct Zones:', correctAnswers);
    } else {
      setGuessResult(false);
      onGuessSubmit(false);
      incorrectAnswers.push(randomZone.id);
      const distinctIncorrectAnswers = [];
      let count = 0;
      let start = false;
      for (let i = 0; i < incorrectAnswers.length; i++) {
        for (let j = 0; j < distinctIncorrectAnswers.length; j++) {
          if (incorrectAnswers[i] == distinctIncorrectAnswers[j]) {
            start = true;
          }
        }
        count++;
        if (count == 1 && start == false) {
          distinctIncorrectAnswers.push(incorrectAnswers[i]);
        }
        start = false;
        count = 0;
      }
      console.log('Incorrect Zones:', distinctIncorrectAnswers);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY,
    });

    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleInputFocus = () => {
    setIsDragging(false);
  };

  const handleInputBlur = () => {
    setIsDragging(true);
  };

  return (
    <div
      className="overlay-guess pointer-events-none"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
    >
      <div className="guess-popup">
        <h2>
          <span className="bold">
            Guess the <span className="yellow">yellow</span> council
          </span>
        </h2>
        <form onSubmit={handleGuessSubmit}>
          <input
            type="text"
            placeholder="Enter your Guess"
            value={userGuess}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => {
              setUserGuess(e.target.value);
              console.log('Updated userGuess:', e.target.value);
            }}
          />
          <input type="submit" id="guess" value="Submit Guess" />
        </form>
      </div>
    </div>
  );
}

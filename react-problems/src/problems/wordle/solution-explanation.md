# Wordle Solution - Step-by-Step Explanation

## Overview

This React component implements a Wordle game clone that allows users to guess a 5-letter word within 6 attempts, providing visual feedback for each guess.

## Step-by-Step Breakdown

### 1. **Constants and Imports**

```javascript
import React, { useState, useEffect } from "react";

const WORD_LIST_API_URL = "/api/fe/wordle-words";
const NUM_GUESSES = 6;
const WORD_LENGTH = 5;
```

- Imports necessary React hooks
- Defines game constants for maintainability and clarity

### 2. **GuessLine Component**

```javascript
function GuessLine({ guess, solution, isFinal }) {
  return (
    <div className="line">
      {guess.split("").map((char, i) => {
        let className = "tile";

        if (isFinal) {
          if (char === solution[i]) {
            className += " correct";
          } else if (solution.includes(char)) {
            className += " close";
          } else {
            className += " incorrect";
          }
        }

        return (
          <div key={i} className={className}>
            {char}
          </div>
        );
      })}
    </div>
  );
}
```

**Purpose:** Renders a single line of 5 tiles representing one guess

- **Props:**
  - `guess`: The current guess string (padded to 5 characters)
  - `solution`: The target word
  - `isFinal`: Boolean indicating if this guess has been submitted
- **Logic:**
  - Splits the guess into individual characters
  - Applies CSS classes based on correctness if the guess is finalized
  - Uses correct > close > incorrect priority for styling

### 3. **State Management**

```javascript
const [solution, setSolution] = useState("");
const [guesses, setGuesses] = useState(Array(NUM_GUESSES).fill(null));
const [currentGuess, setCurrentGuess] = useState("");
```

**State Variables:**

- `solution`: The target word fetched from API
- `guesses`: Array of 6 slots for storing completed guesses (null = empty)
- `currentGuess`: The word being typed but not yet submitted

### 4. **API Call Effect**

```javascript
useEffect(() => {
  const getWordleArray = async () => {
    try {
      const response = await fetch(WORD_LIST_API_URL);
      const words = await response.json();
      setSolution(
        words[Math.floor(Math.random() * words.length)].toLowerCase()
      );
    } catch (e) {
      console.error(e);
    }
  };
  getWordleArray();
}, []);
```

**Purpose:** Fetches word list on component mount and selects random solution

- Runs only once when component mounts (empty dependency array)
- Converts selected word to lowercase for consistent comparison
- Handles errors gracefully with try-catch

### 5. **Keyboard Event Handler**

```javascript
useEffect(() => {
  if (solution === null) return;

  const onPressKey = (event) => {
    // Game end conditions
    if (guesses[NUM_GUESSES - 1] != null || guesses.includes(solution)) {
      return;
    }

    // Character validation
    const charCode = event.key.toLowerCase().charCodeAt(0);
    const isLetter =
      event.key.length === 1 &&
      charCode >= "a".charCodeAt(0) &&
      charCode <= "z".charCodeAt(0);

    setCurrentGuess((prevGuess) => {
      if (event.key === "Backspace") {
        return prevGuess.slice(0, -1);
      } else if (event.key === "Enter" && prevGuess.length === WORD_LENGTH) {
        // Submit guess
        const currentGuessIndex = guesses.findIndex((guess) => guess === null);
        const guessesClone = [...guesses];
        guessesClone[currentGuessIndex] = prevGuess;
        setGuesses(guessesClone);
        return "";
      } else if (prevGuess.length < WORD_LENGTH && isLetter) {
        return prevGuess + event.key.toLowerCase();
      }
      return prevGuess;
    });
  };

  window.addEventListener("keydown", onPressKey);
  return () => window.removeEventListener("keydown", onPressKey);
}, [solution, guesses]);
```

**Purpose:** Handles all keyboard input for the game

**Game End Conditions:**

- All 6 guesses used: `guesses[NUM_GUESSES - 1] != null`
- Correct guess found: `guesses.includes(solution)`

**Input Handling:**

- **Backspace:** Removes last character from current guess
- **Enter:** Submits guess if it's exactly 5 letters long
- **Letters:** Adds to current guess if under 5 characters
- **Other keys:** Ignored

### 6. **Render Logic**

```javascript
const currentGuessIndex = guesses.findIndex((guess) => guess === null);

if (solution === null) {
  return null;
}

return (
  <div className="board">
    {guesses.map((guess, i) => {
      return (
        <GuessLine
          key={i}
          guess={(i === currentGuessIndex ? currentGuess : guess ?? "").padEnd(
            WORD_LENGTH
          )}
          solution={solution}
          isFinal={currentGuessIndex > i || currentGuessIndex === -1}
        />
      );
    })}
  </div>
);
```

**Render Logic:**

1. **Loading State:** Returns `null` while solution is being fetched
2. **Current Guess Index:** Finds first empty slot in guesses array
3. **Dynamic Content:**
   - Shows `currentGuess` for the active line
   - Shows submitted guesses for completed lines
   - Shows empty strings for future lines
4. **Padding:** Ensures all lines have exactly 5 characters using `padEnd()`
5. **Final State:** Marks lines as final if they're before current index or game is complete

## Key Features Implemented

### ✅ **API Integration**

- Fetches word list from specified endpoint
- Randomly selects solution word
- Handles loading state

### ✅ **Game Logic**

- 6 attempts maximum
- 5-letter words only
- Real-time typing feedback
- Proper guess validation

### ✅ **Visual Feedback**

- Green (correct): Letter in correct position
- Yellow (close): Letter in word but wrong position
- Gray (incorrect): Letter not in word

### ✅ **Game States**

- Active: User can type and submit guesses
- Won: Correct guess found, no more input accepted
- Lost: All 6 guesses used, no more input accepted

### ✅ **User Experience**

- Real-time character display
- Backspace support
- Enter to submit
- Prevents invalid input (non-letters, >5 chars)
- Maintains game state integrity

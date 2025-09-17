import React, { useState, useEffect } from "react";

// API endpoint for fetching the word list
const WORD_LIST_API_URL = "/api/fe/wordle-words";

// Game configuration constants
const NUM_GUESSES = 6; // Maximum number of attempts
const WORD_LENGTH = 5; // Length of each word

/**
 * Component that renders a single line of guesses (5 tiles)
 * @param {string} guess - The guess string (padded to 5 characters)
 * @param {string} solution - The target word to guess
 * @param {boolean} isFinal - Whether this guess has been submitted
 */
function GuessLine({ guess, solution, isFinal }) {
  return (
    <div className="line">
      {/* Split guess into individual characters and create tiles */}
      {guess.split("").map((char, i) => {
        let className = "tile";

        // Only apply color coding if the guess has been finalized
        if (isFinal) {
          if (char === solution[i]) {
            // Letter is correct and in the right position
            className += " correct";
          } else if (solution.includes(char)) {
            // Letter exists in the word but wrong position
            className += " close";
          } else {
            // Letter doesn't exist in the word
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

export default function Wordle() {
  // State for the target word (solution)
  const [solution, setSolution] = useState("");

  // Array to store all 6 guesses (null means empty slot)
  const [guesses, setGuesses] = useState(Array(NUM_GUESSES).fill(null));

  // Current guess being typed (not yet submitted)
  const [currentGuess, setCurrentGuess] = useState("");

  // Effect to fetch word list and select random solution on component mount
  useEffect(() => {
    const getWordleArray = async () => {
      try {
        // Fetch the word list from API
        const response = await fetch(WORD_LIST_API_URL);
        const words = await response.json();

        // Randomly select a word and convert to lowercase for consistency
        setSolution(
          words[Math.floor(Math.random() * words.length)].toLowerCase()
        );
      } catch (e) {
        console.error("Failed to fetch word list:", e);
      }
    };

    getWordleArray();
  }, []); // Empty dependency array = run once on mount

  // Effect to handle keyboard input
  useEffect(() => {
    // Don't set up event listeners until we have a solution
    if (solution === null) {
      return;
    }

    const onPressKey = (event) => {
      // Check if game should end (all guesses used OR correct guess found)
      if (guesses[NUM_GUESSES - 1] != null || guesses.includes(solution)) {
        return; // Game over, ignore input
      }

      // Validate that the pressed key is a letter
      const charCode = event.key.toLowerCase().charCodeAt(0);
      const isLetter =
        event.key.length === 1 &&
        charCode >= "a".charCodeAt(0) &&
        charCode <= "z".charCodeAt(0);

      // Update current guess based on key pressed
      setCurrentGuess((prevGuess) => {
        if (event.key === "Backspace") {
          // Remove last character from current guess
          return prevGuess.slice(0, -1);
        } else if (event.key === "Enter" && prevGuess.length === WORD_LENGTH) {
          // Submit guess if it's exactly 5 letters long

          // Find the first empty slot in guesses array
          const currentGuessIndex = guesses.findIndex(
            (guess) => guess === null
          );

          // Create a copy of guesses array and add current guess
          const guessesClone = [...guesses];
          guessesClone[currentGuessIndex] = prevGuess;
          setGuesses(guessesClone);

          // Clear current guess for next attempt
          return "";
        } else if (prevGuess.length < WORD_LENGTH && isLetter) {
          // Add letter to current guess if under 5 characters
          return prevGuess + event.key.toLowerCase();
        }

        // Return unchanged guess for any other key
        return prevGuess;
      });
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", onPressKey);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("keydown", onPressKey);
  }, [solution, guesses]); // Re-run when solution or guesses change

  // Find index of current guess (first null slot)
  const currentGuessIndex = guesses.findIndex((guess) => guess === null);

  // Show loading state while solution is being fetched
  if (solution === null) {
    return null;
  }

  return (
    <div className="board">
      {/* Render all 6 guess lines */}
      {guesses.map((guess, i) => {
        return (
          <GuessLine
            key={i}
            // Show current guess for active line, submitted guess for completed lines, empty for future lines
            guess={(i === currentGuessIndex
              ? currentGuess // Current line shows what user is typing
              : guess ?? ""
            ) // Completed lines show submitted guess, future lines show empty
              .padEnd(WORD_LENGTH)} // Pad to 5 characters with spaces
            solution={solution}
            // Line is final if it's before current guess or game is complete (currentGuessIndex === -1)
            isFinal={currentGuessIndex > i || currentGuessIndex === -1}
          />
        );
      })}
    </div>
  );
}

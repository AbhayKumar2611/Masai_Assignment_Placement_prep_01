import React, { useEffect, useState } from "react";
import Flashcard from "./components/Flashcard";
import Progress from "./components/Progress";
import Summary from "./components/Summary";
import Timer from "./components/Timer";
import flashcards from "./data/flashcards";
import { localStorageKeys } from "./utils/localStorageKeys";

const App = () => {
  const [index, setIndex] = useState(
    Number(localStorage.getItem(localStorageKeys.CURRENT_CARD_INDEX)) || 0,
  );
  const [correct, setCorrect] = useState(
    Number(localStorage.getItem(localStorageKeys.CORRECT_ANSWERS)) || 0,
  );
  const [incorrect, setIncorrect] = useState(
    Number(localStorage.getItem(localStorageKeys.INCORRECT_ANSWERS)) || 0,
  );
  const [timeLeft, setTimeLeft] = useState(
    Number(localStorage.getItem(localStorageKeys.TIMER)) || 600,
  );
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.CURRENT_CARD_INDEX, index);
    localStorage.setItem(localStorageKeys.CORRECT_ANSWERS, correct);
    localStorage.setItem(localStorageKeys.INCORRECT_ANSWERS, incorrect);
    localStorage.setItem(localStorageKeys.TIMER, timeLeft);
  }, [index, correct, incorrect, timeLeft]);

  const nextCard = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
    } else {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    return (
      <Summary
        total={flashcards.length}
        correct={correct}
        incorrect={incorrect}
      />
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 ">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        📘 Flashcard Learning App
      </h1>

      <Timer
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        onTimeUp={() => setShowSummary(true)}
      />

      <Flashcard
        card={flashcards[index]}
        onCorrect={() => {
          setCorrect(correct + 1);
          nextCard();
        }}
        onIncorrect={() => {
          setIncorrect(incorrect + 1);
          nextCard();
        }}
      />

      <Progress correct={correct} incorrect={incorrect} />

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setIndex(Math.max(index - 1, 0))}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;

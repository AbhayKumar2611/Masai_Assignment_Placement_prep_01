import React, { useState } from "react";

const Flashcard = ({ card, onCorrect, onIncorrect }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-x-md text-center transition-all">
      <h2 className="text-xl font-semibold mb-6">
        {flipped ? card.answer : card.question}
      </h2>

      <button
        onClick={() => setFlipped(!flipped)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700"
      >
        {flipped ? "Show Question" : "Show Answer"}
      </button>

      {flipped && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCorrect}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Correct
          </button>
          <button
            onClick={onIncorrect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Incorrect
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;

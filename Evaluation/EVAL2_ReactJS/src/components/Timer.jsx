import React, { useEffect } from "react";

const Timer = ({ timeLeft, setTimeLeft }) => {
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  return (
    <div className="text-lg font-semibold">
      Session Timer: {Math.floor(timeLeft / 60)}:
      {String(timeLeft % 60).padStart(2, "0")}
    </div>
  );
};

export default Timer;

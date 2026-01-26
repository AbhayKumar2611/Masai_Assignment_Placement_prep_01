import React, { useEffect, useState } from "react";
import { patients } from "./data/patients";
import { localStorageKeys } from "./utils/localStorageKeys";
import Summary from "./components/Summary";
import Timer from "./components/Timer";
import PatientCard from "./components/PatientCard";

const SESSION_TIME = 15 * 60;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(
    () => Number(localStorage.getItem(localStorageKeys.CURRENT_PATIENT)) || 0,
  );
  const [treated, setTreated] = useState(
    () => JSON.parse(localStorage.getItem(localStorageKeys.TREATED)) || [],
  );
  const [notTreated, setNotTreated] = useState(
    () => JSON.parse(localStorage.getItem(localStorageKeys.NOT_TREATED)) || [],
  );
  const [timeLeft, setTimeLeft] = useState(
    () => Number(localStorage.getItem(localStorageKeys.TIMER)) || SESSION_TIME,
  );

  const pending = patients.length - treated.length - notTreated.length;

  useEffect(() => {
    localStorage.setItem(localStorageKeys.CURRENT_PATIENT, currentIndex);
    localStorage.setItem(localStorageKeys.TREATED, JSON.stringify(treated));
    localStorage.setItem(
      localStorageKeys.NOT_TREATED,
      JSON.stringify(notTreated),
    );
    localStorage.setItem(localStorageKeys.TIMER, timeLeft);
  }, [currentIndex, treated, notTreated, timeLeft]);

  if (timeLeft <= 0 || currentIndex >= patients.length) {
    return (
      <Summary
        total={patients.length}
        treated={treated.length}
        notTreated={notTreated.length}
        pending={pending}
      />
    );
  }

  const currentPatient = patients[currentIndex];
  const locked =
    treated.includes(currentPatient.id) ||
    notTreated.includes(currentPatient.id);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
      <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />

      <PatientCard
        patient={currentPatient}
        locked={locked}
        onTreat={() => {
          setTreated([...treated, currentPatient.id]);
          setCurrentIndex((i) => i + 1);
        }}
        onNotTreat={() => {
          setNotTreated([...notTreated, currentPatient.id]);
          setCurrentIndex((i) => i + 1);
        }}
      />

      <div className="flex gap-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Prev
        </button>
        <button
          disabled={currentIndex === patients.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;

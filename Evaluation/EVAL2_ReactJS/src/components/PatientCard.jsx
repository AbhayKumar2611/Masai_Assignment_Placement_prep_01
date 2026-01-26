import React from "react";

const PatientCard = ({ patient, onTreat, onNotTreat, locked }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">{patient.name}</h2>
      <p>Age: {patient.age}</p>
      <p>Problem: {patient.problem}</p>
      <p className="mb-4">Doctor: {patient.doctor}</p>

      {!locked && (
        <div className="flex gap-4">
          <button
            onClick={onTreat}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Treated
          </button>
          <button
            onClick={onNotTreat}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Not Treated
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientCard;

import React from "react";

const Summary = ({ total, treated, notTreated, pending }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Session Summary</h2>
      <p>Total Patients: {total}</p>
      <p>Treated: {treated}</p>
      <p>Not Treated: {notTreated}</p>
      <p>Pending: {pending}</p>
    </div>
  );
};

export default Summary;

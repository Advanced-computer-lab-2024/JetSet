// src/components/VacationGuide.js
import React, { useState } from 'react';
import vacationSteps from '../data/gueststeps';


const VacationGuestGuide = () => {
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStepCompletion = (index) => {
    setCompletedSteps((prev) => {
      if (prev.includes(index)) {
        return prev.filter((step) => step !== index); // Unmark if already completed
      }
      return [...prev, index]; // Mark as completed
    });
  };

  return (
    <div className="vacation-guide">
      <h1>Vacation Preparation Guide</h1>
      <div className="steps-list">
        {vacationSteps.map((step, index) => (
          <div key={index} className="step-item">
            <input
              type="checkbox"
              checked={completedSteps.includes(index)}
              onChange={() => handleStepCompletion(index)}
            />
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {completedSteps.includes(index) && <span className="completed">Completed!</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationGuestGuide;

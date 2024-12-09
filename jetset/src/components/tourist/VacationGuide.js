// src/components/VacationGuide.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import vacationSteps from "../data/steps";

const VacationGuide = () => {
  //const { touristId } = useParams();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [username, setUsername] = useState("");

  const handleStepCompletion = (index) => {
    setCompletedSteps((prev) => {
      if (prev.includes(index)) {
        return prev.filter((step) => step !== index); // Unmark if already completed
      }
      return [...prev, index]; // Mark as completed
    });
  };

  // useEffect(() => {
  //   const fetchTourist = async () => {
  //     if (touristId) {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:3000/getTourist/${touristId}`
  //         );
  //         setUsername(response.data.username);
  //       } catch (error) {
  //         console.error("Error during fetch:", error);
  //         alert(
  //           error.response?.data?.message || "Error fetching tourist profile"
  //         );
  //       }
  //     }
  //   };
  //   fetchTourist();
  // }, [touristId]);

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
            {completedSteps.includes(index) && (
              <span className="completed">Completed!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationGuide;

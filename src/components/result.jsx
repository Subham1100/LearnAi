import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { responseData, score, strong_topics, weak_topics } = state;
  const handleNextQuiz = () => {
    navigate("/ResponsePage", { state: { responseData } });
  };
  return (
    <div>
      <h1>Your Quiz Result</h1>
      <button onClick={handleNextQuiz}>Next_quiz</button>
      <h2>Score: {score}/10</h2>
      <h3>Strong Topics:</h3>
      <ul>
        {strong_topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
      <h3>Weak Topics:</h3>
      <ul>
        {weak_topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}

export default Result;

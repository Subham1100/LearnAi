import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null); // State for response data
  const [error, setError] = useState(null); // State for error message

  const { state } = location;
  const { responseData, score, strong_topics, weak_topics } = state;

  const handleNextQuiz = () => {
    navigate("/ResponsePage", { state: { responseData } });
  };

  const handleOverAllAnalysis = async (event) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responseData }), // Send the response data in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
      const analysisData = await response.json();
      navigate("/Analysis", { state: { analysisData } });
      setData(analysisData); // Save the fetched data to state
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Your Quiz Result</h1>
      <button onClick={handleNextQuiz}>Next Quiz</button>
      <button onClick={handleOverAllAnalysis}>Overall Analysis</button>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Result;

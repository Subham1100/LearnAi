import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Function to split a string by a keyword
function splitStringByKeyword(str, keyword) {
  return str.split(keyword).slice(1);
}

function ResponsePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  // Check if state exists and has responseData
  if (!state || !state.responseData) {
    return (
      <div>
        <p>No data to display</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const { question, options, correct_option, subject, topic, difficulty } =
    state.responseData;

  // Split the data into arrays
  const questionsArray = splitStringByKeyword(question, "(nexxxtt_questionnn)");
  const optionsArray = splitStringByKeyword(options, "(nexxxtt_questionnn)");
  const correctOptionsArray = splitStringByKeyword(
    correct_option,
    "(nexxxtt_questionnn)"
  );
  const subjectsArray = splitStringByKeyword(subject, "(nexxxtt_questionnn)");
  const topicsArray = splitStringByKeyword(topic, "(nexxxtt_questionnn)");
  const difficultyArray = splitStringByKeyword(
    difficulty,
    "(nexxxtt_questionnn)"
  );

  // Initialize state to store selected answers
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Function to handle selecting an answer
  const handleAnswerSelection = (questionIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: option });
  };

  // Function to handle submitting the answers
  // Function to handle submitting the answers
  const handleSubmit = async (event) => {
    event.preventDefault();
    let score = 0;
    let strong_topics = [];
    let weak_topics = [];
    // Compare selected answers with correct answers
    for (let i = 0; i < correctOptionsArray.length; i++) {
      const selectedAnswer = selectedAnswers[i][0];
      const correctAnswer = correctOptionsArray[i][0];

      if (
        "(" + selectedAnswers[i] === correctOptionsArray[i] ||
        selectedAnswer === correctAnswer
      ) {
        score++;
        strong_topics.push(topicsArray[i]);
      } else {
        console.log(selectedAnswer, correctAnswer);
        console.log(selectedAnswers[i], correctOptionsArray[i]);
        weak_topics.push(topicsArray[i]);
      }
    }

    const payload = {
      questionsArray: questionsArray,
      optionsArray: optionsArray,
      correctOptionsArray: correctOptionsArray,
      subjectsArray: subjectsArray,
      topicsArray: topicsArray,
      difficultyArray: difficultyArray,
      selectedAnswers: selectedAnswers,
    };

    // Send the payload to the backend
    try {
      const response = await fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle successful response
      const responseData = await response.json();
      console.log("Success:", responseData);
      navigate("/Result", {
        state: {
          responseData,
          score: score,
          strong_topics: strong_topics,
          weak_topics: weak_topics,
        },
      });
      // Navigate back to the home page or show a success message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Questionnaire</h2>
      <form onSubmit={handleSubmit}>
        {questionsArray.map((question, index) => (
          <div key={index}>
            <p>
              Question {index + 1}: {question}
            </p>
            <h5>Subject : {subjectsArray[index]}</h5>
            <h5>Topic : {topicsArray[index]}</h5>

            <fieldset>
              <legend>Options:</legend>
              {splitStringByKeyword(optionsArray[index], "(").map(
                (option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="checkbox"
                      id={`option-${index + 1}-${optIndex + 1}`}
                      name={`question-${index + 1}`}
                      value={option.trim()}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleAnswerSelection(index, option)}
                    />
                    <label htmlFor={`option-${index + 1}-${optIndex + 1}`}>
                      {option.trim()}
                    </label>
                  </div>
                )
              )}
            </fieldset>
          </div>
        ))}
        <button type="submit">Submit Answers</button>
      </form>
    </div>
  );
}

export default ResponsePage;

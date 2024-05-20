// Quiz.js

import React, { useState } from "react";

const App = () => {
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      id: 2,
      question: "What is the largest mammal?",
      options: ["Elephant", "Whale", "Giraffe", "Rhino"],
      answer: "Whale",
    },
    {
      id: 3,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: "Mars",
    },
    {
      id: 4,
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "O2", "HCl"],
      answer: "H2O",
    },
    {
      id: 5,
      question: 'Who wrote "To Kill a Mockingbird"?',
      options: [
        "Harper Lee",
        "J.K. Rowling",
        "Stephen King",
        "Charles Dickens",
      ],
      answer: "Harper Lee",
    },
    {
      id: 6,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "India", "Japan", "Australia"],
      answer: "Japan",
    },
    {
      id: 7,
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Cu"],
      answer: "Au",
    },
    {
      id: 8,
      question: "Which city is known as the Big Apple?",
      options: ["Chicago", "Los Angeles", "New York City", "Dallas"],
      answer: "New York City",
    },
    {
      id: 9,
      question: "Who painted the Mona Lisa?",
      options: [
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Vincent van Gogh",
        "Michelangelo",
      ],
      answer: "Leonardo da Vinci",
    },
    {
      id: 10,
      question: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      answer: "Pacific Ocean",
    },
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1>Multiple Choice Quiz</h1>
      {questions.map(({ id, question, options }) => (
        <div key={id}>
          <h3>{question}</h3>
          {options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`question_${id}`}
                value={option}
                onChange={() => handleChange(id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;

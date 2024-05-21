import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [content, setContent] = useState(""); // State for the todo content
  const [data, setData] = useState(null); // State for response data
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/app_todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }), // Send todo content in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
      const responseData = await response.json();
      // Parse the JSON string and format it for display
      navigate("/ResponsePage", { state: { responseData } });
      setData(formattedData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Choose a class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter Class"
          min={1}
          max={10}
          required
        />
        <button type="submit">sumbit</button>
      </form>
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h2>Response Data:</h2>
          <pre>{data}</pre>
        </div>
      )}
    </div>
  );
}

export default Home;

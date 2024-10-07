import React, { useState } from "react";

const CreateTag = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [period, setPeriod] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/addPreferancetag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type, period }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(`Tag created successfully: ${data.name}`);
        setName("");
        setType("");
        setPeriod("");
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Failed to create tag. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Create Preference Tag</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Tag Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="type">Tag Type:</label>
        <input
          type="text"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <label htmlFor="period">Tag Period:</label>
        <input
          type="text"
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
        />

        <button type="submit">Create Tag</button>
      </form>
      {responseMessage && (
        <div className="responseMessage">{responseMessage}</div>
      )}
    </div>
  );
};

export default CreateTag;

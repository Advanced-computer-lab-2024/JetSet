import React, { useState } from "react";
import { createTag } from "./tagService";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faTag,
  faList,
  faClipboardList,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
const TagForm = () => {
  const [tag, setTag] = useState({
    name: "",
    type: "",
    period: "",
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setTag({ ...tag, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTag(tag);
    // Handle success or reset the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input name="name" value={tag.name} onChange={handleChange} required />

      <label>Type:</label>
      <input name="type" value={tag.type} onChange={handleChange} required />

      <label>Period:</label>
      <input
        name="period"
        value={tag.period}
        onChange={handleChange}
        required
      />

      <button type="submit">Create Tag</button>
      <button className="back-button" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </button>
    </form>
  );
};

export default TagForm;

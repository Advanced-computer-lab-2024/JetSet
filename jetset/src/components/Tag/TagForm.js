import React, { useState } from "react";
import { createTag } from "./tagService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TourismGovernorNav from "../TourismGovernorNav";

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
    // You can handle success or reset the form here
  };

  return (
    <div className="admin-frontend">
          {/* <TourismGovernorNav governorUsername={username} governorId={tourismGovernorId} /> */}
          <TourismGovernorNav  />

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => navigate("/changemainTourismG")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/places")}>📍 Places</li>
            <li onClick={() => navigate("/tags")}>🏷️ Tags</li>
            <li onClick={() => navigate("/activities")}>🎭 Activities</li>
            <li onClick={() => navigate("/itineraries")}>📜 Itineraries</li>
            {/* <li onClick={() => navigate("/changepass")}>🔑 Change Password</li> */}
          </ul>
        </aside>

        <main className="admin-main-content">
          <div className="tag-form-container">
            <h2>Create a New Tag</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  name="name"
                  value={tag.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Type:</label>
                <input
                  name="type"
                  value={tag.type}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Period:</label>
                <input
                  name="period"
                  value={tag.period}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Create Tag</button>
            </form>

            {/* <button className="back-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TagForm;

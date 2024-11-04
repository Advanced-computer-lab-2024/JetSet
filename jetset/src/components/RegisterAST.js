import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [idDocument, setIdDocument] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [taxationCard, setTaxationCard] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("role", role);

    if (idDocument) formData.append("documents", idDocument);
    if (certificates && role === "tourguide")
      formData.append("documents", certificates);
    if (taxationCard && (role === "advertiser" || role === "seller"))
      formData.append("documents", taxationCard);

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.msg);
      if (role === "seller" || role === "advertiser" || role === "tourguide") {
        setShowModal(true);
      }
    } catch (err) {
      setMessage("Error creating account.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (role === "seller") {
      navigate("/createseller", { state: { username, password, email } });
    } else if (role === "advertiser") {
      navigate("/createadvertiser", { state: { username, password, email } });
    } else if (role === "tourguide") {
      navigate("/tourguide", { state: { username, password, email } });
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleRegister} encType="multipart/form-data">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select a role</option>
          <option value="tourguide">Tour Guide</option>
          <option value="advertiser">Advertiser</option>
          <option value="seller">Seller</option>
        </select>

        {/* Conditionally render document fields based on role */}
        {role && (
          <>
            <label>ID Document</label>
            <input
              type="file"
              onChange={(e) => setIdDocument(e.target.files[0])}
              required
            />
            {role === "tourguide" && (
              <>
                <label>Certificates</label>
                <input
                  type="file"
                  onChange={(e) => setCertificates(e.target.files[0])}
                />
              </>
            )}
            {(role === "advertiser" || role === "seller") && (
              <>
                <label>Taxation Registry Card</label>
                <input
                  type="file"
                  onChange={(e) => setTaxationCard(e.target.files[0])}
                />
              </>
            )}
          </>
        )}

        <button type="submit">Register</button>
        {message && (
          <p
            className={
              message.includes("Error") ? "error-message" : "success-message"
            }
          >
            {message}
          </p>
        )}
      </form>

      {showModal && (
        <div className="modal">
          <p>You are accepted as a {role}!</p>
          <button onClick={handleCloseModal}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Register;

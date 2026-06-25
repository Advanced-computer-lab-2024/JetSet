import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.jpg";

const Register = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setMessage(null);
    if (selectedRole === "tourist") {
      navigate("/touristregister");
    } else if (selectedRole === "seller") {
      navigate("/registerAst");
    }
  };

  const roleCards = [
    {
      key: "tourist",
      label: "Tourist",
      description: "Book flights, hotels, activities, and plan your dream vacation",
      icon: faUser,
    },
    {
      key: "seller",
      label: "Tour Guide / Advertiser / Seller",
      description: "List your services, create activities, and reach travelers worldwide",
      icon: faBriefcase,
    },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src={logo}
            alt="JetSet"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 1rem",
              display: "block",
              boxShadow: "0 4px 12px rgba(15,76,129,0.12)",
            }}
          />
          <h2 style={{ marginBottom: "0.35rem" }}>Join JetSet</h2>
          <p style={{ color: "var(--color-muted)", margin: 0 }}>
            Choose how you'd like to get started
          </p>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {roleCards.map(({ key, label, description, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleRoleSelection(key)}
              aria-label={`Register as ${label}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.5rem",
                background: "var(--color-soft)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-lg)",
                color: "var(--color-ink)",
                textAlign: "left",
                cursor: "pointer",
                transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,76,129,0.1)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--color-line)";
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: "1.25rem",
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon icon={icon} />
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>
                  {label}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.4 }}>
                  {description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {message && (
          <p className="error-message" role="alert" style={{ marginTop: "1rem" }}>
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "var(--color-primary)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

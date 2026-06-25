import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faCheckCircle,
  faExclamationCircle,
  faShieldAlt,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const getPasswordStrength = (password) => {
  if (!password) return { level: "", score: 0, color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: "Weak", score, color: "#ef4444" };
  if (score <= 3) return { level: "Medium", score, color: "#f59e0b" };
  return { level: "Strong", score, color: "#10b981" };
};

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (success) setSuccess("");
    if (apiError) setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    setSuccess("");

    try {
      await axios.post("/admin", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
      setSuccess("Admin account created successfully!");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create admin account. The username or email may already be in use."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="admin-register-wrapper">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <div className="admin-register-icon-circle">
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <h2>Create Admin Account</h2>
          <p>Register a new administrator for the JetSet platform</p>
        </div>

        {success && (
          <div className="admin-register-alert success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{success}</span>
          </div>
        )}

        {apiError && (
          <div className="admin-register-alert error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="admin-register-field">
            <label htmlFor="reg-username">
              <FontAwesomeIcon icon={faUser} className="field-icon" />
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="admin-register-field">
            <label htmlFor="reg-email">
              <FontAwesomeIcon icon={faEnvelope} className="field-icon" />
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="admin-register-field">
            <label htmlFor="reg-password">
              <FontAwesomeIcon icon={faLock} className="field-icon" />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
            {formData.password && (
              <div className="strength-bar-container">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.level}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="admin-register-field">
            <label htmlFor="reg-confirm">
              <FontAwesomeIcon icon={faLock} className="field-icon" />
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="admin-register-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>
      </div>

      <style>{`
        .admin-register-wrapper {
          max-width: 520px;
        }
        .admin-register-card {
          background: #fff;
          border: 1px solid var(--color-line);
          border-radius: 16px;
          padding: 36px;
          box-shadow: var(--shadow-sm);
        }
        .admin-register-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .admin-register-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          display: inline-grid;
          place-items: center;
          font-size: 1.4rem;
          margin-bottom: 14px;
        }
        .admin-register-header h2 {
          font-size: 1.35rem;
          margin-bottom: 6px;
          color: var(--color-primary-strong);
        }
        .admin-register-header p {
          color: var(--color-muted);
          font-size: 0.88rem;
          margin: 0;
        }
        .admin-register-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .admin-register-alert.success {
          background: #e5f7ef;
          color: #116149;
          border: 1px solid #a8e6cf;
        }
        .admin-register-alert.error {
          background: #fff1f1;
          color: #8a1f1b;
          border: 1px solid #f4b7b4;
        }
        .admin-register-field {
          margin-bottom: 20px;
        }
        .admin-register-field label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--color-primary-strong);
        }
        .field-icon {
          color: var(--color-muted);
          font-size: 0.85rem;
        }
        .admin-register-field input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-line);
          font-size: 0.9rem;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }
        .admin-register-field input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
          outline: none;
        }
        .admin-register-field input.input-error {
          border-color: var(--color-danger);
        }
        .field-error {
          display: block;
          margin-top: 5px;
          font-size: 0.78rem;
          color: var(--color-danger);
          font-weight: 500;
        }
        .password-input-wrapper {
          position: relative;
        }
        .password-input-wrapper input {
          padding-right: 42px;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          padding: 4px;
          min-height: auto;
          font-size: 0.9rem;
        }
        .password-toggle:hover {
          color: var(--color-primary);
          transform: translateY(-50%);
          box-shadow: none;
        }
        .strength-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .strength-bar {
          flex: 1;
          height: 5px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
        }
        .strength-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 300ms ease, background 300ms ease;
        }
        .strength-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .admin-register-submit {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 180ms ease, transform 180ms ease;
        }
        .admin-register-submit:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        }
        .admin-register-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
};

export default AdminRegister;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faBullhorn,
  faStore,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCloudUploadAlt,
  faFileAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.jpg";

const ROLE_OPTIONS = [
  {
    value: "tourguide",
    label: "Tour Guide",
    description: "Lead tours and share your expertise with travelers",
    icon: faRoute,
  },
  {
    value: "advertiser",
    label: "Advertiser",
    description: "Promote activities and reach a global audience",
    icon: faBullhorn,
  },
  {
    value: "seller",
    label: "Seller",
    description: "List and sell products through the JetSet marketplace",
    icon: faStore,
  },
];

const TERMS_TEXT = `1. Introduction
Welcome to JetSet! By using our website and services, you agree to these Terms and Conditions.

2. Use of the Website
Eligibility: You must be at least 18 years old to use our services. By accessing our site, you confirm that you are of legal age.
Account Registration: Some features may require you to register an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
Accuracy of Information: You agree to provide accurate and complete information when registering or using any part of our site.

3. Services Offered
Our website provides tools to plan virtual and real-world trips, including but not limited to itinerary building, virtual tours, trip bookings, and destination guides. Our services are for informational purposes and should be used at your own discretion.

4. User Responsibilities
Compliance with Laws: You agree to comply with all applicable laws when using our website and services.
Content Sharing: Any content shared on our site, such as reviews, photos, and travel stories, must be your original work and must not infringe on any third-party rights.
Prohibited Activities: You agree not to use our services for any fraudulent, unlawful, or harmful activities.

5. Booking and Payment Terms
Third-Party Providers: Our site may feature third-party service providers (e.g., hotels, airlines). We are not responsible for any issues or disputes arising from these third-party services.
Payment Processing: Payments for any trip-related services may be processed by third-party payment systems. By using these services, you agree to their terms.
Cancellations and Refunds: Please review the specific cancellation and refund policies for each booking.

6. Limitation of Liability
No Guarantees: While we strive to offer accurate and reliable information, we make no guarantees regarding the completeness, accuracy, or availability of our services.
Assumption of Risk: You agree that you are using our site at your own risk.

7. Privacy Policy
Your privacy is important to us. Please review our Privacy Policy, which outlines how we collect, use, and protect your information.

8. Intellectual Property
All content on this website, including text, images, graphics, and logos, is the property of JetSet and is protected by copyright and intellectual property laws.

9. Changes to the Terms
We reserve the right to modify or update these Terms and Conditions at any time.

10. Contact Us
If you have any questions or concerns, please contact us at 12339.

By using our website and services, you acknowledge that you have read and agreed to these Terms and Conditions.`;

const Register = () => {
  const [step, setStep] = useState(1);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [idDocument, setIdDocument] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [taxationCard, setTaxationCard] = useState(null);
  const [message, setMessage] = useState(null);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  const navigate = useNavigate();

  const validateStep = (s) => {
    const errors = {};
    if (s === 1 && !role) {
      errors.role = "Please select a role.";
    }
    if (s === 2) {
      if (!registerUsername.trim()) errors.username = "Username is required.";
      if (!email.trim()) errors.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email.";
      if (!registerPassword) errors.password = "Password is required.";
      else if (registerPassword.length < 6) errors.password = "Password must be at least 6 characters.";
    }
    if (s === 3 && !idDocument) {
      errors.idDocument = "ID document is required.";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      setStepErrors({});
      setMessage(null);
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setStepErrors({});
    setMessage(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage("Please accept the terms and conditions.");
      return;
    }

    const formData = new FormData();
    formData.append("username", registerUsername);
    formData.append("password", registerPassword);
    formData.append("email", email);
    formData.append("role", role);

    if (idDocument) formData.append("documents", idDocument);
    if (certificates && role === "tourguide") formData.append("documents", certificates);
    if (taxationCard && (role === "advertiser" || role === "seller")) formData.append("documents", taxationCard);

    setLoading(true);
    try {
      await axios.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Waiting for the admin to accept you.");
      setWaitingForApproval(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword || !loginRole) {
      setMessage("Please fill in all login fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/login", {
        user: loginUsername,
        password: loginPassword,
        role: loginRole,
      });
      setMessage(response.data.message);
      if (response.data.message.includes("Congratulation")) {
        setLoginEmail(response.data.guest.email);
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = async () => {
    if (termsAccepted) {
      setShowModal(false);
      setLoading(true);
      try {
        await axios.delete(`/deleteGuest/${loginUsername}`);
        if (loginRole === "seller") {
          navigate("/createseller", {
            state: { username: loginUsername, password: loginPassword, email: loginEmail },
          });
        } else if (loginRole === "advertiser") {
          navigate("/createAdv", {
            state: { username: loginUsername, password: loginPassword, email: loginEmail },
          });
        } else if (loginRole === "tourguide") {
          navigate("/CreateTourGuide", {
            state: { username: loginUsername, password: loginPassword, email: loginEmail },
          });
        }
      } catch (err) {
        setMessage("Error deleting guest.");
      } finally {
        setLoading(false);
      }
    }
  };

  const progressPercent = (step / 4) * 100;

  const stepLabels = ["Role", "Account", "Documents", "Terms"];

  if (waitingForApproval) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center", maxWidth: 520 }}>
          <img
            src={logo}
            alt="JetSet"
            style={{
              width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
              margin: "0 auto 1.5rem", display: "block",
              boxShadow: "0 4px 12px rgba(15,76,129,0.12)",
            }}
          />
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ fontSize: "2.5rem", color: "var(--color-primary)", marginBottom: "1rem" }}
          />
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Registration Submitted</h2>
          <p className="success-message">{message}</p>
          <p style={{ color: "var(--color-muted)", marginTop: "1rem", fontSize: "0.9rem" }}>
            You will be notified once an admin reviews your application.
          </p>

          <div style={{ borderTop: "1px solid var(--color-line)", marginTop: "2rem", paddingTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setShowLoginForm((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-primary)",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: "auto",
                fontSize: "0.95rem",
              }}
            >
              {showLoginForm ? "Hide login form" : "Already approved? Check here"}
            </button>

            {showLoginForm && (
              <div className="form-stack" style={{ marginTop: "1rem", textAlign: "left" }}>
                <div>
                  <label htmlFor="approval-username">Username</label>
                  <input
                    id="approval-username"
                    type="text"
                    placeholder="Enter username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="approval-password">Password</label>
                  <input
                    id="approval-password"
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="approval-role">Role</label>
                  <select
                    id="approval-role"
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="tourguide">Tour Guide</option>
                    <option value="advertiser">Advertiser</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" onClick={handleLogin} disabled={loading} style={{ flex: 1 }}>
                    {loading ? "Checking…" : "Check Approval"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowLoginForm(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "grid", placeItems: "center", zIndex: 2000, padding: "1rem",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Terms and conditions"
          >
            <div
              className="auth-card"
              style={{ maxWidth: 560, maxHeight: "85vh", display: "flex", flexDirection: "column" }}
            >
              <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Terms and Conditions</h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", textAlign: "center" }}>
                Please read and accept the terms to proceed.
              </p>
              <div
                style={{
                  flex: 1, overflow: "auto", padding: "1rem", background: "var(--color-soft)",
                  borderRadius: "var(--radius-md)", margin: "1rem 0", fontSize: "0.85rem",
                  lineHeight: 1.65, color: "var(--color-ink)", whiteSpace: "pre-line",
                }}
              >
                {TERMS_TEXT}
              </div>
              <label
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  cursor: "pointer", fontWeight: 600, marginBottom: "1rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  style={{ width: 18, height: 18 }}
                />
                I accept the Terms and Conditions
              </label>
              <button type="button" onClick={handleCloseModal} disabled={!termsAccepted || loading}>
                {loading ? "Processing…" : "Continue"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src={logo}
            alt="JetSet"
            style={{
              width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
              margin: "0 auto 1rem", display: "block",
              boxShadow: "0 4px 12px rgba(15,76,129,0.12)",
            }}
          />
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>Create Your Account</h2>
          <p style={{ color: "var(--color-muted)", margin: 0, fontSize: "0.95rem" }}>
            Join JetSet as a service provider
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: "0.5rem", fontSize: "0.8rem", color: "var(--color-muted)",
            }}
          >
            {stepLabels.map((label, i) => (
              <span
                key={label}
                style={{
                  fontWeight: i + 1 <= step ? 700 : 400,
                  color: i + 1 <= step ? "var(--color-primary)" : "var(--color-muted)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <div
            style={{
              height: 6, borderRadius: 3, background: "var(--color-line)", overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%", borderRadius: 3,
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                width: `${progressPercent}%`,
                transition: "width 350ms ease",
              }}
            />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Select your role</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {ROLE_OPTIONS.map(({ value, label, description, icon }) => {
                const selected = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setRole(value); setStepErrors({}); }}
                    aria-pressed={selected}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1.25rem", textAlign: "left",
                      background: selected ? "rgba(15,76,129,0.06)" : "var(--color-soft)",
                      border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-line)"}`,
                      borderRadius: "var(--radius-lg)",
                      color: "var(--color-ink)",
                      cursor: "pointer",
                      transition: "border-color 150ms ease, background 150ms ease",
                    }}
                  >
                    <span
                      style={{
                        width: 46, height: 46, borderRadius: "50%",
                        background: selected
                          ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                          : "var(--color-line)",
                        display: "grid", placeItems: "center",
                        color: selected ? "#fff" : "var(--color-muted)",
                        fontSize: "1.1rem", flexShrink: 0,
                        transition: "background 150ms ease, color 150ms ease",
                      }}
                    >
                      <FontAwesomeIcon icon={icon} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1rem" }}>{label}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--color-muted)", lineHeight: 1.4, marginTop: 2 }}>
                        {description}
                      </div>
                    </div>
                    {selected && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ marginLeft: "auto", color: "var(--color-primary)", fontSize: "1.1rem" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {stepErrors.role && (
              <p className="error-message" role="alert" style={{ marginTop: "0.75rem" }}>
                {stepErrors.role}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <div className="form-stack">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Account Details</h3>
            <div>
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                placeholder="Choose a username"
                value={registerUsername}
                onChange={(e) => { setRegisterUsername(e.target.value); setStepErrors({}); }}
                required
                aria-invalid={!!stepErrors.username}
              />
              {stepErrors.username && (
                <span style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>{stepErrors.username}</span>
              )}
            </div>
            <div>
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStepErrors({}); }}
                required
                aria-invalid={!!stepErrors.email}
              />
              {stepErrors.email && (
                <span style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>{stepErrors.email}</span>
              )}
            </div>
            <div>
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="At least 6 characters"
                value={registerPassword}
                onChange={(e) => { setRegisterPassword(e.target.value); setStepErrors({}); }}
                required
                aria-invalid={!!stepErrors.password}
              />
              {stepErrors.password && (
                <span style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>{stepErrors.password}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="form-stack">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Upload Documents</h3>
            <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", margin: 0 }}>
              Required for verification as a{" "}
              <strong>{ROLE_OPTIONS.find((r) => r.value === role)?.label}</strong>.
            </p>

            <div>
              <label htmlFor="reg-id-doc">
                <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "0.4rem" }} />
                ID Document <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <div
                style={{
                  border: `2px dashed ${stepErrors.idDocument ? "var(--color-danger)" : "var(--color-line)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "1.5rem",
                  textAlign: "center",
                  background: "var(--color-soft)",
                  cursor: "pointer",
                  transition: "border-color 150ms",
                }}
                onClick={() => document.getElementById("reg-id-doc").click()}
                onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("reg-id-doc").click(); }}
                tabIndex={0}
                role="button"
                aria-label="Upload ID document"
              >
                <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: "0.5rem", display: "block" }} />
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  {idDocument ? idDocument.name : "Click to upload or drag and drop"}
                </span>
                <input
                  id="reg-id-doc"
                  type="file"
                  onChange={(e) => { setIdDocument(e.target.files[0]); setStepErrors({}); }}
                  style={{ display: "none" }}
                  required
                />
              </div>
              {stepErrors.idDocument && (
                <span style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>{stepErrors.idDocument}</span>
              )}
            </div>

            {role === "tourguide" && (
              <div>
                <label htmlFor="reg-certificates">
                  <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "0.4rem" }} />
                  Certificates (Optional)
                </label>
                <div
                  style={{
                    border: "2px dashed var(--color-line)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    textAlign: "center",
                    background: "var(--color-soft)",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("reg-certificates").click()}
                  onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("reg-certificates").click(); }}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload certificates"
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: "1.5rem", color: "var(--color-accent)", marginBottom: "0.5rem", display: "block" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                    {certificates ? certificates.name : "Click to upload certificates"}
                  </span>
                  <input
                    id="reg-certificates"
                    type="file"
                    onChange={(e) => setCertificates(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}

            {(role === "advertiser" || role === "seller") && (
              <div>
                <label htmlFor="reg-tax-card">
                  <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "0.4rem" }} />
                  Taxation Registry Card (Optional)
                </label>
                <div
                  style={{
                    border: "2px dashed var(--color-line)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    textAlign: "center",
                    background: "var(--color-soft)",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("reg-tax-card").click()}
                  onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("reg-tax-card").click(); }}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload taxation card"
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: "1.5rem", color: "var(--color-accent)", marginBottom: "0.5rem", display: "block" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                    {taxationCard ? taxationCard.name : "Click to upload taxation card"}
                  </span>
                  <input
                    id="reg-tax-card"
                    type="file"
                    onChange={(e) => setTaxationCard(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Terms & Submit */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Terms & Conditions</h3>
            <div
              style={{
                maxHeight: 260, overflow: "auto", padding: "1rem",
                background: "var(--color-soft)", borderRadius: "var(--radius-md)",
                fontSize: "0.82rem", lineHeight: 1.65, color: "var(--color-ink)",
                whiteSpace: "pre-line", marginBottom: "1rem",
                border: "1px solid var(--color-line)",
              }}
            >
              {TERMS_TEXT}
            </div>
            <label
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                cursor: "pointer", fontWeight: 600, marginBottom: "1rem",
              }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                style={{ width: 18, height: 18 }}
              />
              I accept the Terms and Conditions
            </label>
          </div>
        )}

        {message && !waitingForApproval && (
          <p
            className={message.includes("Error") ? "error-message" : "success-message"}
            role="alert"
            style={{ marginTop: "0.75rem" }}
          >
            {message}
          </p>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginTop: "1.5rem", gap: "0.75rem",
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              Next
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegister}
              disabled={!termsAccepted || loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: termsAccepted
                  ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                  : "var(--color-line)",
                cursor: termsAccepted ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Submitting…
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  Submit Registration
                </>
              )}
            </button>
          )}
        </div>

        <p
          style={{
            textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem",
            color: "var(--color-muted)",
          }}
        >
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

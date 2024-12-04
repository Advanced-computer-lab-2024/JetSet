import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [registerUsername, setRegisterUsername] = useState(""); // Changed variable name
  const [registerPassword, setRegisterPassword] = useState(""); // Changed variable name
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
  const [loginUsername, setLoginUsername] = useState(""); // New state for login username
  const [loginPassword, setLoginPassword] = useState(""); // New state for login password
  const [loginRole, setLoginRole] = useState(""); // New state for login role
  const [loginEmail, setLoginEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", registerUsername); // Use registerUsername
    formData.append("password", registerPassword); // Use registerPassword
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

      setMessage("Waiting for the admin to accept you.");
      setWaitingForApproval(true); // Enable waiting mode
    } catch (err) {
      setMessage("Error creating account.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        user: loginUsername,
        password: loginPassword,
        role: loginRole, // Add role to the login request
      });

      setMessage(response.data.message);

      // Show modal only if the guest is accepted
      if (response.data.message.includes("Congratulation")) {
        setLoginEmail(response.data.guest.email);
        setShowModal(true); // Show terms and conditions modal if accepted
      } else {
        setShowModal(false); // Hide modal if not accepted
      }
    } catch (err) {
      setMessage("Error during login.");
    }
  };

  const handleCloseModal = async () => {
    if (termsAccepted) {
      setShowModal(false);

      // Send request to delete guest after terms are accepted
      try {
        const response = await axios.delete(
          `http://localhost:3000/deleteGuest/${loginUsername}`
        );
        console.log(response.data.message); // Log server message (Success or error)

        // Proceed to navigate based on the role
        if (loginRole === "seller") {
          navigate("/createseller", {
            state: {
              username: loginUsername,
              password: loginPassword,
              email: loginEmail,
            },
          });
        } else if (loginRole === "advertiser") {
          navigate("/createAdv", {
            state: {
              username: loginUsername,
              password: loginPassword,
              email: loginEmail,
            },
          });
        } else if (loginRole === "tourguide") {
          navigate("/CreateTourGuide", {
            state: {
              username: loginUsername,
              password: loginPassword, // Use loginPassword for the tourguide
              email: loginEmail,
            },
          });
        }
      } catch (err) {
        console.error(
          "Error deleting guest:",
          err.response?.data?.message || err.message
        );
        setMessage("Error deleting guest.");
      }
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleRegister} encType="multipart/form-data">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
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
        {waitingForApproval && (
          <div>
            <p>{message}</p>
          </div>
        )}
        {message && !waitingForApproval && (
          <p
            className={
              message.includes("Error") ? "error-message" : "success-message"
            }
          >
            {message}
          </p>
        )}
      </form>

      <button type="button" onClick={() => setShowLoginForm(true)}>
        Already registered
      </button>

      {/* Login form visible only when showLoginForm is true */}
      {showLoginForm && (
        <div className="login-form">
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <select
            value={loginRole}
            onChange={(e) => setLoginRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="tourguide">Tour Guide</option>
            <option value="advertiser">Advertiser</option>
            <option value="seller">Seller</option>
          </select>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
          <button type="button" onClick={() => setShowLoginForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Terms and Conditions</h3>
            <p>Please read and accept the terms and conditions to proceed.</p>
            <div className="terms-content">
              <p>
                <strong>1. Introduction</strong>
                <br />
                Welcome to JetSet! By using our website and services, you agree
                to these Terms and Conditions... 1. Use of the Website
                Eligibility: You must be at least 18 years old to use our
                services. By accessing our site, you confirm that you are of
                legal age. Account Registration: Some features may require you
                to register an account. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account. Accuracy of
                Information: You agree to provide accurate and complete
                information when registering or using any part of our site.
                <br />
                <strong>2. Services Offered</strong>
                <br />
                Our website provides tools to plan virtual and real-world trips,
                including but not limited to itinerary building, virtual tours,
                trip bookings, and destination guides. Our services are for
                informational purposes and should be used at your own
                discretion.
                <br />
                <strong>3. User Responsibilities</strong>
                <br />
                Compliance with Laws: You agree to comply with all applicable
                laws when using our website and services. Content Sharing: Any
                content shared on our site, such as reviews, photos, and travel
                stories, must be your original work and must not infringe on any
                third-party rights. Prohibited Activities: You agree not to use
                our services for any fraudulent, unlawful, or harmful
                activities.
                <br />
                <strong>4. Booking and Payment Terms</strong>
                <br />
                Third-Party Providers: Our site may feature third-party service
                providers (e.g., hotels, airlines). We are not responsible for
                any issues or disputes arising from these third-party services.
                Payment Processing: Payments for any trip-related services may
                be processed by third-party payment systems. By using these
                services, you agree to their terms. Cancellations and Refunds:
                Please review the specific cancellation and refund policies for
                each booking. These policies vary depending on the provider and
                may be subject to fees.
                <br />
                <strong>5. Limitation of Liability</strong>
                <br />
                No Guarantees: While we strive to offer accurate and reliable
                information, we make no guarantees regarding the completeness,
                accuracy, or availability of our services. Assumption of Risk:
                You agree that you are using our site at your own risk and that
                we are not liable for any losses, damages, or injuries resulting
                from the use of our services or the reliance on any information
                provided.
                <br />
                <strong>6. Privacy Policy</strong>
                <br />
                Your privacy is important to us. Please review our Privacy
                Policy, which outlines how we collect, use, and protect your
                information.
                <br />
                <strong>7. Intellectual Property</strong>
                <br />
                All content on this website, including text, images, graphics,
                and logos, is the property of JetSet and is protected by
                copyright and intellectual property laws. Unauthorized use of
                our content is prohibited.
                <br />
                <strong>8. Changes to the Terms</strong>
                <br />
                We reserve the right to modify or update these Terms and
                Conditions at any time. Changes will be effective immediately
                upon posting. Your continued use of the site constitutes
                acceptance of the new terms.
                <br />
                <strong>9. Governing Law</strong>
                <br />
                These Terms and Conditions are governed by the laws of Egypt,
                and any disputes will be resolved in the courts of Egypt.
                <br />
                <strong>10. Contact Us</strong>
                <br />
                If you have any questions or concerns regarding these Terms and
                Conditions, please contact us at 12339.
                <br />
                <strong>
                  By using our website and services, you acknowledge that you
                  have read and agreed to these Terms and Conditions.
                </strong>
              </p>
            </div>
            <label>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              I accept the Terms and Conditions
            </label>
            <button onClick={handleCloseModal} disabled={!termsAccepted}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

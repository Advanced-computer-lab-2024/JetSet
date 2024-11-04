// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles.css";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("");
//   const [idDocument, setIdDocument] = useState(null);
//   const [certificates, setCertificates] = useState(null);
//   const [taxationCard, setTaxationCard] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("password", password);
//     formData.append("email", email);
//     formData.append("role", role);

//     if (idDocument) formData.append("documents", idDocument);
//     if (certificates && role === "tourguide")
//       formData.append("documents", certificates);
//     if (taxationCard && (role === "advertiser" || role === "seller"))
//       formData.append("documents", taxationCard);

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/register",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setMessage(response.data.msg);
//       if (role === "seller" || role === "advertiser" || role === "tourguide") {
//         setShowModal(true);
//       }
//     } catch (err) {
//       setMessage("Error creating account.");
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     if (role === "seller") {
//       navigate("/createseller", { state: { username, password, email } });
//     } else if (role === "advertiser") {
//       navigate("/createadvertiser", { state: { username, password, email } });
//     } else if (role === "tourguide") {
//       navigate("/tourguide", { state: { username, password, email } });
//     }
//   };

//   return (
//     <div className="App">
//       <form onSubmit={handleRegister} encType="multipart/form-data">
//         <h2>Register</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <select value={role} onChange={(e) => setRole(e.target.value)} required>
//           <option value="">Select a role</option>
//           <option value="tourguide">Tour Guide</option>
//           <option value="advertiser">Advertiser</option>
//           <option value="seller">Seller</option>
//         </select>

//         {/* Conditionally render document fields based on role */}
//         {role && (
//           <>
//             <label>ID Document</label>
//             <input
//               type="file"
//               onChange={(e) => setIdDocument(e.target.files[0])}
//               required
//             />
//             {role === "tourguide" && (
//               <>
//                 <label>Certificates</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setCertificates(e.target.files[0])}
//                 />
//               </>
//             )}
//             {(role === "advertiser" || role === "seller") && (
//               <>
//                 <label>Taxation Registry Card</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setTaxationCard(e.target.files[0])}
//                 />
//               </>
//             )}
//           </>
//         )}

//         <button type="submit">Register</button>
//         {message && (
//           <p
//             className={
//               message.includes("Error") ? "error-message" : "success-message"
//             }
//           >
//             {message}
//           </p>
//         )}
//       </form>

//       {showModal && (
//         <div className="modal">
//           <p>You are accepted as a {role}!</p>
//           <button onClick={handleCloseModal}>Next</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Register;


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
  const [termsAccepted, setTermsAccepted] = useState(false);
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
    if (termsAccepted) {
      setShowModal(false);
      if (role === "seller") {
        navigate("/createseller", { state: { username, password, email } });
      } else if (role === "advertiser") {
        navigate("/createadvertiser", { state: { username, password, email } });
      } else if (role === "tourguide") {
        navigate("/tourguide", { state: { username, password, email } });
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
        <div className="modal-overlay">
          <div className="modal">
            <h3>Terms and Conditions</h3>
            <p>Please read and accept the terms and conditions to proceed.</p>
            <div className="terms-content">
              <p>
              <strong>1. Introduction</strong><br />
                Welcome to JetSet! By using our website and services, you agree to these Terms and Conditions...
                1. Use of the Website
Eligibility: You must be at least 18 years old to use our services. By accessing our site, you confirm that you are of legal age.
Account Registration: Some features may require you to register an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
Accuracy of Information: You agree to provide accurate and complete information when registering or using any part of our site.
<br /><strong>2. Services Offered</strong><br />
Our website provides tools to plan virtual and real-world trips, including but not limited to itinerary building, virtual tours, trip bookings, and destination guides. Our services are for informational purposes and should be used at your own discretion.

<br /><strong>3. User Responsibilities</strong><br />
Compliance with Laws: You agree to comply with all applicable laws when using our website and services.
Content Sharing: Any content shared on our site, such as reviews, photos, and travel stories, must be your original work and must not infringe on any third-party rights.
Prohibited Activities: You agree not to use our services for any fraudulent, unlawful, or harmful activities.
<br /><strong>4. Booking and Payment Terms</strong><br />
Third-Party Providers: Our site may feature third-party service providers (e.g., hotels, airlines). We are not responsible for any issues or disputes arising from these third-party services.
Payment Processing: Payments for any trip-related services may be processed by third-party payment systems. By using these services, you agree to their terms.
Cancellations and Refunds: Please review the specific cancellation and refund policies for each booking. These policies vary depending on the provider and may be subject to fees.
<br /><strong>5. Limitation of Liability</strong><br />
No Guarantees: While we strive to offer accurate and reliable information, we make no guarantees regarding the completeness, accuracy, or availability of our services.
Assumption of Risk: You agree that you are using our site at your own risk and that we are not liable for any losses, damages, or injuries resulting from the use of our services or the reliance on any information provided.
<br /><strong>6. Privacy Policy</strong><br />
Your privacy is important to us. Please review our Privacy Policy, which outlines how we collect, use, and protect your information.

<br /><strong>7. Intellectual Property</strong><br />
All content on this website, including text, images, graphics, and logos, is the property of JetSet and is protected by copyright and intellectual property laws. Unauthorized use of our content is prohibited.

<br /><strong>8. Changes to the Terms</strong><br />
We reserve the right to modify or update these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the site constitutes acceptance of the new terms.

<br /><strong>9. Governing Law</strong><br />
These Terms and Conditions are governed by the laws of Egypt, and any disputes will be resolved in the courts of Egypt.

<br /><strong>10. Contact Us</strong><br />
If you have any questions or concerns regarding these Terms and Conditions, please contact us at 12339.

<br /><strong>By using our website and services, you acknowledge that you have read and agreed to these Terms and Conditions.</strong>
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

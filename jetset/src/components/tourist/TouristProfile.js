import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, notification, Spin } from "antd"; // Importing Ant Design components
import { EditOutlined } from "@ant-design/icons";

import NavTourist from "./navTourist";
import UpdatePreferencesForm from "./Prefrences";
import DeleteAccount from "./DeleteAccount";
import SetPreferredCurrency from "./SetPreferredCurrency";
import AddAddress from "./AddAddress";
import ChangePassword from "./ChangePasswordForm";
import LoyaltyPointsForm from "./LoyaltyPoints";

const TouristProfile = () => {
  const { touristId } = useParams();
  const [tourist, setTourist] = useState(null);
  const [updateFields, setUpdateFields] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Adding loading state

  // State to control visibility of components
  const [showUpdatePreferences, setShowUpdatePreferences] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showSetPreferredCurrency, setShowSetPreferredCurrency] =
    useState(false);
  const [showLoyaltyPoints, setShowLoyaltyPoints] = useState(false);

  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/tourist/${touristId}/preferredCurrency"
      );
      setSelectedCurrency(response.data.preferredCurrency);
      setConversionRate(response.data.conversionRate);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        try {
          const response = await axios.get(
            "http://localhost:3000/getTourist/${touristId}"
          );
          setTourist(response.data.tourist);
        } catch (error) {
          notification.error({
            message: "Error",
            description:
              error.response?.data?.message || "Error fetching tourist profile",
          });
        } finally {
          setLoading(false); // Set loading to false after fetch
        }
      }
    };
    fetchTourist();
  }, [touristId]);

  const handleUpdateChange = (e) => {
    setUpdateFields({ ...updateFields, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/updateTourist/${touristId}",
        updateFields
      );
      setTourist((prevTourist) => ({
        ...prevTourist,
        ...response.data,
      }));
      notification.success({
        message: "Success",
        description: "Tourist profile updated!",
      });
      setIsEditing(false);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Error updating tourist profile",
      });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <NavTourist touristId={touristId} username={tourist?.username} />
      <h2
        style={{ marginBottom: "20px", fontSize: "28px", fontWeight: "bold" }}
      >
        Tourist Profile
      </h2>
      {loading ? (
        <Spin size="large" tip="Loading profile..." />
      ) : (
        <div>
          <Card
            style={{
              marginBottom: "20px",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            title={tourist?.username}
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
                style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            }
          >
            <p>
              <strong>Email:</strong> {tourist.email}
            </p>
            <p>
              <strong>Nationality:</strong> {tourist.nationality}
            </p>
            <p>
              <strong>Job:</strong> {tourist.job}
            </p>
            <p>
              <strong>Mobile:</strong> {tourist.mobile_number}
            </p>
            <p>
              <strong>DOB:</strong> {tourist.DOB}
            </p>
            <p>
              <strong>Wallet Balance:</strong>{" "}
              {(tourist.wallet * conversionRate).toFixed(2)} {selectedCurrency}
            </p>
            <p>
              <strong>Loyalty Points:</strong> {tourist.loyaltyPoints}
            </p>
            <p>
              <strong>Badge:</strong> {tourist.badge}
            </p>
            <p>
              <strong>Level:</strong> {tourist.level}
            </p>
          </Card>

          {/* Conditionally show edit form if in edit mode */}
          {isEditing && (
            <Card
              title="Update Profile"
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <form onSubmit={handleUpdateSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="New Email"
                    defaultValue={tourist.email}
                    onChange={handleUpdateChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label>Mobile</label>
                  <input
                    type="text"
                    name="mobile_number"
                    placeholder="New Mobile"
                    defaultValue={tourist.mobile_number}
                    onChange={handleUpdateChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label>Job</label>
                  <input
                    type="text"
                    name="job"
                    placeholder="New Job"
                    defaultValue={tourist.job}
                    onChange={handleUpdateChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label>Wallet</label>
                  <input
                    type="number"
                    name="wallet"
                    placeholder="Wallet Balance"
                    defaultValue={tourist.wallet}
                    onChange={handleUpdateChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                    color: "white",
                  }}
                >
                  Update Profile
                </Button>
              </form>
            </Card>
          )}

          {/* Toggle Buttons */}
          <Button
            onClick={() => setShowUpdatePreferences(!showUpdatePreferences)}
            style={{ marginBottom: "10px" }}
          >
            {showUpdatePreferences ? "Hide Preferences" : "Show Preferences"}
          </Button>
          <Button
            onClick={() => setShowChangePassword(!showChangePassword)}
            style={{ marginLeft: "10px" }}
          >
            {showChangePassword
              ? "Hide Change Password"
              : "Show Change Password"}
          </Button>
          <Button
            onClick={() => setShowDeleteAccount(!showDeleteAccount)}
            style={{ marginLeft: "10px" }}
          >
            {showDeleteAccount ? "Hide Delete Account" : "Show Delete Account"}
          </Button>
          <Button
            onClick={() => setShowAddAddress(!showAddAddress)}
            style={{ marginLeft: "10px" }}
          >
            {showAddAddress ? "Hide Add Address" : "Show Add Address"}
          </Button>
          <Button
            onClick={() =>
              setShowSetPreferredCurrency(!showSetPreferredCurrency)
            }
            style={{ marginLeft: "10px" }}
          >
            {showSetPreferredCurrency
              ? "Hide Preferred Currency"
              : "Show Preferred Currency"}
          </Button>
          <Button
            onClick={() => setShowLoyaltyPoints(!showLoyaltyPoints)}
            style={{ marginLeft: "10px" }}
          >
            {showLoyaltyPoints ? "Hide Loyalty Points" : "Show Loyalty Points"}
          </Button>

          {/* Conditionally Render Components */}
          {showUpdatePreferences && (
            <UpdatePreferencesForm touristId={touristId} />
          )}
          {showChangePassword && <ChangePassword touristId={touristId} />}
          {showDeleteAccount && <DeleteAccount touristId={touristId} />}
          {showAddAddress && <AddAddress touristId={touristId} />}
          {showSetPreferredCurrency && (
            <SetPreferredCurrency touristId={touristId} />
          )}
          {showLoyaltyPoints && <LoyaltyPointsForm touristId={touristId} />}
        </div>
      )}
    </div>
  );
};

export default TouristProfile;
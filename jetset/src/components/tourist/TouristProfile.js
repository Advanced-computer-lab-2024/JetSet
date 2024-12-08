import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, notification, Spin } from "antd";
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
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState();
  const [activeSection, setActiveSection] = useState(""); // Track active section

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/address/${touristId}`
      );
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      notification.error({
        message: "Error",
        description: "Error fetching addresses",
      });
    }
  };

  useEffect(() => {
    fetchAddresses();
  });

  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
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
            `http://localhost:3000/getTourist/${touristId}`
          );
          setTourist(response.data.tourist);
        } catch (error) {
          notification.error({
            message: "Error",
            description:
              error.response?.data?.message || "Error fetching tourist profile",
          });
        } finally {
          setLoading(false);
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
        `http://localhost:3000/updateTourist/${touristId}`,
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    backgroundColor: "#1d3557",
                    borderColor: "#1d3557",
                    marginRight: "10px",
                  }}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <DeleteAccount touristId={touristId} />
              </div>
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

          <Card
            title="Addresses"
            style={{
              marginBottom: "20px",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {addresses.length === 0 ? (
              <p>No addresses added yet.</p>
            ) : (
              <div>
                {addresses.map((address, index) => (
                  <p>
                    <strong>Address {index + 1}:</strong> {address}
                  </p>
                ))}
              </div>
            )}
            <Button
              type="primary"
              onClick={() => setShowAddAddress(!showAddAddress)}
              style={{
                marginTop: "10px",
                backgroundColor: "#1d3557",
                borderColor: "#1d3557",
              }}
            >
              {showAddAddress ? "Hide Add Address Form" : "Add New Address"}
            </Button>
            {showAddAddress && <AddAddress touristId={touristId} />}
          </Card>

          {/* Buttons to toggle visibility */}
          <div style={{ marginBottom: "20px" }}>
            <Button
              type={activeSection === "preferences" ? "primary" : "default"}
              onClick={() =>
                setActiveSection(
                  activeSection === "preferences" ? "" : "preferences"
                )
              }
              style={{ marginRight: "10px" }}
            >
              Preferences
            </Button>
            <Button
              type={activeSection === "changePassword" ? "primary" : "default"}
              onClick={() =>
                setActiveSection(
                  activeSection === "changePassword" ? "" : "changePassword"
                )
              }
              style={{ marginRight: "10px" }}
            >
              Change Password
            </Button>
            <Button
              type={
                activeSection === "setPreferredCurrency" ? "primary" : "default"
              }
              onClick={() =>
                setActiveSection(
                  activeSection === "setPreferredCurrency"
                    ? ""
                    : "setPreferredCurrency"
                )
              }
              style={{ marginRight: "10px" }}
            >
              Preferred Currency
            </Button>
            <Button
              type={activeSection === "loyaltyPoints" ? "primary" : "default"}
              onClick={() =>
                setActiveSection(
                  activeSection === "loyaltyPoints" ? "" : "loyaltyPoints"
                )
              }
            >
              Loyalty Points
            </Button>
          </div>

          {/* Conditionally Render Components */}
          {activeSection === "preferences" && (
            <UpdatePreferencesForm touristId={touristId} />
          )}
          {activeSection === "changePassword" && (
            <ChangePassword touristId={touristId} />
          )}
          {activeSection === "addAddress" && (
            <AddAddress touristId={touristId} />
          )}
          {activeSection === "setPreferredCurrency" && (
            <SetPreferredCurrency touristId={touristId} />
          )}
          {activeSection === "loyaltyPoints" && (
            <LoyaltyPointsForm touristId={touristId} />
          )}
        </div>
      )}
    </div>
  );
};

export default TouristProfile;

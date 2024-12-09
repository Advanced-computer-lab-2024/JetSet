import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Spin, Alert, Button } from "antd";
import { UserOutlined, LinkOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import "./Adv.css";

const { Title, Text } = Typography;

const ReadAdvertiserProfileForm = ({ advertiserID }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the advertiser profile
  const fetchAdvertiserProfile = async (advertiserID) => {
    setLoading(true); // Set loading state before fetching
    try {
      const response = await axios.get(`http://localhost:3000/profiles`);
      setProfile(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching advertiser profile:", err); // Log the full error
      setError(err.response?.data?.message || "Error fetching the profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (advertiserID) {
      fetchAdvertiserProfile(advertiserID);
    }
  }, [advertiserID]);

  // Display loading, error, or profile data
  if (loading) return <Spin tip="Loading profile..." size="large" />;

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px", fontSize: "16px" }}
      />
    );

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <Card
        title={<Title level={2}>Advertiser Profile</Title>}
        bordered={false}
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        {profile ? (
          <div>
            <Title level={3}>{profile.username}</Title>
            <Text type="secondary" style={{ display: "block", marginBottom: "10px" }}>
              <UserOutlined style={{ marginRight: "8px" }} />
              {profile.username}
            </Text>

            <p style={{ fontSize: "16px" }}>
              <strong>Email: </strong> {profile.email}
            </p>

            <p style={{ fontSize: "16px" }}>
              <strong>Company Name: </strong> {profile.company_name}
            </p>

            <p style={{ fontSize: "16px" }}>
              <strong>Website: </strong>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: "#1890ff" }}>
                <LinkOutlined style={{ marginRight: "8px" }} />
                {profile.website}
              </a>
            </p>

            <p style={{ fontSize: "16px" }}>
              <strong>Hotline: </strong>
              <PhoneOutlined style={{ marginRight: "8px" }} />
              {profile.hotline}
            </p>

            <p style={{ fontSize: "16px" }}>
              <strong>Description: </strong>
              <HomeOutlined style={{ marginRight: "8px" }} />
              {profile.companyDescription || "No description available."}
            </p>

            <Button type="primary" style={{ marginTop: "20px" }} onClick={() => alert("Edit Profile Coming Soon!")}>
              Edit Profile
            </Button>
          </div>
        ) : (
          <div>No profile data found.</div>
        )}
      </Card>
    </div>
  );
};

export default ReadAdvertiserProfileForm;

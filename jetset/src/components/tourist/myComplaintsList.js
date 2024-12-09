import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, List, Card, Spin, Typography, message } from "antd";
import ComplaintForm from "./complaintForm"; // Import the ComplaintForm component

const { Title, Paragraph } = Typography;

const MyComplaintList = ({ touristID }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedComplaints, setExpandedComplaints] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/complaints/${touristID}`
        );
        setComplaints(response.data);
      } catch (err) {
        setError("Failed to fetch complaints.");
        message.error("Failed to fetch complaints.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [touristID]);

  const handleToggleDetails = (id) => {
    setExpandedComplaints((prevExpanded) => {
      if (prevExpanded.includes(id)) {
        return prevExpanded.filter((complaintId) => complaintId !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  };

  const handleShowComplaintForm = () => {
    setShowComplaintForm(true);
  };

  return (
    <div>
      <Title level={2}>List of My Complaints</Title>

      {/* Display loading spinner while loading */}
      {loading && <Spin size="large" />}

      {/* Display error message */}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}

      {/* Display list of complaints if available */}
      {!loading && !error && complaints.length > 0 && (
        <List
          dataSource={complaints}
          renderItem={(complaint) => (
            <List.Item
              key={complaint._id}
              onClick={() => handleToggleDetails(complaint._id)}
              style={{ cursor: "pointer" }}
            >
              <Card style={{ width: "100%" }}>
                <Title level={4}>{complaint.title}</Title>
                {expandedComplaints.includes(complaint._id) && (
                  <>
                    <Paragraph>{complaint.body}</Paragraph>
                    <Paragraph>
                      <strong>Date:</strong>{" "}
                      {new Date(complaint.date).toLocaleDateString()}
                    </Paragraph>
                  </>
                )}
                <Paragraph>Status: {complaint.state}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* If there are no complaints */}
      {!loading && !error && complaints.length === 0 && (
        <Typography.Text>No complaints found.</Typography.Text>
      )}

      {/* Button to open complaint form */}
      <Button
        type="primary"
        style={{
          marginTop: "10px",
          backgroundColor: "#1d3557",
          borderColor: "#1d3557",
        }}
        onClick={handleShowComplaintForm}
      >
        File a Complaint
      </Button>

      {/* Show Complaint Form if clicked */}
      {showComplaintForm && <ComplaintForm touristId={touristID} />}
    </div>
  );
};

export default MyComplaintList;

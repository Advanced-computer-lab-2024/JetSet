import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography, Space } from "antd";

// Custom styles for the color
const formStyle = {
  backgroundColor: "#f0f2f5",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const { Title } = Typography;

const ComplaintForm = ({ touristId }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    const complaintData = {
      title: values.title,
      body: values.body,
      date: values.date,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/complaints/${touristId}`,
        complaintData
      );
      messageApi.success(response.data.message);
      // Clear the form after submission
      setTitle("");
      setBody("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      messageApi.error(
        "Failed to file a complaint: " + error.response?.data?.error ||
          error.message
      );
    }
  };

  return (
    <div>
      {contextHolder}
      <Title level={2} style={{ color: "#1d3557" }}>
        File a Complaint
      </Title>
      <Form
        onFinish={handleSubmit}
        initialValues={{
          title,
          body,
          date,
        }}
        layout="vertical"
        style={formStyle}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter the complaint title" },
          ]}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your complaint"
            style={{ borderRadius: "8px", borderColor: "#1d3557" }}
          />
        </Form.Item>

        <Form.Item
          label="Your Complaint"
          name="body"
          rules={[
            {
              required: true,
              message: "Please enter the details of your complaint",
            },
          ]}
        >
          <Input.TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter your complaint details"
            rows={4}
            style={{ borderRadius: "8px", borderColor: "#1d3557" }}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date" }]}
        >
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ borderRadius: "8px", borderColor: "#1d3557" }}
          />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#1d3557",
                borderColor: "#1d3557",
                color: "white",
                borderRadius: "8px",
              }}
            >
              Submit Complaint
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ComplaintForm;

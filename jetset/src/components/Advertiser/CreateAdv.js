import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, notification, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const RegisterForm = () => {
  const location = useLocation();
  const { username = "", password = "", email = "" } = location.state || {};

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Append form values
    Object.keys(values).forEach((key) => {
      if (key === "images") {
        values.images.forEach((file) => formData.append("images", file.originFileObj));
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/addprofiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notification.success({
        message: "Success",
        description: "Profile created successfully!",
      });
      navigate(`/createadvertiser/${response.data._id}`); // Navigate to the advertiser's profile page
    } catch (error) {
      console.error("Error creating the profile:", error);
      setError(error.response ? error.response.data.error : "Something went wrong!");
      notification.error({
        message: "Error",
        description: error.response ? error.response.data.error : "Something went wrong!",
      });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Card
        title="Register as Advertiser"
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ username, password, email }}
        >
          <Form.Item label="Username" name="username">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password readOnly />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" readOnly />
          </Form.Item>
          <Form.Item
            label="Company Name"
            name="company_name"
            rules={[{ required: true, message: "Please enter the company name!" }]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>
          <Form.Item
            label="Website"
            name="website"
            rules={[{ required: true, message: "Please enter the website URL!" }]}
          >
            <Input placeholder="Enter your website URL" />
          </Form.Item>
          <Form.Item
            label="Hotline"
            name="hotline"
            rules={[{ required: true, message: "Please enter the hotline number!" }]}
          >
            <Input placeholder="Enter your hotline number" />
          </Form.Item>
          <Form.Item
            label="Company Description"
            name="companyDescription"
            rules={[{ required: true, message: "Please provide a company description!" }]}
          >
            <TextArea rows={4} placeholder="Enter a description of your company" />
          </Form.Item>
          <Form.Item
            label="Profile Images"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload at least one image!" }]}
          >
            <Upload.Dragger
              name="images"
              multiple
              beforeUpload={() => false} // Prevents automatic upload
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Upload company profile images.</p>
            </Upload.Dragger>
          </Form.Item>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
            }}
          >
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;
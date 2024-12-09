// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { Card, Button, notification, Spin, Avatar, Typography, List, message } from "antd";
// import { EditOutlined, UserOutlined } from "@ant-design/icons";

// import ActivityForm from "../Activity/ActivityProfileAdv";
// import ChangePasswordForm from "./ChangePasswordForm";
// import DeleteAccount from "./DeleteAccount";
// import "./Adv.css";

// const { Title, Text } = Typography;

// const ProfileForm = ({ onProfileCreated }) => {
//   const { id } = useParams();
//   const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     password: "",
//     company_name: "",
//     website: "",
//     hotline: "",
//     companyDescription: "",
//     image: null,
//   });

//   const [advertiser, setAdvertiser] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [showChangePassword, setShowChangePassword] = useState(false);

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) {
//         formDataToSend.append(key, formData[key]);
//       }
//     });

//     try {
//       const response = await axios.put(
//         `${BASE_URL}/updateprofiles/${id}`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setStatusMessage("Profile updated successfully!");
//       setAdvertiser(response.data);
//       message.success("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setStatusMessage("Error updating profile.");
//       message.error("Error updating profile.");
//     }
//   };

//   useEffect(() => {
//     const fetchAdvertiser = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/getAdv/${id}`);
//         setAdvertiser(response.data.adv);
//         setUsername(response.data.username);
//       } catch (err) {
//         setError(
//           err.response ? err.response.data.message : "Error fetching advertiser profile."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdvertiser();
//   }, [BASE_URL, id]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!username) return;
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/notification?recipient=${username}&role=Advertiser`
//         );
//         setNotifications(response.data.notifications);
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [username]);

//   if (loading) return <Spin tip="Loading..." />;

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <Card
//         style={{
//           marginBottom: "20px",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//         title={
//           <Title level={3} style={{ fontSize: "24px" }}>
//             Advertiser Profile
//           </Title>
//         }
//         extra={
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             onClick={() => setShowChangePassword(!showChangePassword)}
//           >
//             Change Password
//           </Button>
//         }
//       >
//         <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
//           {advertiser && advertiser.images ? (
//             <Avatar
//               size={100}
//               src={`http://localhost:3000/uploads/${advertiser.images}`}
//               icon={<UserOutlined />}
//             />
//           ) : (
//             <Avatar size={100} icon={<UserOutlined />} />
//           )}
//         </div>
//         <Title level={4} style={{ fontSize: "22px" }}>
//           {advertiser ? advertiser.username : "No advertiser found"}
//         </Title>
//         <Text style={{ fontSize: "18px" }}>Email: {advertiser?.email || "N/A"}</Text>
//         <br />
//         <Text style={{ fontSize: "18px" }}>Company: {advertiser?.company_name || "N/A"}</Text>
//         <br />
//         <Text style={{ fontSize: "18px" }}>
//           Website:{" "}
//           <a href={advertiser?.website} target="_blank" rel="noopener noreferrer">
//             {advertiser?.website || "N/A"}
//           </a>
//         </Text>
//         <br />
//         <Text style={{ fontSize: "18px" }}>Hotline: {advertiser?.hotline || "N/A"}</Text>
//         <br />
//         <Text style={{ fontSize: "18px" }}>Description: {advertiser?.companyDescription || "N/A"}</Text>
//       </Card>

//       <Card
//         title={<Title level={4} style={{ fontSize: "22px" }}>Notifications</Title>}
//         style={{
//           marginBottom: "20px",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         {error && <Text type="danger" style={{ fontSize: "18px" }}>{error}</Text>}
//         {notifications.length === 0 ? (
//           <Text style={{ fontSize: "18px" }}>No notifications found.</Text>
//         ) : (
//           <List
//             itemLayout="horizontal"
//             dataSource={notifications}
//             renderItem={(notification) => (
//               <List.Item>
//                 <List.Item.Meta
//                   title={<Text style={{ fontSize: "18px" }}>{notification.message}</Text>}
//                   description={<Text style={{ fontSize: "16px" }}>{new Date(notification.createdAt).toLocaleString()}</Text>}
//                 />
//               </List.Item>
//             )}
//           />
//         )}
//       </Card>

//       <ActivityForm onActivityCreated={(activity) => console.log("Activity created:", activity)} />

//       {showChangePassword && <ChangePasswordForm id={id} />}

//       <DeleteAccount advertiserId={id} />
//     </div>
//   );
// };

// export default ProfileForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, notification, Spin, Avatar, Typography, List, message } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";

import ActivityForm from "../Activity/ActivityProfileAdv";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccount from "./DeleteAccount";
import AdvertiserTouristReport from "./AdvertiserTouristReport"; // Import the component
import AdvertiserSalesReport from "./AdvertiserSalesReport"; // Import the component
import "./Adv.css";

const { Title, Text } = Typography;

const ProfileForm = ({ onProfileCreated }) => {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    company_name: "",
    website: "",
    hotline: "",
    companyDescription: "",
    image: null,
  });

  const [advertiser, setAdvertiser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // State to manage visibility of reports
  const [showTouristReport, setShowTouristReport] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/updateprofiles/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatusMessage("Profile updated successfully!");
      setAdvertiser(response.data);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatusMessage("Error updating profile.");
      message.error("Error updating profile.");
    }
  };

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getAdv/${id}`);
        setAdvertiser(response.data.adv);
        setUsername(response.data.username);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching advertiser profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertiser();
  }, [BASE_URL, id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/notification?recipient=${username}&role=Advertiser`
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [username]);

  if (loading) return <Spin tip="Loading..." />;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Card
        style ={{
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        title={
          <Title level={3} style={{ fontSize: "24px" }}>
            Advertiser Profile
          </Title>
        }
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            Change Password
          </Button>
        }
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          {advertiser && advertiser.images ? (
            <Avatar
              size={100}
              src={`http://localhost:3000/uploads/${advertiser.images}`}
              icon={<UserOutlined />}
            />
          ) : (
            <Avatar size={100} icon={<UserOutlined />} />
          )}
        </div>
        <Title level={4} style={{ fontSize: "22px" }}>
          {advertiser ? advertiser.username : "No advertiser found"}
        </Title>
        <Text style={{ fontSize: "18px" }}>Email: {advertiser?.email || "N/A"}</Text>
        <br />
        <Text style={{ fontSize: "18px" }}>Company: {advertiser?.company_name || "N/A"}</Text>
        <br />
        <Text style={{ fontSize: "18px" }}>
          Website:{" "}
          <a href={advertiser?.website} target="_blank" rel="noopener noreferrer">
            {advertiser?.website || "N/A"}
          </a>
        </Text>
        <br />
        <Text style={{ fontSize: "18px" }}>Hotline: {advertiser?.hotline || "N/A"}</Text>
        <br />
        <Text style={{ fontSize: "18px" }}>Description: {advertiser?.companyDescription || "N/A"}</Text>
      </Card>

      <Card
        title={<Title level={4} style={{ fontSize: "22px" }}>Notifications</Title>}
        style={{
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {error && <Text type="danger" style={{ fontSize: "18px" }}>{error}</Text>}
        {notifications.length === 0 ? (
          <Text style={{ fontSize: "18px" }}>No notifications found.</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text style={{ fontSize: "18px" }}>{notification.message}</Text>}
                  description={<Text style={{ fontSize: "16px" }}>{new Date(notification.createdAt).toLocaleString()}</Text>}
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <ActivityForm onActivityCreated={(activity) => console.log("Activity created:", activity)} />

      {showChangePassword && <ChangePasswordForm id={id} />}

      <DeleteAccount advertiserId={id} />

      <Button onClick={() => setShowTouristReport(!showTouristReport)}>
        {showTouristReport ? "Hide Tourist Report" : "Show Tourist Report"}
      </Button>
      {showTouristReport && <AdvertiserTouristReport advertiserId={id} /> }

      <Button onClick={() => setShowSalesReport(!showSalesReport)}>
        {showSalesReport ? "Hide Sales Report" : "Show Sales Report"}
      </Button>
      {showSalesReport && <AdvertiserSalesReport advertiserId={id} />}
    </div>
  );
};

export default ProfileForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import GetSeller from "./Seller/SellerProfile";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import FilterProducts from "./Products/FilterProducts";
import ProductList from "./Products/ProductList";
import SearchProduct from "./Products/SearchProduct";
import SortProducts from "./Products/SortProducts";
import ChangePasswordForm from "./Seller/ChangePasswordForm";
import DeleteAccount from "./Seller/DeleteAccount";
import SellerReport from "./Reports/SellerSalesReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faBoxOpen,
  faPlusCircle,
  faEdit,
  faFilter,
  faSearch,
  faSortAmountDown,
  faChartBar,
  faBell,
  faKey,
  faTrashAlt,
  faSignOutAlt,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";

const SellerFrontend = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("profile");
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/getSellerById/${sellerId}`);
        setUsername(response.data.username);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching username");
      }
    };
    fetchUsername();
  }, [sellerId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `/notification?recipient=${username}&role=Seller`
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { key: "profile", label: "Profile", icon: faStore },
    { key: "products", label: "Products", icon: faBoxOpen },
    { key: "addProduct", label: "Add Product", icon: faPlusCircle },
    { key: "editProduct", label: "Edit Product", icon: faEdit },
    { key: "filterProducts", label: "Filter Products", icon: faFilter },
    { key: "searchProducts", label: "Search Products", icon: faSearch },
    { key: "sortProducts", label: "Sort Products", icon: faSortAmountDown },
    { key: "salesReport", label: "Sales Report", icon: faChartBar },
    { key: "notifications", label: "Notifications", icon: faBell },
    { key: "changePassword", label: "Change Password", icon: faKey },
    { key: "deleteAccount", label: "Delete Account", icon: faTrashAlt },
  ];

  const renderSectionContent = () => {
    switch (currentSection) {
      case "profile":
        return <GetSeller sellerId={sellerId} />;
      case "products":
        return <ProductList />;
      case "addProduct":
        return <AddProduct sellerId={sellerId} />;
      case "editProduct":
        return <EditProduct />;
      case "filterProducts":
        return <FilterProducts />;
      case "searchProducts":
        return <SearchProduct />;
      case "sortProducts":
        return <SortProducts />;
      case "salesReport":
        return <SellerReport sellerId={sellerId} />;
      case "notifications":
        return (
          <div className="card fade-in">
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              Notifications
            </h2>
            {loading && <p className="text-muted">Loading notifications...</p>}
            {error && (
              <p style={{ color: "var(--color-danger)" }}>{error}</p>
            )}
            {!loading && !error && notifications.length === 0 && (
              <p className="text-muted">No notifications found.</p>
            )}
            {!loading && !error && notifications.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 16px",
                      background: "var(--color-surface-alt, #f8f9fc)",
                      borderRadius: "8px",
                      border: "1px solid var(--color-line)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      {notification.message}
                    </p>
                    <p
                      className="text-muted"
                      style={{ margin: "4px 0 0", fontSize: "0.8rem" }}
                    >
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "changePassword":
        return <ChangePasswordForm sellerId={sellerId} />;
      case "deleteAccount":
        return <DeleteAccount sellerId={sellerId} />;
      default:
        return <GetSeller sellerId={sellerId} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FontAwesomeIcon
              icon={faCompass}
              style={{ fontSize: "1.5rem", color: "var(--color-primary-strong)" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-ink)" }}>
                JetSet
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-muted)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Seller Panel
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-link${currentSection === item.key ? " active" : ""}`}
              onClick={() => setCurrentSection(item.key)}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: "18px" }} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "16px 20px",
            borderTop: "1px solid var(--color-line)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary-strong)",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {username ? username.charAt(0).toUpperCase() : "S"}
            </div>
            <span style={{ fontSize: "0.9rem", color: "var(--color-ink)", fontWeight: 500 }}>
              {username || "Seller"}
            </span>
          </div>
          <button
            className="sidebar-link"
            onClick={handleLogout}
            style={{ color: "var(--color-danger)" }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ width: "18px" }} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="content-header">
          <h1 className="section-title" style={{ textTransform: "capitalize" }}>
            {sidebarItems.find((i) => i.key === currentSection)?.label || "Dashboard"}
          </h1>
        </div>
        <div className="fade-in" style={{ marginTop: "16px" }}>
          {renderSectionContent()}
        </div>
      </main>
    </div>
  );
};

export default SellerFrontend;

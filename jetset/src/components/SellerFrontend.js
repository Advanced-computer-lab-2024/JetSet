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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const SellerFrontend = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("profile");
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faCompass} className="sidebar-brand-icon" />
            <div>
              <span className="sidebar-brand-name">JetSet</span>
              <span className="sidebar-brand-role">Seller Panel</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-link${currentSection === item.key ? " active" : ""}`}
              onClick={() => {
                setCurrentSection(item.key);
                setSidebarOpen(false);
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-link-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {username ? username.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{username || "Seller"}</span>
              <span className="sidebar-user-role">Seller Partner</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-header">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
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

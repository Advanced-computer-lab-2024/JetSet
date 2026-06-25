import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminFrontend.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTags,
  faFolderOpen,
  faBoxOpen,
  faExclamationTriangle,
  faChartBar,
  faUsers,
  faUserPlus,
  faSignOutAlt,
  faPlane,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

// Import components for Tag Management
import TagList from "./Tag/TagList";

// Import components for Category Management
import CategoryList from "./Category/CategoryList";

// Import components for Product Management
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import FilterProducts from "./Products/FilterProducts";
import ProductList from "./Products/ProductList";
import SearchProduct from "./Products/SearchProduct";
import SortProducts from "./Products/SortProducts";

// Import new components for Account Management
import DeleteAccount from "./Admin/DeleteAccount";
import CreateAdmin from "./Admin/CreateAdmin";
import CreateTourismGovernor from "./Admin/CreateTourismGovernor";

import GuestList from "./Admin/viewGuest";
import ComplaintList from "./Admin/viewComplaints";

import Itineraries from "./Itinerary/FlagItinerary";
import ActivityList from "./Activity/FlagActivity";

import ComplaintsReply from "./Complaints/ComplaintsReply";
import ComplaintsFilter from "./Complaints/ComplaintsFilter";
import ComplaintsSort from "./Complaints/ComplaintsSort";
import ComplaintsStatus from "./Complaints/ComplaintsStatus";

import SalesReport from "./Reports/AdminSales";
import UserStatistics from "./Reports/UserStatistics";
import AdminRegister from "./Admin/AdminRegister";

const sidebarLinks = [
  { key: "dashboard", label: "Dashboard", icon: faTachometerAlt },
  { key: "tags", label: "Tags", icon: faTags },
  { key: "categories", label: "Categories", icon: faFolderOpen },
  { key: "products", label: "Products", icon: faBoxOpen },
  { key: "complaints", label: "Complaints", icon: faExclamationTriangle },
  { key: "salesReport", label: "Sales Report", icon: faChartBar },
  { key: "userStatistics", label: "User Statistics", icon: faUsers },
  { key: "registerAdmin", label: "Register Admin", icon: faUserPlus },
];

const sectionTitles = {
  dashboard: "Dashboard Overview",
  tags: "Tag Management",
  categories: "Category Management",
  products: "Product Management",
  complaints: "Complaints Management",
  salesReport: "Sales Report",
  userStatistics: "User Statistics",
  registerAdmin: "Register New Admin",
};

function AdminFrontend() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState("");
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(true);
  const [tagError, setTagError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`/getadminbyId/${adminId}`);
        setAdminUsername(response.data.username);
      } catch (error) {
        // silently handle
      }
    };

    fetchAdminData();
  }, [adminId]);

  const fetchTags = async () => {
    setTagLoading(true);
    setTagError(null);
    try {
      const response = await axios.get("/getPreferancetag");
      setTags(response.data);
    } catch (error) {
      setTagError("Error retrieving tags");
    } finally {
      setTagLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      const response = await axios.get("/viewCategory");
      setCategories(response.data);
    } catch (error) {
      setCategoryError("Error retrieving categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductLoading(true);
    setProductError(null);
    try {
      const response = await axios.get("/productsAdmin");
      setProducts(response.data);
    } catch (error) {
      setProductError("Error retrieving products");
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchCategories();
    fetchProducts();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <div className="admin-section-grid">
            <GuestList />
            <CreateAdmin />
            <CreateTourismGovernor />
            <DeleteAccount />
            <ActivityList />
            <Itineraries />
          </div>
        );
      case "tags":
        return <TagList tags={tags} />;
      case "categories":
        return <CategoryList categories={categories} />;
      case "products":
        return (
          <div className="admin-section-grid">
            <AddProduct adminId={adminId} />
            <ProductList products={products} />
            <EditProduct />
            <FilterProducts />
            <SearchProduct />
            <SortProducts products={products} />
          </div>
        );
      case "complaints":
        return (
          <div className="admin-section-grid">
            <ComplaintList />
            <ComplaintsReply />
            <ComplaintsSort />
            <ComplaintsFilter />
            <ComplaintsStatus />
          </div>
        );
      case "salesReport":
        return <SalesReport adminId={adminId} />;
      case "userStatistics":
        return <UserStatistics />;
      case "registerAdmin":
        return <AdminRegister />;
      default:
        return (
          <div className="admin-empty-state">
            <FontAwesomeIcon icon={faTachometerAlt} size="3x" style={{ color: "var(--color-muted)", marginBottom: "1rem" }} />
            <p>Select a section from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faPlane} className="sidebar-brand-icon" />
            <div>
              <span className="sidebar-brand-name">JetSet</span>
              <span className="sidebar-brand-role">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              className={`sidebar-link${currentSection === link.key ? " active" : ""}`}
              onClick={() => setCurrentSection(link.key)}
            >
              <FontAwesomeIcon icon={link.icon} className="sidebar-link-icon" />
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{adminUsername || "Admin"}</span>
              <span className="sidebar-user-role">Administrator</span>
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
          <h1 className="section-title">
            {sectionTitles[currentSection] || "Dashboard"}
          </h1>
        </div>
        <div className="fade-in">{renderSectionContent()}</div>
      </main>
    </div>
  );
}

export default AdminFrontend;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavAdmin from "./Admin/navAdmin";
import "./AdminFrontend.css";

// Import components for Tag Management
import CreateTag from "./Tag/CreateTag";
import TagList from "./Tag/TagList";
import UpdateTag from "./Tag/UpdateTag";
import DeleteTag from "./Tag/DeleteTag";

// Import components for Category Management
import CreateCategory from "./Category/CreateCategory";
import UpdateCategory from "./Category/UpdateCategory";
import DeleteCategory from "./Category/DeleteCategory";
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

import ComplaintList from "./Admin/viewComplaints"; // Assuming this is the correct path and filename

import Itineraries from "./Itinerary/FlagItinerary";
import ActivityList from "./Activity/FlagActivity";

import ComplaintsReply from "./Complaints/ComplaintsReply";
import ComplaintsFilter from "./Complaints/ComplaintsFilter ";
import ComplaintsSort from "./Complaints/ComplaintsSort";
import ComplaintsStatus from "./Complaints/ComplaintsStatus";
function AdminFrontend() {
  const { adminId } = useParams();
  const [adminUsername, setAdminUsername] = useState("");

  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(true);
  const [tagError, setTagError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // Toggle state for each section
  const [showTagActions, setShowTagActions] = useState(false);
  const [showCategoryActions, setShowCategoryActions] = useState(false);
  const [showProductActions, setShowProductActions] = useState(false);
  const [showGuestActions, setShowGuestActions] = useState(false);
  const [showItineraryActions, setShowItineraryActions] = useState(false);
  const [showActivityActions, setShowActivityActions] = useState(false);
  const [showComplaintActions, setshowComplaintActions] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getadminbyId/${adminId}`
        );
        setAdminUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [adminId]);

  const fetchTags = async () => {
    setTagLoading(true);
    setTagError(null);
    try {
      const response = await axios.get(
        "http://localhost:3000/getPreferancetag"
      );
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
      const response = await axios.get("http://localhost:3000/viewCategory");
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
      const response = await axios.get("http://localhost:3000/productsAdmin");
      setProducts(response.data);
    } catch (error) {
      setProductError("Error retrieving products");
    } finally {
      setProductLoading(false);
    }
  };

  const toggleGuestActions = () => {
    setShowGuestActions(!showGuestActions);
  };

  useEffect(() => {
    fetchTags();
    fetchCategories();
    fetchProducts();
  }, []);

  const renderPage = () => {
    return (
      <div>
        <nav>
          <button onClick={() => setCurrentPage("view")}>View</button>
          <button onClick={() => setCurrentPage("Crep")}>Reply</button>
          <button onClick={() => setCurrentPage("Csort")}>Sort</button>
          <button onClick={() => setCurrentPage("Cstatus")}>Status</button>
          <button onClick={() => setCurrentPage("Cfilter")}>Filter</button>
        </nav>
        <div className="complaint-response">
          {currentPage === "view" && <ComplaintList />}
          {currentPage === "Crep" && <ComplaintsReply />}
          {currentPage === "Csort" && <ComplaintsSort />}
          {currentPage === "Cstatus" && <ComplaintsStatus />}
          {currentPage === "Cfilter" && <ComplaintsFilter />}
        </div>
      </div>
    );
  };

  const renderCurrentAction = () => {
    switch (currentAction) {
      case "createAdmin":
        return <CreateAdmin />;
      case "createTourismGovernor":
        return <CreateTourismGovernor />;
      case "deleteAccount":
        return <DeleteAccount />;
      case "back":
        return null;
    }
  };

  return (
    <div className="admin-frontend">
      <NavAdmin adminUsername={adminUsername} />
      <main>
        {/* Account Management Section */}
        <section className="management-section account-management">
          <h2>Account Management</h2>
          <div className="account-actions">
            <button onClick={() => setCurrentAction("createAdmin")}>
              Create Admin
            </button>
            <button onClick={() => setCurrentAction("createTourismGovernor")}>
              Create Tourism Governor
            </button>
            <button onClick={() => setCurrentAction("deleteAccount")}>
              Delete Account
            </button>
          </div>
        </section>
        {/* Render the selected action */}
        <section className="action-display">{renderCurrentAction()}</section>
        {/* Guest Management Section */}
        <section className="management-section guest-management">
          <h2>Guest Management</h2>
          <div className="guest-actions">
            <GuestList />
          </div>
        </section>
        {/* Complaints Management Section */}
        <section className="Complaints-management">
          <h2>Complaints Management</h2>
          <button
            onClick={() => setshowComplaintActions(!showComplaintActions)}
          >
            {showComplaintActions
              ? "Hide Complaint Actions"
              : "Show Complaint Actions"}
          </button>
          {showComplaintActions && renderPage()}
        </section>
        {/* Tag Management Section */}
        <section className="management-section tag-management">
          <h2>Tag Management</h2>

          <button onClick={() => setShowTagActions(!showTagActions)}>
            {showTagActions ? "Hide Tag Actions" : "Show Tag Actions"}
          </button>

          <div className="status-message" aria-live="polite">
            {tagLoading && <p>Loading tags...</p>}
            {tagError && <p className="error">{tagError}</p>}
          </div>
        </section>
        {/* Category Management Section */}
        <section className="management-section category-management">
          <h2>Category Management</h2>
          <button onClick={() => setShowCategoryActions(!showCategoryActions)}>
            {showCategoryActions
              ? "Hide Category Actions"
              : "Show Category Actions"}
          </button>

          <div className="status-message" aria-live="polite">
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p className="error">{categoryError}</p>}
          </div>
        </section>
        {/* Product Management Section */}
        <section className="management-section product-management">
          <h2>Product Management</h2>

          <button onClick={() => setShowProductActions(!showProductActions)}>
            {showProductActions
              ? "Hide Product Actions"
              : "Show Product Actions"}
          </button>
        </section>
        {/* Itinerary Management Section */}
        <section className="management-section itinerary-management">
          <h2>Itinerary Management</h2>

          <button
            onClick={() => setShowItineraryActions(!showItineraryActions)}
          >
            {showItineraryActions
              ? "Hide Itinerary Actions"
              : "Show Itinerary Actions"}
          </button>
        </section>
        {/* Activity Management Section */}
        <section className="management-section activity-management">
          <h2>Activity Management</h2>

          <button onClick={() => setShowActivityActions(!showActivityActions)}>
            {showActivityActions
              ? "Hide Activity Actions"
              : "Show Activity Actions"}
          </button>
        </section>{" "}
        {showTagActions && (
          <div className="tag-actions">
            <CreateTag setTags={setTags} />
            {tags.length > 0 ? (
              <>
                <TagList tags={tags} />
                <UpdateTag tags={tags} />
                <DeleteTag tags={tags} setTags={setTags} />
              </>
            ) : (
              <p>No tags available to update, delete, or display.</p>
            )}
          </div>
        )}
        {showCategoryActions && (
          <div className="category-actions">
            <CreateCategory setCategories={setCategories} />
            {categories.length > 0 ? (
              <>
                <CategoryList categories={categories} />
                <UpdateCategory categories={categories} />
                <DeleteCategory
                  categories={categories}
                  setCategories={setCategories}
                />
              </>
            ) : (
              <p>No categories available to update, delete, or display.</p>
            )}
          </div>
        )}
        {showProductActions && (
          <div className="product-actions">
            <AddProduct adminId={adminId} />
            <EditProduct />
            <FilterProducts />
            <SearchProduct />
            <ProductList
              products={products}
              loading={productLoading}
              error={productError}
            />
            <aside aria-labelledby="sort-products">
              <h3 id="sort-products">Sort Products</h3>
              <SortProducts products={products} />
            </aside>
          </div>
        )}
        {showItineraryActions && <Itineraries />}
        {showActivityActions && <ActivityList />}
      </main>
    </div>
  );
}

export default AdminFrontend;

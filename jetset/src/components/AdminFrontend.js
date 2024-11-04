import React, { useEffect, useState } from "react";
import axios from "axios";

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
import ChangePasswordForm from "./Admin/ChangePasswordForm";

function AdminFrontend() {
  // State for managing tags

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
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [showGuestActions, setShowGuestActions] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

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

  return (
    <div className="admin-frontend">
      <header>
        <h1>Admin Dashboard</h1>
        <p>
          Welcome to the admin dashboard. Manage tags, categories, products, and
          accounts below.
        </p>
      </header>

      <main>
        {/* Account Management Section */}
        <section className="management-section account-management">
          <h2>Account Management</h2>
          <button onClick={() => setShowAccountActions(!showAccountActions)}>
            {showAccountActions
              ? "Hide Account Actions"
              : "Show Account Actions"}
          </button>
          {showAccountActions && (
            <div className="account-actions">
              <DeleteAccount />
              <CreateAdmin />
              <CreateTourismGovernor />
              <ComplaintList />
            </div>
          )}
        </section>
        {/* Button to toggle ChangePasswordForm */}
         <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
            {showChangePasswordForm ? "Hide Change Password" : "Change Password"}
         </button>

      {/* Conditionally render ChangePasswordForm */}
      {showChangePasswordForm && <ChangePasswordForm />}

        {/* Guest Management Section */}
        <section className="management-section guest-management">
          <h2>Guest Management</h2>
          <button onClick={toggleGuestActions}>
            {showGuestActions ? "Hide Guest List" : "View Guest List"}
          </button>
          {showGuestActions && (
            <div className="guest-actions">
              <GuestList />
            </div>
          )}
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
        </section>

        {/* Product Management Section */}
        <section className="management-section product-management">
          <h2>Product Management</h2>
          <button onClick={() => setShowProductActions(!showProductActions)}>
            {showProductActions
              ? "Hide Product Actions"
              : "Show Product Actions"}
          </button>
          {showProductActions && (
            <div className="product-actions">
              <AddProduct />
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
        </section>
      </main>
    </div>
  );
}

export default AdminFrontend;

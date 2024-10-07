import React, { useEffect, useState } from "react";
import axios from "axios";

// Import components for Tag Management
import CreateTag from "./Admin/CreateTag";
import TagList from "./Admin/TagList";
import UpdateTag from "./Admin/UpdateTag";
import DeleteTag from "./Admin/DeleteTag";

// Import components for Category Management
import CreateCategory from "./Admin/CreateCategory ";
import UpdateCategory from "./Admin/UpdateCategory";
import DeleteCategory from "./Admin/DeleteCategory";
import CategoryList from "./Admin/CategoryList ";

// Import components for Product Management
import AddProduct from "./Seller/AddProduct";
import EditProduct from "./Seller/EditProduct";
import FilterProducts from "./Seller/FilterProducts";
import ProductList from "./Seller/ProductList";
import SearchProduct from "./Seller/SearchProduct";
import SortProducts from "./Seller/SortProducts";

// Import new components for account management
import DeleteAccount from "./Admin/DeleteAccount";
import CreateAdmin from "./Admin/CreateAdmin";
import CreateTourismGovernor from "./Admin/CreateTourismGovernor";

function AdminFrontend() {
  // State for managing tags
  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(true);
  const [tagError, setTagError] = useState(null);

  // State for managing categories
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  // State for managing products
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // Fetch tags from the backend
  const fetchTags = async () => {
    setTagLoading(true);
    setTagError(null);

    try {
      const response = await axios.get(
        "http://localhost:3000/getPreferancetag"
      ); // Adjust endpoint as per your API
      setTags(response.data);
    } catch (error) {
      setTagError("Error retrieving tags");
    } finally {
      setTagLoading(false);
    }
  };

  // Fetch categories from the backend
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

  // Fetch products from the backend
  const fetchProducts = async () => {
    setProductLoading(true);
    setProductError(null);

    try {
      const response = await axios.get("http://localhost:3000/getProducts"); // Adjust endpoint as per your API
      setProducts(response.data);
    } catch (error) {
      setProductError("Error retrieving products");
    } finally {
      setProductLoading(false);
    }
  };

  // Fetch tags, categories, and products when the component mounts
  useEffect(() => {
    fetchTags();
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <h1>Admin</h1>
      {/* Tag Management Section */}
      <h2>Tag Management</h2>
      {tagLoading && <p>Loading tags...</p>}
      {tagError && <p style={{ color: "red" }}>{tagError}</p>}
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
      {/* Category Management Section */}
      <h2>Category Management</h2>
      {categoryLoading && <p>Loading categories...</p>}
      {categoryError && <p style={{ color: "red" }}>{categoryError}</p>}
      <CreateCategory setCategories={setCategories} />
      {categories.length > 0 ? (
        <>
          <UpdateCategory categories={categories} />
          <DeleteCategory
            categories={categories}
            setCategories={setCategories}
          />
          <CategoryList categories={categories} />
        </>
      ) : (
        <p>No categories available to update, delete, or display.</p>
      )}
      {/* Product Management Section */}
      <h2>Product Management</h2>
      <AddProduct />
      <EditProduct />
      <FilterProducts />
      <SearchProduct />
      <ProductList
        products={products}
        loading={productLoading}
        error={productError}
      />
      <h2>Sort Products</h2>
      <SortProducts products={products} />{" "}
      {/* Pass products to SortProducts component */}
      {/* Account Management Section */}
      <h2>Account Management</h2>
      <DeleteAccount />
      <CreateAdmin />
      <CreateTourismGovernor />
    </div>
  );
}

export default AdminFrontend;
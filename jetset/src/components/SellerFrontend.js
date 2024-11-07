import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import GetSeller from "./Seller/SellerProfile";
import AddProduct from "./Products/AddProduct"; // Import AddProduct
import EditProduct from "./Products/EditProduct"; // Import EditProduct
import FilterProducts from "./Products/FilterProducts"; // Import FilterProducts
import ProductList from "./Products/ProductList"; // Import ProductList
import SearchProduct from "./Products/SearchProduct"; // Import SearchProduct
import SortProducts from "./Products/SortProducts"; // Import SortProducts
import ChangePasswordForm from "./Seller/ChangePasswordForm";
import DeleteAccount from "./Seller/DeleteAccount";

const SellerFrontend = () => {
  const { sellerId } = useParams(); // Get sellerId from the route parameter
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showFilterProducts, setShowFilterProducts] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [showSortProducts, setShowSortProducts] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div>
      <h1>Seller</h1>
      <GetSeller sellerId={sellerId} /> {/* Pass sellerId here */}
      <button onClick={() => setShowAddProduct(!showAddProduct)}>
        {showAddProduct ? "Cancel Add Product" : "Add Product"}
      </button>
      {showAddProduct && <AddProduct sellerId={sellerId} />}
      <button onClick={() => setShowEditProduct(!showEditProduct)}>
        {showEditProduct ? "Cancel Edit Product" : "Edit Product"}
      </button>
      {showEditProduct && <EditProduct />}
      <button onClick={() => setShowFilterProducts(!showFilterProducts)}>
        {showFilterProducts ? "Cancel Filter" : "Filter Products"}
      </button>
      {showFilterProducts && <FilterProducts />}
      <button onClick={() => setShowProductList(!showProductList)}>
        {showProductList ? "Hide Products" : "Show Products"}
      </button>
      {showProductList && <ProductList />}
      <button onClick={() => setShowSearchProduct(!showSearchProduct)}>
        {showSearchProduct ? "Cancel Search" : "Search Product"}
      </button>
      {showSearchProduct && <SearchProduct />}
      <button onClick={() => setShowSortProducts(!showSortProducts)}>
        {showSortProducts ? "Cancel Sort" : "Sort Products"}
      </button>
      {showSortProducts && <SortProducts />}
      <button onClick={() => setShowChangePassword(!showChangePassword)}>
        {showChangePassword ? "Cancel Password" : "Change Password"}
      </button>
      {showChangePassword && <ChangePasswordForm sellerId={sellerId} />}
      <DeleteAccount sellerId={sellerId} />
    </div>
  );
};

export default SellerFrontend;

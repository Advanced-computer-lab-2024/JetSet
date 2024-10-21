import React, { useState } from "react";

import GetSeller from "./Seller/GetSeller"; // Correct import for GetSeller
import UpdateSeller from "./Seller/UpdateSeller"; // Correct import for UpdateSeller

import AddProduct from "./Products/AddProduct"; // Import AddProduct
import EditProduct from "./Products/EditProduct"; // Import EditProduct
import FilterProducts from "./Products/FilterProducts"; // Import FilterProducts
import ProductList from "./Products/ProductList"; // Import ProductList
import SearchProduct from "./Products/SearchProduct"; // Import SearchProduct
import SortProducts from "./Products/SortProducts"; // Import SortProducts

const SellerFrontend = () => {
  const sellerId = "66fc4923b6a7073d648f1bc0"; // Hardcoded seller ID
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showFilterProducts, setShowFilterProducts] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [showSortProducts, setShowSortProducts] = useState(false);

  return (
    <div>
      <h1>Seller</h1>
      <GetSeller sellerId={sellerId} />
      <button onClick={() => setShowUpdate(!showUpdate)}>
        {showUpdate ? "Cancel Update" : "Update Profile"}
      </button>
      {showUpdate && <UpdateSeller sellerId={sellerId} />}
      <br />

      {/* Button to toggle AddProduct form */}
      <button onClick={() => setShowAddProduct(!showAddProduct)}>
        {showAddProduct ? "Cancel Add Product" : "Add Product"}
      </button>
      {showAddProduct && <AddProduct />}

      {/* Button to toggle EditProduct form */}
      <button onClick={() => setShowEditProduct(!showEditProduct)}>
        {showEditProduct ? "Cancel Edit Product" : "Edit Product"}
      </button>
      {showEditProduct && <EditProduct />}

      {/* Button to toggle FilterProducts */}
      <button onClick={() => setShowFilterProducts(!showFilterProducts)}>
        {showFilterProducts ? "Cancel Filter" : "Filter Products"}
      </button>
      {showFilterProducts && <FilterProducts />}

      {/* Button to toggle ProductList */}
      <button onClick={() => setShowProductList(!showProductList)}>
        {showProductList ? "Hide Products" : "Show Products"}
      </button>
      {showProductList && <ProductList />}

      {/* Button to toggle SearchProduct */}
      <button onClick={() => setShowSearchProduct(!showSearchProduct)}>
        {showSearchProduct ? "Cancel Search" : "Search Product"}
      </button>
      {showSearchProduct && <SearchProduct />}

      {/* Button to toggle SortProducts */}
      <button onClick={() => setShowSortProducts(!showSortProducts)}>
        {showSortProducts ? "Cancel Sort" : "Sort Products"}
      </button>
      {showSortProducts && <SortProducts />}
    </div>
  );
};

export default SellerFrontend;

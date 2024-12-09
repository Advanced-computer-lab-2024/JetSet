import React, { useState, useEffect } from "react";
import { Button, Collapse, Card, Row, Col, Statistic } from "antd"; // Import Ant Design components
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from "react-router-dom";
import GetSeller from "./Seller/SellerProfile";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import FilterProducts from "./Products/FilterProducts";
import ProductList from "./Products/ProductList";
import SearchProduct from "./Products/SearchProduct";
import SortProducts from "./Products/SortProducts";
import ChangePasswordForm from "./Seller/ChangePasswordForm";
import DeleteAccount from "./Seller/DeleteAccount";
import SellerReport from "./Reports/SellerReport";

const { Panel } = Collapse;

const SellerFrontend = () => {
  const { sellerId } = useParams();
  
  // State for sidebar visibility and sections
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showFilterProducts, setShowFilterProducts] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [showSortProducts, setShowSortProducts] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSellerReport, setShowSellerReport] = useState(false);

  const [products, setProducts] = useState([]); // Store products
  const [hasMore, setHasMore] = useState(true);  // Determine if more products can be loaded
  const [page, setPage] = useState(1); // Page for pagination

  // Fetch products (with pagination)
  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?sellerId=${sellerId}&page=${page}`);
      const data = await response.json();
      if (data.products.length === 0) {
        setHasMore(false);  // No more products to load
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Load more products on scroll
  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchProducts(); // Initial load
  }, [page]);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: isSidebarVisible ? "250px" : "0",
          height: "100vh",
          background: "#111",
          color: "#fff",
          overflowX: "hidden",
          transition: "width 0.3s",
          position: "fixed",
          top: "0",
          left: "0",
          padding: isSidebarVisible ? "10px" : "0",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
          onClick={() => setIsSidebarVisible(false)}
        >
          ✖ Close
        </button>
        <ul style={{ listStyle: "none", padding: "0" }}>
          <li>
            <Button type="link" onClick={() => setShowAddProduct(!showAddProduct)}>
              {showAddProduct ? "Cancel Add Product" : "Add Product"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowEditProduct(!showEditProduct)}>
              {showEditProduct ? "Cancel Edit Product" : "Edit Product"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowFilterProducts(!showFilterProducts)}>
              {showFilterProducts ? "Cancel Filter" : "Filter Products"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowProductList(!showProductList)}>
              {showProductList ? "Hide Products" : "Show Products"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowSearchProduct(!showSearchProduct)}>
              {showSearchProduct ? "Cancel Search" : "Search Product"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowSortProducts(!showSortProducts)}>
              {showSortProducts ? "Cancel Sort" : "Sort Products"}
            </Button>
          </li>
          <li>
            <Button type="link" onClick={() => setShowChangePassword(!showChangePassword)}>
              {showChangePassword ? "Cancel Change Password" : "Change Password"}
            </Button>
          </li>
          <li>
            <Button type="link">Delete Account</Button>
          </li>
          {/* Seller Report Button */}
          <li>
            <Button type="link" onClick={() => setShowSellerReport(!showSellerReport)}>
              {showSellerReport ? "Close Seller Report" : "View Seller Report"}
            </Button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: isSidebarVisible ? "250px" : "0", transition: "margin-left 0.3s", width: "100%" }}>
        {/* Toggle Sidebar Button */}
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            position: "absolute",
            top: "10px",
            left: "10px",
          }}
          onClick={() => setIsSidebarVisible(true)}
        >
          ≡
        </button>

        {/* Seller Profile */}
        <GetSeller sellerId={sellerId} />

        <h1>Seller Dashboard</h1>

        {/* Dashboard Grid for Sales Information */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={8}>
            <Card title="Total Sales" bordered={false}>
              <Statistic title="Total Sales" value={112893} prefix="$" />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Products" bordered={false}>
              <Statistic title="Products Listed" value={45} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Sales This Month" bordered={false}>
              <Statistic title="Sales This Month" value={934} prefix="$" />
            </Card>
          </Col>
        </Row>

        {/* Add Seller Report component toggle */}
        {showSellerReport && <SellerReport />}

        {/* Infinite Scroll for Product List */}
        {showProductList && (
          <InfiniteScroll
            dataLength={products.length} // Current number of items
            next={loadMoreProducts} // Function to load more items
            hasMore={hasMore} // Check if more items are available
            loader={<h4>Loading...</h4>} // Loading indicator
            endMessage={<p>No more products to display.</p>} // End of list message
          >
            <ProductList products={products} />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default SellerFrontend;




// import React, { useState } from "react";
// import { useParams } from "react-router-dom"; // Import useParams
// import GetSeller from "./Seller/SellerProfile";
// import AddProduct from "./Products/AddProduct"; // Import AddProduct
// import EditProduct from "./Products/EditProduct"; // Import EditProduct
// import FilterProducts from "./Products/FilterProducts"; // Import FilterProducts
// import ProductList from "./Products/ProductList"; // Import ProductList
// import SearchProduct from "./Products/SearchProduct"; // Import SearchProduct
// import SortProducts from "./Products/SortProducts"; // Import SortProducts
// import ChangePasswordForm from "./Seller/ChangePasswordForm";
// import DeleteAccount from "./Seller/DeleteAccount";

// const SellerFrontend = () => {
//   const { sellerId } = useParams(); // Get sellerId from the route parameter
//   const [showUpdate, setShowUpdate] = useState(false);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [showEditProduct, setShowEditProduct] = useState(false);
//   const [showFilterProducts, setShowFilterProducts] = useState(false);
//   const [showProductList, setShowProductList] = useState(false);
//   const [showSearchProduct, setShowSearchProduct] = useState(false);
//   const [showSortProducts, setShowSortProducts] = useState(false);
//   const [showChangePassword, setShowChangePassword] = useState(false);

//   return (
//     <div>
//       <h1>Seller</h1>
//       <GetSeller sellerId={sellerId} /> {/* Pass sellerId here */}
//       <button onClick={() => setShowAddProduct(!showAddProduct)}>
//         {showAddProduct ? "Cancel Add Product" : "Add Product"}
//       </button>
//       {showAddProduct && <AddProduct sellerId={sellerId} />}
//       <button onClick={() => setShowEditProduct(!showEditProduct)}>
//         {showEditProduct ? "Cancel Edit Product" : "Edit Product"}
//       </button>
//       {showEditProduct && <EditProduct />}
//       <button onClick={() => setShowFilterProducts(!showFilterProducts)}>
//         {showFilterProducts ? "Cancel Filter" : "Filter Products"}
//       </button>
//       {showFilterProducts && <FilterProducts />}
//       <button onClick={() => setShowProductList(!showProductList)}>
//         {showProductList ? "Hide Products" : "Show Products"}
//       </button>
//       {showProductList && <ProductList />}
//       <button onClick={() => setShowSearchProduct(!showSearchProduct)}>
//         {showSearchProduct ? "Cancel Search" : "Search Product"}
//       </button>
//       {showSearchProduct && <SearchProduct />}
//       <button onClick={() => setShowSortProducts(!showSortProducts)}>
//         {showSortProducts ? "Cancel Sort" : "Sort Products"}
//       </button>
//       {showSortProducts && <SortProducts />}
//       <button onClick={() => setShowChangePassword(!showChangePassword)}>
//         {showChangePassword ? "Cancel Password" : "Change Password"}
//       </button>
//       {showChangePassword && <ChangePasswordForm sellerId={sellerId} />}
//       <DeleteAccount sellerId={sellerId} />
//     </div>
//   );
// };

// export default SellerFrontend;

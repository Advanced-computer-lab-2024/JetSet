// import React, { useState, useEffect } from "react";
// import axios from "axios";
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
// import SellerReport from ".Reports/SellerReport"; // Import SellerReport

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
//   const [notifications, setNotifications] = useState([]);
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUsername = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/getSellerById/${sellerId}`
//         );
//         setUsername(response.data.username); // Set the fetched username
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching username");
//       }
//     };

//     fetchUsername();
//   }, [sellerId]);

//   // Fetch notifications after the username is available
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!username) return; // Wait until username is set
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/notification?recipient=${username}&role=Seller`
//         );
//         setNotifications(response.data.notifications);
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [username]); // Run this effect when the username changes

//   return (
//     <div>
//       <h1>Seller</h1>
//       <GetSeller sellerId={sellerId} /> {/* Pass sellerId here */}
//       <div>
//         <h2>Notifications</h2>
//         {/* Show error if it's present */}
//         {error && <p style={{ color: "red" }}>{error}</p>}

//         {/* Show loading spinner/message */}
//         {loading && <p>Loading notifications...</p>}

//         {/* Show no notifications message when no notifications exist */}
//         {!loading && !error && notifications.length === 0 && (
//           <p>No notifications found.</p>
//         )}

//         {/* Render notifications if they exist */}
//         {!loading && !error && notifications.length > 0 && (
//           <ul>
//             {notifications.map((notification, index) => (
//               <li key={index}>
//                 <p>{notification.message}</p>
//                 <p>
//                   <small>
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </small>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
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

import React, { useState, useEffect } from "react";
import axios from "axios";
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
import SellerReport from "./Reports/SellerSalesReport"; // Import SellerReport

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
  const [showSellerReport, setShowSellerReport] = useState(false); // State for SellerReport visibility
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getSellerById/${sellerId}`
        );
        setUsername(response.data.username); // Set the fetched username
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching username");
      }
    };

    fetchUsername();
  }, [sellerId]);

  // Fetch notifications after the username is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return; // Wait until username is set
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/notification?recipient=${username}&role=Seller`
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [username]); // Run this effect when the username changes

  return (
    <div>
      <h1>Seller</h1>
      <GetSeller sellerId={sellerId} /> {/* Pass sellerId here */}
      <div>
        <h2>Notifications</h2>
        {/* Show error if it's present */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Show loading spinner/message */}
        {loading && <p>Loading notifications...</p>}

        {/* Show no notifications message when no notifications exist */}
        {!loading && !error && notifications.length === 0 && (
          <p>No notifications found.</p>
        )}

        {/* Render notifications if they exist */}
        {!loading && !error && notifications.length > 0 && (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <p>{notification.message}</p>
                <p>
                  <small>
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
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
      <button onClick={() => setShowSellerReport(!showSellerReport)}>
        {showSellerReport ? "Hide Sales Report" : "Show Sales Report"}
      </button>
      {showSellerReport && <SellerReport sellerId={sellerId}/>}
    </div>
  );
};

export default SellerFrontend; 

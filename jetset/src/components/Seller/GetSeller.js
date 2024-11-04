import React, { useEffect, useState } from "react";
import axios from "axios";

const GetSeller = ({ sellerId }) => {
  // Accept sellerId as a prop
  const [seller, setSeller] = useState(null); // State to store the fetched seller
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(null); // State for error messages

  // Fetch seller profile based on the sellerId prop
  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/getSellerById/${sellerId}` // Get seller by ID
        );
        setSeller(response.data.seller); // Assuming response.data.seller contains seller info
      } catch (err) {
        console.error("Error retrieving seller profile:", err);
        setError("Error retrieving seller profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId]); // Fetch when sellerId changes

  return (
    <div>
      <h1>Get Seller Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {seller && (
        <div>
          <h2>{seller.username}</h2>
          <p>Email: {seller.email}</p>
          <p>Name: {seller.seller_name}</p>
          <p>Description: {seller.seller_description}</p>
          {seller.images && seller.images.length > 0 && (
            <div>
              <h3>Images:</h3>
              {seller.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3000/uploads/${image}`} // Update this path according to your setup
                  alt={`Seller image ${index + 1}`}
                  style={{ width: "200px", height: "auto", margin: "5px" }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetSeller;

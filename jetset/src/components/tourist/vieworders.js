import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed and imported
import { useLocation } from "react-router-dom";

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const touristId = location.state?.touristId || "6723896c185909fcd367634a";
  const [orders, setOrders] = useState(null); // State for storing orders
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch orders when the component mounts
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/getorders/${touristId}`);
        setOrders(response.data); // Set the fetched orders
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, [touristId]); // Dependency ensures this effect runs when `touristId` changes

  const renderPage = () => {
    switch (currentPage) {
      // ... other cases
      default:
        return (
          <section className="tourist-frontend">
            <h1>Welcome to JetSet</h1>

            <div className="button-groups">
              {/* Other sections */}
              <section>
                <h2>Your Orders</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {orders ? (
                  <div>
                    <div>
                      <h4>Purchased Products:</h4>
                      <ul>
                        {orders.purchasedProducts?.map((product, index) => (
                          <li key={index}>{product.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Booked Itineraries:</h4>
                      <ul>
                        {orders.bookedItineraries?.map((itinerary, index) => (
                          <li key={index}>{itinerary.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Booked Activities:</h4>
                      <ul>
                        {orders.bookedActivities?.map((activity, index) => (
                          <li key={index}>{activity.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p>Loading orders...</p>
                )}
              </section>
            </div>
          </section>
        );
    }
  };

  return <div className="tourist-frontend">{renderPage()}</div>;
};

export default Tourist;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = ({ touristId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
//   const [emptyCartMessage, setEmptyCartMessage] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch cart items (product IDs) from the backend


const fetchCartItems = async () => {
  try {
    console.log("Fetch cart titems:");

    const response = await axios.get(`http://localhost:3000/cart/${touristId}`);
    console.log("Full response:", response);

    if (!response.data || !response.data.cart || response.data.cart.length === 0) {
      console.log("The cart is empty or response is null.");
    //   setEmptyCartMessage(true); // Set the empty cart message state
      setCartItems([]); // Clear the cart items just in case
      setLoading(false);
      return;
    }

    const productIds = response.data.cart; // The 'cart' should be an array of objects with productId and quantity
    console.log("Product IDs:", productIds);

    if (productIds.length > 0) {
      const productsResponse = await axios.post(
        "http://localhost:3000/batchFetch",
        { ids: productIds }
      );
      setCartItems(productsResponse.data.products);
    //   setEmptyCartMessage(false); // Reset empty message if items exist
    } else {
      setCartItems([]); // No items in the cart
    //   setEmptyCartMessage(true);
    }

    setLoading(false);
  } catch (error) {
    // setError("Error fetching cart items");
    setLoading(false);
    console.error("Error fetching cart items:", error);
  }
};
//   };

  // Update item quantity
  const updateQuantity = (e, productId) => {
    const newQuantity = parseInt(e.target.value, 10);

    if (newQuantity < 1) {
      alert("Quantity must be at least 1");
      return; // Prevent updating if the quantity is less than 1
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove an item from the cart
  const removeFromCart = async (productId) => {
    try {
      // Send a request to remove the item from the cart on the backend
      await axios.post(`http://localhost:3000/removeFromCart/${touristId}`, {
        item: productId,
      });

      // Update the local state to remove the item from the cart UI
      setCartItems(cartItems.filter((product) => product._id !== productId));
    } catch (error) {
    //   setError("Error removing item from cart");
      console.error("Error removing item from cart:", error);
    }
  };

  // Handle Checkout (save updated quantities to the backend)
  const handleCheckout = async () => {
    try {
      // Send updated quantities to the backend
      const updatedCart = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      if (updatedCart.length === 0) {
        console.error("Cart is empty");
        return;
      }
      console.log("Cart response:", updatedCart);
      console.log("Payload:", { products: updatedCart });

      const products= {updatedCart};
      console.log("Payload being sent:", products );
    //   console.log("Tourist Id:", touristId);
   
      const checkoutResponse = await axios.post(`http://localhost:3000/checkout/${touristId}`, products);

      alert("Checkout successful!");
    } catch (error) {
    //   setError("Error during checkout HEREEE");
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>

      {loading ? (
        <p>Loading cart...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="4">No items in your cart.</td>
                </tr>
              ) : (
                cartItems.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      {/* Input for quantity */}
                      <input
                        type="number"
                        value={product.quantity}
                        min="1" // Ensure quantity is at least 1
                        onChange={(e) => updateQuantity(e, product._id)}
                      />
                    </td>
                    <td>
                      <button onClick={() => removeFromCart(product._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Checkout button */}
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;

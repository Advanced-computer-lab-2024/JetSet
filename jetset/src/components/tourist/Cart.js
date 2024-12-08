import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QRqvnLaP0939m1yMtkhu1iljNRs7gNXmNvljQEXF0eIRBM1zfzukqyTYtVG78YIkdf8qe3K4sPMsTQlG0lV7rvj00Tqpogk3L"
);

const PaymentForm = ({ touristId, items, onSuccess,onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const endpoint = `/payCardPro/${touristId}`;
      const response = await axios.post(endpoint, { products:items,isApplied: false,promoCode: "",});

      const { clientSecret } = response.data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (error) {
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Pay with Credit Card</h3>
      <CardElement options={cardElementOptions}  />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button
        type="submit"
        style={buttonStyle}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
      <button type="button" onClick={onClose} style={cancelButtonStyle}>
        Cancel
      </button>
    </form>
  );
};


const Cart = ({ touristId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Payment Modal visibility state
  const [currentItems, setCurrentItems] = useState([]); // Items to send for payment
  const [paymentType, setPaymentType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // Payment Status (Success/Error)
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  
//   const [emptyCartMessage, setEmptyCartMessage] = useState(false);

  // Fetch conversion rate and currency info
  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set currency
      setConversionRate(response.data.conversionRate); // Set conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  // Convert price using the conversion rate
  const convertPrice = (price) => {
    return (price * conversionRate).toFixed(2); // Returns the converted price
  };

  // Fetch tourist data and booked items
  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(`/getTourist/${touristId}`);
        setWalletBalance(response.data.wallet);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };
    fetchTouristData();
    fetchConversionRate(); // Fetch currency and conversion rate when component mounts
  }, [touristId]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePaymentChoice = (type) => {
    if (type === "Wallet") {
      setPaymentType(type);
      setShowPaymentModal(false);
      setShowConfirmModal(true); // Show confirmation modal for wallet payment
    } else if (type === "Card") {
      setPaymentType(type);
      setShowPaymentModal(false);
      setShowStripeForm(true); // Show Stripe payment form
    } else {
      alert(`You chose to pay with: ${type}`);
      setShowPaymentModal(false);
    }
  };

  const confirmWalletPayment = async () => {
    try {
      // Prepare the cart items and their quantities to send to the backend
      const cartData = cartItems.map(item => ({
        productId: item._id,   // Send the product ID
        quantity: item.quantity // Send the quantity
      }));
  
      // Send the cart data in the request body
      const response = await axios.post(`/payWalletPro/${touristId}`, 
      {
        products: currentItems, // Pass the products with quantities
        isApplied: false, // Adjust this based on your promo code logic
        promoCode: "", // Replace with the actual promo code if applicable
      });
  
      setWalletBalance(response.data.wallet); // Update wallet balance
      setPaymentStatus("success"); // Set the payment status to success
    } catch (error) {
      setPaymentStatus("error"); // Set the payment status to error
      console.error("Error during wallet payment:", error);
    }
  };
  

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
      setCurrentItems(updatedCart);
      setShowPaymentModal(true); // Open payment modal
      //console.log("Cart response:", updatedCart);
      //console.log("Payload:", { products: updatedCart });

      const products= {updatedCart};
      console.log("Payload being sent:", currentItems );
    //   console.log("Tourist Id:", touristId);
   
      const checkoutResponse = await axios.post(`http://localhost:3000/checkout/${touristId}`, products);

      //alert("Checkout successful!");
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
                    <td>{convertPrice(product.price)} {selectedCurrency}</td>
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
          <h3>Total: {convertPrice(calculateTotalAmount())} {selectedCurrency}</h3>

          {/* Checkout button */}
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
      {showPaymentModal && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            <h2>Choose Payment Method</h2>
            <div style={paymentOptionsStyle}>
              <button
                style={paymentButtonStyle("Wallet")}
                onClick={() => handlePaymentChoice("Wallet")}
              >
                💵 Wallet
              </button>
              <button
                style={paymentButtonStyle("Cash")}
                onClick={() => handlePaymentChoice("Cash")}
              >
                🚪 Cash on Delivery
              </button>
              <button
                style={paymentButtonStyle("Card")}
                onClick={() => handlePaymentChoice("Card")}
              >
                💳 Credit Card
              </button>
            </div>
            <button
              style={closeButtonStyle}
              onClick={() => setShowPaymentModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showStripeForm && (
  <div style={backdropStyle}>
    <div style={modalStyle}>
      <h2>Credit Card Payment</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm
          touristId={touristId}
          item={currentItems}
          onSuccess={() => {
            setShowStripeForm(false);
            setPaymentStatus("success");
          }}
          onClose={() => setShowStripeForm(false)}
        />
      </Elements>
    </div>
  </div>
)}
     {/* {showConfirmModal && (
        <div style={{backdropStyle}}>
          <div style={{modalStyle}}>
          {paymentStatus === "" && (
              <>
            <h2>Confirm Payment</h2>
            {cartItems.map(item => (
              <p key={item._id}>
                {item.name} - {item.quantity} x {convertPrice(item.price)} {selectedCurrency}
              </p>
            ))}
            <p><strong>Total: </strong>{convertPrice(calculateTotalAmount())} {selectedCurrency}</p>
            <p>Your wallet balance: {walletBalance} EGP</p>
            <div>
              <button onClick={confirmWalletPayment}>Yes, Pay</button>
              <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button
                    style={cancelButtonStyle}
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
              </button>
            </div>
            </>
            )}
            {paymentStatus === "success" && (
              <>
                <h2>Payment Successful</h2>
                <p>Your updated wallet balance: {walletBalance} EGP</p>
                <button
                  style={confirmButtonStyle}
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPaymentStatus(""); // Reset status for next payment
                  }}
                >
                  Close
                </button>
              </>
            )}
            {paymentStatus === "error" && (
              <>
                <h2>Payment Failed</h2>
                <p>
                  There was an issue processing your payment. Please try again.
                </p>
                <button
                  style={closeButtonStyle}
                  onClick={() => setShowConfirmModal(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )} */}

{showConfirmModal && (
  <div style={backdropStyle}>
    <div style={responsiveModalStyle}>  {/* Use responsive modal style */}
      {paymentStatus === "" && (
        <>
          <h2>Confirm Payment</h2>
          {cartItems.map(item => (
            <p key={item._id}>
              {item.name} - {item.quantity} x {convertPrice(item.price)} {selectedCurrency}
            </p>
          ))}
          <p><strong>Total: </strong>{convertPrice(calculateTotalAmount())} {selectedCurrency}</p>
          <p>Your wallet balance: {walletBalance} EGP</p>
          <div style={paymentOptionsStyle}>
            <button onClick={confirmWalletPayment}>Yes, Pay</button>
            <button
              style={cancelButtonStyle}
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {paymentStatus === "success" && (
        <>
          <h2>Payment Successful</h2>
          <p>Your updated wallet balance: {walletBalance} EGP</p>
          <button
            style={confirmButtonStyle}
            onClick={() => {
              setShowConfirmModal(false);
              setPaymentStatus(""); // Reset status for next payment
            }}
          >
            Close
          </button>
        </>
      )}
      {paymentStatus === "error" && (
        <>
          <h2>Payment Failed</h2>
          <p>
            There was an issue processing your payment. Please try again.
          </p>
          <button
            style={closeButtonStyle}
            onClick={() => setShowConfirmModal(false)}
          >
            Close
          </button>
        </>
      )}
    </div>
  </div>
)}

      
    </div>
  );
};

// const backdropStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   zIndex: 1000,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const modalStyle = {
//   backgroundColor: "#ffffff",
//   padding: "30px",
//   borderRadius: "10px",
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//   width: "400px",
//   textAlign: "center",
// };

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000, // Make sure it's on top of everything else
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  width: "90%",  // Use percentage width to allow responsiveness
  maxWidth: "400px", // Set a maximum width
  textAlign: "center",
  overflowY: "auto", // Ensure that content within the modal doesn't overflow
};

// Add responsive adjustments to the modal styles for smaller screens
const responsiveModalStyle = {
  ...modalStyle,
  width: "90%",   // Ensure modal width is responsive
  maxWidth: "500px",  // Ensure it doesn’t go too wide on larger screens
};



const paymentOptionsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const paymentButtonStyle = (type) => ({
  backgroundColor:
    type === "Wallet"
      ? "#4CAF50"
      : type === "Cash"
      ? "#FFC107"
      : type === "Card"
      ? "#2196F3"
      : "#ddd",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1em",
});

const confirmButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1em",
};

const cancelButtonStyle = {
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1em",
};

const closeButtonStyle = {
  marginTop: "20px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1em",
};

// Styles for the payment form
const formStyle = {
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  backgroundColor: "#fff",
  maxWidth: "400px",
  margin: "auto",
};

const buttonStyle = {
  marginTop: "10px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

export default Cart;

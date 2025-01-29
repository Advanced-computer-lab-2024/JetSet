import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PaidItemsView from "./PaidItemsView";

const stripePromise = loadStripe(
  "pk_test_51QRqvnLaP0939m1yMtkhu1iljNRs7gNXmNvljQEXF0eIRBM1zfzukqyTYtVG78YIkdf8qe3K4sPMsTQlG0lV7rvj00Tqpogk3L"
);

const PaymentForm = ({
  touristId,
  item,
  itemType,
  onSuccess,
  onClose,
  promoCode,
  setPromoCode,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [payedItineraries, setPayedItineraries] = useState([]); // New state for paid itineraries
  const [payedActivities, setPayedActivities] = useState([]); // New state for paid activities

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // Determine the endpoint based on itemType
      const endpoint =
        itemType === "activity"
          ? `http://localhost:3000/payCardAct/${touristId}/${item._id}`
          : `http://localhost:3000/payCardIti/${touristId}/${item._id}`;

      const response = await axios.post(endpoint, {
        isApplied: promoCode ? true : false, // Adjust based on promo code presence
        promoCode: promoCode || "", // Pass the promo code if exists
      });

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (error) {
      setErrorMessage("succeeded.");
    } finally {
      setIsProcessing(false);
    }
  };

  // return (
  //   <form onSubmit={handleSubmit} style={formStyle}>
  //     <h3>Pay with Credit Card</h3>
  //     <CardElement options={cardElementOptions}  />
  //     {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
  //     <button
  //       type="submit"
  //       style={buttonStyle}
  //       disabled={isProcessing || !stripe || !elements}
  //     >
  //       {isProcessing ? "Processing..." : "Pay Now"}
  //     </button>
  //     <button type="button" onClick={onClose} style={cancelButtonStyle}>
  //       Cancel
  //     </button>
  //   </form>
  // );

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Pay with Credit Card</h3>
      <CardElement options={cardElementOptions} />

      {/* Promo Code Input */}
      <div>
        <label htmlFor="promoCode">Promo Code:</label>
        <input
          type="text"
          id="promoCode"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
        />
      </div>

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

const BookedItems = ({ touristId }) => {
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]);
  const [payedItineraries, setPayedItineraries] = useState([]); // New state for paid itineraries
  const [payedActivities, setPayedActivities] = useState([]); // New state for paid activities
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [itemType, setItemType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // New state for payment status
  const [cancelStatus, setCancelStatus] = useState(""); // New state for cancellation status
  const [showCancelModal, setShowCancelModal] = useState(false); // Modal visibility
  const [cancelMessage, setCancelMessage] = useState(""); // Message for modal
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [promoCode, setPromoCode] = useState(""); // State for storing promo code input
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

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
        const response = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );
        setWalletBalance(response.data.tourist.wallet);
        setPayedItineraries(response.data.tourist.payedItineraries);
        setPayedActivities(response.data.tourist.payedActivities);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };
    const fetchBookedItems = async () => {
      try {
        const itinerariesResponse = await axios.get(
          `http://localhost:3000/bookedIti/${touristId}`
        );
        setBookedItineraries(itinerariesResponse.data.bookedItineraries);

        const activitiesResponse = await axios.get(
          `http://localhost:3000/bookedAct/${touristId}`
        );
        setBookedActivities(activitiesResponse.data.bookedActivities);
      } catch (error) {
        setError("Error fetching booked items");
      }
    };
    fetchTouristData();
    fetchBookedItems();
    fetchConversionRate(); // Fetch currency and conversion rate when component mounts
  }, [touristId]);

  const isItemPaid = (itemId, paidList) => {
    return Array.isArray(paidList) && paidList.some((id) => id === itemId);
  };

  const cancelItineraryBooking = async (itineraryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/cancelItinerary/${touristId}/${itineraryId}`
      );
      setBookedItineraries((prev) =>
        prev.filter((itinerary) => itinerary._id !== itineraryId)
      );
      const updatedWallet = response.data.wallet;
      setWalletBalance(updatedWallet); // Update wallet balance in state
      setCancelMessage(
        `Itinerary booking cancelled successfully. Updated wallet balance: ${updatedWallet} EGP`
      );
      setCancelStatus("success");
    } catch (error) {
      setCancelMessage(
        error.response?.data?.message || "Error cancelling itinerary"
      );
      setCancelStatus("error");
    } finally {
      setShowCancelModal(true); // Show modal with results
    }
  };

  const cancelActivityBooking = async (activityId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/cancelActivity/${touristId}/${activityId}`
      );
      setBookedActivities((prev) =>
        prev.filter((activity) => activity._id !== activityId)
      );
      const updatedWallet = response.data.wallet;
      setWalletBalance(updatedWallet); // Update wallet balance in state
      setCancelMessage(
        `Activity booking cancelled successfully. Updated wallet balance: ${updatedWallet} EGP`
      );
      setCancelStatus("success");
    } catch (error) {
      setCancelMessage(
        error.response?.data?.message || "Error cancelling activity"
      );
      setCancelStatus("error");
    } finally {
      setShowCancelModal(true); // Show modal with results
    }
  };

  const handlePayClick = (item, type) => {
    setCurrentItem(item);
    setItemType(type); // Set the type as activity or itinerary
    setShowPaymentModal(true);
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
      let response;

      if (itemType === "activity") {
        response = await axios.post(
          `http://localhost:3000/payWalletAct/${touristId}/${currentItem._id}`,
          {
            isApplied: promoCode ? true : false, // Pass promo code status
            promoCode: promoCode || "", // Send promo code if exists
          }
        );
      } else if (itemType === "itinerary") {
        response = await axios.post(
          `http://localhost:3000/payWalletIti/${touristId}/${currentItem._id}`,
          {
            isApplied: promoCode ? true : false, // Pass promo code status
            promoCode: promoCode || "", // Send promo code if exists
          }
        );
      } else {
        throw new Error("Invalid payment type");
      }

      setWalletBalance(response.data.wallet); // Update wallet balance
      setPaymentStatus("success");
    } catch (error) {
      setPaymentStatus("error");
    }
  };

  return (
    <div>
      {/* History Button */}
      <button
        onClick={toggleHistory}
        style={{
          position: "absolute",
          top: "50px", // Lowered the button
          right: "10px",
          backgroundColor: "#1d3557", // Updated color
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {showHistory ? "Close History" : "View History"}
      </button>

      {/* Show PaidItemView */}
      {showHistory && (
        <div
          style={{
            position: "absolute",
            top: "110px", // Lowered the container to match the button
            right: "10px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "5px",
            zIndex: 10,
            maxWidth: "400px",
            overflowY: "auto",
            maxHeight: "400px",
          }}
        >
          <PaidItemsView touristId={touristId} />
        </div>
      )}

      <h2>Booked Itineraries</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookedItineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h3>{itinerary.name}</h3>
            <p>{itinerary.description}</p>
            <p>
              Price: {convertPrice(itinerary.budget)} {selectedCurrency}
            </p>
            {isItemPaid(itinerary._id, payedItineraries) ? (
              <p style={{ color: "green", fontWeight: "bold" }}>Already Paid</p>
            ) : (
              <button onClick={() => handlePayClick(itinerary, "itinerary")}>
                Pay
              </button>
            )}
            <button onClick={() => cancelItineraryBooking(itinerary._id)}>
              Cancel Booking
            </button>
          </li>
        ))}
      </ul>

      <h2>Booked Activities</h2>
      <ul>
        {bookedActivities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <p>
              Price: {convertPrice(activity.budget)} {selectedCurrency}
            </p>
            {isItemPaid(activity._id, payedActivities) ? (
              <p style={{ color: "green", fontWeight: "bold" }}>Already Paid</p>
            ) : (
              <button onClick={() => handlePayClick(activity, "activity")}>
                Pay
              </button>
            )}
            {/* <button onClick={() => handlePayClick(activity, "activity")}>Pay</button> */}
            <button onClick={() => cancelActivityBooking(activity._id)}>
              Cancel Booking
            </button>
          </li>
        ))}
      </ul>

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
              {/* <button
                style={paymentButtonStyle("Cash")}
                onClick={() => handlePaymentChoice("Cash")}
              >
                🚪 Cash on Delivery
              </button> */}
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

      {/* Stripe Payment Form in Modal */}
      {showStripeForm && currentItem && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            <h2>Credit Card Payment</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                touristId={touristId}
                item={currentItem}
                itemType={itemType}
                onSuccess={() => {
                  setShowStripeForm(false);
                  setPaymentStatus("success");
                }}
                onClose={() => setShowStripeForm(false)}
                promoCode={promoCode} // Pass promo code state
                setPromoCode={setPromoCode} // Pass function to update promo code state
              />
            </Elements>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            {paymentStatus === "" && (
              <>
                <h2>Confirm Payment</h2>
                <p>
                  Are you sure you want to pay for{" "}
                  {currentItem?.name || currentItem?.title} using your wallet?
                </p>
                <p>Your wallet balance: {walletBalance} EGP</p>
                <p>
                  <strong>Amount to be paid:</strong>{" "}
                  {convertPrice(currentItem?.budget)} {selectedCurrency}
                </p>
                <div style={formStyle}>
                  <label htmlFor="promoCode">Promo Code (Optional): </label>
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    style={{
                      padding: "10px",
                      width: "100%",
                      marginTop: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div style={paymentOptionsStyle}>
                  <button
                    style={confirmButtonStyle}
                    onClick={confirmWalletPayment}
                  >
                    Yes, Pay
                  </button>
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
                <p>
                  You have successfully paid for{" "}
                  {currentItem?.name || currentItem?.title}.
                </p>
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
      {showCancelModal && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            {cancelStatus === "success" ? (
              <>
                <h2>Cancellation Successful</h2>
                <p>{cancelMessage}</p>
              </>
            ) : (
              <>
                <h2>Cancellation Failed</h2>
                <p>{cancelMessage}</p>
              </>
            )}
            <button
              style={confirmButtonStyle}
              onClick={() => setShowCancelModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Styles (same as before)
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  width: "400px",
  textAlign: "center",
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

export default BookedItems;

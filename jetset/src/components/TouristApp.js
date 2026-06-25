import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import NavTourist from "./tourist/navTourist";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faCompass,
  faRoute,
  faLandmark,
  faTicketAlt,
  faCalendarCheck,
  faShoppingBag,
  faReceipt,
  faShoppingCart,
  faHeart,
  faBox,
  faExclamationCircle,
  faSignOutAlt,
  faPlane,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import ActivityList from "./Activity/ActivitiesList";
import ItineraryList from "./Itinerary/ItineraryTourist";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent";
import ProductList from "./Products/productTourist";
import TouristProducts from "./Products/RateReview";
import MyComplaintList from "./tourist/myComplaintsList";
import RatingForm from "./tourist/RatingForm";
import RateandcommentActivity from "./tourist/RateandcommentActivity";
import RateandcommentItinerary from "./tourist/RateandcommentItinerary";
import ShareItem from "./tourist/ShareItem";
import ActivityByCategory from "./Activity/ActivitiesByCategory";
import BookedItineraries from "./tourist/BookedItineraries";
import VacationGuide from "./tourist/VacationGuide";
import Cart from "./tourist/Cart";
import PaidItemsView from "./tourist/PaidItemsView";
import Wishlist from "./tourist/Wishlist";
import BookSection from "./BookSection";
import Orders from "./tourist/Orders";

const sidebarGroups = [
  {
    label: "Explore",
    items: [
      { key: "Home", label: "Home", icon: faHome },
      { key: "search", label: "Search", icon: faSearch },
      { key: "activityList", label: "Activities", icon: faCompass },
      { key: "itineraryList", label: "Itineraries", icon: faRoute },
      { key: "historicalPlaces", label: "Places", icon: faLandmark },
    ],
  },
  {
    label: "Booking",
    items: [
      { key: "book", label: "Book", icon: faTicketAlt },
      { key: "mybooking", label: "My Bookings", icon: faCalendarCheck },
    ],
  },
  {
    label: "Shopping",
    items: [
      { key: "productList", label: "Products", icon: faShoppingBag },
      { key: "touristProduct", label: "Purchased", icon: faReceipt },
      { key: "cart", label: "Cart", icon: faShoppingCart },
      { key: "Wishlist", label: "Wishlist", icon: faHeart },
      { key: "Orders", label: "Orders", icon: faBox },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "MyComplaintsList", label: "Complaints", icon: faExclamationCircle },
    ],
  },
];

const HomePage = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getActivities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/preferences/${touristId}`);
        setActivities(response.data);
      } catch (error) {
        // silently handle
      } finally {
        setLoading(false);
      }
    };

    getActivities();
  }, [touristId]);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="tourist-empty-state">
        <FontAwesomeIcon icon={faCompass} size="3x" style={{ color: "var(--color-muted)", marginBottom: "12px" }} />
        <h3>No Recommended Activities</h3>
        <p>Start exploring to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="tourist-section-heading">Recommended Activities</h2>
      <div className="tourist-activity-grid">
        {activities.map((activity) => (
          <div key={activity._id} className="tourist-activity-card">
            <div className="tourist-activity-img-wrap">
              <img
                alt={activity.title}
                src={activity.image || "https://placehold.co/400x240/e2e8f0/64748b?text=Activity"}
              />
            </div>
            <div className="tourist-activity-body">
              <h3>{activity.title}</h3>
              <div className="tourist-activity-meta">
                <span><strong>Budget:</strong> ${activity.budget}</span>
                <span><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</span>
                {activity.time && <span><strong>Time:</strong> {activity.time}</span>}
                {activity.location && <span><strong>Location:</strong> {activity.location}</span>}
                {activity.category?.name && <span><strong>Category:</strong> {activity.category.name}</span>}
                {activity.special_discount && <span><strong>Discount:</strong> {activity.special_discount}</span>}
                <span><strong>Booking:</strong> {activity.booking_open ? "Open" : "Closed"}</span>
              </div>
              {activity.ratings?.length > 0 && (
                <div className="tourist-activity-ratings">
                  <strong>Ratings:</strong>
                  <ul>
                    {activity.ratings.map((rating) => (
                      <li key={rating._id}>
                        ⭐ {rating.rating}
                        {rating.comment && <span> — {rating.comment}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const touristId = location.state?.touristId;
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        setLoading(true);
        try {
          const response = await axios.get(`/getTourist/${touristId}`);
          setUsername(response.data.username);
        } catch (error) {
          alert(
            error.response?.data?.message || "Error fetching tourist profile"
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTourist();
  }, [touristId]);

  const handleLogout = () => {
    navigate("/login");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePage touristId={touristId} />;
      case "productList":
        return <ProductList touristId={touristId} />;
      case "activityList":
        return <ActivityList touristId={touristId} />;
      case "itineraryList":
        return <ItineraryList touristId={touristId} />;
      case "historicalPlaces":
        return <HistoricalPlaces touristId={touristId} />;
      case "search":
        return <Search touristId={touristId} />;
      case "touristProduct":
        return <TouristProducts touristId={touristId} />;
      case "Wishlist":
        return <Wishlist touristId={touristId} />;
      case "ActivityByCategory":
        return <ActivityByCategory touristId={touristId} />;
      case "ShareItem":
        return <ShareItem />;
      case "MyComplaintsList":
        return <MyComplaintList touristID={touristId} />;
      case "ratingForm":
        return <RatingForm touristId={touristId} />;
      case "RateandcommentActivity":
        return <RateandcommentActivity touristId={touristId} />;
      case "RateandcommentItinerary":
        return <RateandcommentItinerary touristId={touristId} />;
      case "book":
        return <BookSection touristId={touristId} />;
      case "mybooking":
        return <BookedItineraries touristId={touristId} />;
      case "vacationGuide":
        return <VacationGuide touristId={touristId} />;
      case "cart":
        return <Cart touristId={touristId} />;
      case "viewPaid":
        return <PaidItemsView touristId={touristId} />;
      case "Orders":
        return <Orders touristId={touristId} />;
      default:
        return <HomePage touristId={touristId} />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faPlane} className="sidebar-brand-icon" />
            <div>
              <span className="sidebar-brand-name">JetSet</span>
              <span className="sidebar-brand-role">Tourist</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarGroups.map((group) => (
            <React.Fragment key={group.label}>
              <div className="sidebar-nav-group">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className={`sidebar-link${currentPage === item.key || (!currentPage && item.key === "Home") ? " active" : ""}`}
                  onClick={() => {
                    setCurrentPage(item.key);
                    setSidebarOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} className="sidebar-link-icon" />
                  <span>{item.label}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{username || "Tourist"}</span>
              <span className="sidebar-user-role">Traveler</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="content-header">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <NavTourist touristId={touristId} username={username} />
        </header>
        <div className="fade-in">
          {loading ? (
            <div style={{ display: "grid", placeItems: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            renderPage()
          )}
        </div>
      </main>

      <style>{`
        .tourist-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }
        .tourist-empty-state h3 {
          margin-bottom: 4px;
        }
        .tourist-section-heading {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-primary-strong);
          margin-bottom: 20px;
        }
        .tourist-activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .tourist-activity-card {
          background: #fff;
          border: 1px solid var(--color-line);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .tourist-activity-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .tourist-activity-img-wrap img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }
        .tourist-activity-body {
          padding: 16px 18px;
        }
        .tourist-activity-body h3 {
          font-size: 1.1rem;
          margin-bottom: 10px;
          color: var(--color-primary-strong);
        }
        .tourist-activity-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 16px;
          font-size: 0.82rem;
          color: var(--color-muted);
          margin-bottom: 10px;
        }
        .tourist-activity-ratings {
          font-size: 0.82rem;
          color: var(--color-muted);
          border-top: 1px solid var(--color-line);
          padding-top: 10px;
          margin-top: 8px;
        }
        .tourist-activity-ratings ul {
          margin-top: 4px;
        }
        .tourist-activity-ratings li {
          background: none;
          border: none;
          box-shadow: none;
          padding: 3px 0;
          margin-bottom: 2px;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default Tourist;

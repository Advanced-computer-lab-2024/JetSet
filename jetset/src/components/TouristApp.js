import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Layout, Menu, Button, Card, Row, Col, Typography, Spin } from "antd";
import NavTourist from "./tourist/navTourist";
import {
  SearchOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
  FileAddOutlined,
  AppstoreAddOutlined,
  ShareAltOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";

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

const { Content, Sider } = Layout;
const { Title } = Typography;

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const touristId = location.state?.touristId;
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/getTourist/${touristId}`
          );
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

  const HomePage = ({ touristId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const getActivities = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/preferences/${touristId}`
          );
          console.log(response.data); // Check if data is correct
          setActivities(response.data);
        } catch (error) {
          console.error(
            "Error fetching activities based on preferences",
            error
          );
        } finally {
          setLoading(false);
        }
      };

      getActivities();
    }, [touristId]);

    if (loading) return <Spin size="large" />;

    if (activities.length === 0) return <div>No activities available</div>;

    return (
      <div>
        <Title level={2}>Recommended Activities</Title>
        <Row gutter={[16, 16]}>
          {activities.map((activity) => (
            <Col span={8} key={activity._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={activity.title}
                    src={activity.image || "default-image-path.jpg"}
                  />
                }
              >
                <Title level={4}>{activity.title}</Title>
                <p>
                  <strong>Budget:</strong> ${activity.budget}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {activity.time}
                </p>
                <p>
                  <strong>Location:</strong> {activity.location}
                </p>
                <p>
                  <strong>Category:</strong> {activity.category.name}
                </p>
                <p>
                  <strong>Special Discount:</strong> {activity.special_discount}
                </p>
                <p>
                  <strong>Booking Open:</strong>{" "}
                  {activity.booking_open ? "Yes" : "No"}
                </p>
                <div>
                  <strong>Ratings:</strong>
                  <ul>
                    {activity.ratings.map((rating) => (
                      <li key={rating._id}>
                        <p>Rating: {rating.rating}</p>
                        {rating.comment && (
                          <p>
                            <strong>Comment:</strong> {rating.comment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
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
        return (
          <>
            <HomePage touristId={touristId} />
          </>
        );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="dark">
        <Menu mode="inline" theme="dark" defaultSelectedKeys={["1"]}>
          <Menu.Item
            key="1"
            icon={<HomeOutlined />}
            onClick={() => setCurrentPage("Home")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<SearchOutlined />}
            onClick={() => setCurrentPage("search")}
          >
            Search
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<AppstoreAddOutlined />}
            onClick={() => setCurrentPage("activityList")}
          >
            Activities
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<HistoryOutlined />}
            onClick={() => setCurrentPage("itineraryList")}
          >
            Itineraries
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<AppstoreAddOutlined />}
            onClick={() => setCurrentPage("historicalPlaces")}
          >
            Places
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<TeamOutlined />}
            onClick={() => setCurrentPage("book")}
          >
            Book
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<TeamOutlined />}
            onClick={() => setCurrentPage("mybooking")}
          >
            My Booking
          </Menu.Item>
          <Menu.Item
            key="8"
            icon={<TeamOutlined />}
            onClick={() => setCurrentPage("productList")}
          >
            Products
          </Menu.Item>
          <Menu.Item
            key="9"
            icon={<TeamOutlined />}
            onClick={() => setCurrentPage("touristProduct")}
          >
            Purchased Products
          </Menu.Item>

          <Menu.Item
            key="10"
            icon={<FileAddOutlined />}
            onClick={() => setCurrentPage("cart")}
          >
            My Cart
          </Menu.Item>

          <Menu.Item
            key="11"
            icon={<FileAddOutlined />}
            onClick={() => setCurrentPage("Wishlist")}
          >
            My WishList
          </Menu.Item>

          <Menu.Item
            key="12"
            icon={<FileAddOutlined />}
            onClick={() => setCurrentPage("Orders")}
          >
            Orders
          </Menu.Item>

          <Menu.Item
            key="13"
            icon={<FileAddOutlined />}
            onClick={() => setCurrentPage("MyComplaintsList")}
          >
            Complaints
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "0 24px 24px" }}>
        <NavTourist touristId={touristId} username={username} />
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {loading ? <Spin size="large" /> : renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Tourist;

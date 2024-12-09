import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Spin,
  Typography,
  Space,
  Tag,
  message,
} from "antd";

const { Title, Text } = Typography;

const Orders = ({ touristId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/getorders/${touristId}`);
        setOrders(response.data.orders);
        setWallet(response.data.wallet);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [touristId]);

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `/cancelorder/${touristId}/${orderId}`
      );
      const updatedOrder = response.data.order;
      const updatedOrders = orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      setOrders(updatedOrders);
      setWallet(response.data.wallet);
      message.success("Order canceled successfully.");
    } catch (err) {
      message.error("Failed to cancel order.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#1d3557", borderColor: "#1d3557" }}
            onClick={() => setSelectedOrder(record)}
          >
            View Details
          </Button>
          {record.status === "pending" && (
            <Button danger onClick={() => handleCancelOrder(record._id)}>
              Cancel Order
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ color: "#1d3557" }}>
        Orders
      </Title>
      <Text>
        <strong>Wallet Balance:</strong> {wallet} EGP
      </Text>
      {loading ? (
        <Spin tip="Loading..." size="large" style={{ marginTop: "20px" }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          style={{ marginTop: "20px" }}
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        title="Order Details"
        visible={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={[
          <Button
            key="close"
            onClick={() => setSelectedOrder(null)}
            style={{
              backgroundColor: "#1d3557",
              borderColor: "#1d3557",
              color: "#fff",
            }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <Text>
              <strong>Order Number:</strong> {selectedOrder.orderNumber}
            </Text>
            <br />
            <Text>
              <strong>Status:</strong> {selectedOrder.status}
            </Text>
            <br />
            <Text>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.orderDate).toLocaleDateString()}
            </Text>
            <br />
            <Text>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </Text>
            <Title level={4} style={{ marginTop: "20px" }}>
              Products
            </Title>
            <ul>
              {selectedOrder.products.map((product, index) => (
                <li key={index}>
                  <Text>
                    <strong>Name:</strong> {product.productId.name}
                  </Text>
                  <br />
                  <Text>
                    <strong>Price:</strong> {product.productId.price}
                  </Text>
                  <br />
                  <Text>
                    <strong>Quantity:</strong> {product.quantity}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;

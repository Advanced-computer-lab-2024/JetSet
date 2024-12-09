import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Select,
  Table,
  Modal,
  Form,
  InputNumber,
  message,
} from "antd";

const { Option } = Select;

const ProductList = ({ touristId }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("ratings");
  const [sortOrder, setSortOrder] = useState(-1); // -1 for descending, 1 for ascending
  const [searchTerm, setSearchTerm] = useState("");
  const [priceLimit, setPriceLimit] = useState(100);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  // Fetch products on initial render
  useEffect(() => {
    fetchProducts();
    fetchCurrencyData();
  }, [touristId]); // Re-fetch when touristId changes

  const fetchProducts = async () => {
    try {
      setLoading(true); // Set loading state before fetching
      const response = await axios.get("http://localhost:3000/products");
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError("No products found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  const fetchCurrencyData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setCurrency(response.data.preferredCurrency);
      setConversionRate(response.data.conversionRate);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  // Handle sorting products client-side
  const handleSort = () => {
    setLoading(true);
    const sortedProducts = [...products]; // Clone the products array to avoid mutating the original state
    sortedProducts.sort((a, b) => {
      const valueA = a[sortBy]; // Property to sort by
      const valueB = b[sortBy];

      if (valueA < valueB) return sortOrder === -1 ? 1 : -1; // Ascending or descending order
      if (valueA > valueB) return sortOrder === -1 ? -1 : 1;
      return 0;
    });

    setProducts(sortedProducts);
    setLoading(false);
  };

  const handleSearch = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/searchProductTourist`, {
        params: { name: searchTerm },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching products:", error);
        setError("Error searching products");
        setLoading(false);
      });
  };

  const handleFilter = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/filterProductTourist`, {
        params: { limit: priceLimit / conversionRate },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error filtering products:", error);
        setError("Error filtering products");
        setLoading(false);
      });
  };

  const handleBuyProduct = () => {
    setLoading(true);
    axios
      .put(`http://localhost:3000/buyProduct/${touristId}`, {
        productId: selectedProduct._id,
        purchaseQuantity,
      })
      .then((response) => {
        message.success(response.data.message);
        fetchProducts();
        setSelectedProduct(null);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Error purchasing product.");
        setLoading(false);
      });
  };

  const handleAddToCart = (product) => {
    setLoading(true);
    axios
      .post(`http://localhost:3000/addToCart/${touristId}`, {
        item: product._id,
      })
      .then((response) => {
        message.success(response.data.message);
        setSelectedProduct(null);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Error adding item to cart.");
        setLoading(false);
      });
  };

  const handleAddToWishlist = (product) => {
    axios
      .post(`http://localhost:3000/Wishlist/${touristId}`, {
        productID: product._id,
      })
      .then((response) => {
        message.success(response.data.message);
      })
      .catch((error) => {
        message.error("Failed to add product to wishlist.");
      });
  };

  const columns = [
    {
      title: "Images",
      dataIndex: "images",
      render: (images) =>
        images && images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:3000/uploads/${img.split("/").pop()}`}
              alt="product"
              style={{ width: 50, height: 50 }}
            />
          ))
        ) : (
          <p>No image available</p>
        ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    {
      title: `Price (${currency.toUpperCase()})`,
      dataIndex: "price",
      render: (price) => (price * conversionRate).toFixed(2),
    },
    {
      title: "Seller",
      dataIndex: "seller_id",
      render: (seller) => seller?.username,
    },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Sales", dataIndex: "sales" },
    { title: "Rating", dataIndex: "ratings" },
    {
      title: "Actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => setSelectedProduct(record)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Want to Buy?
          </Button>
          <Button
            onClick={() => handleAddToWishlist(record)}
            type="default"
            style={{ marginRight: 8 }}
          >
            Add to Wishlist
          </Button>
          <Button onClick={() => handleAddToCart(record)} type="default">
            Add to Cart
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Product List</h1>
      <Input.Search
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue="ratings"
          onChange={(value) => setSortBy(value)}
          style={{ width: 120, marginRight: 8 }}
        >
          <Option value="ratings">Ratings</Option>
        </Select>
        <Select
          defaultValue={-1}
          onChange={(value) => setSortOrder(value)}
          style={{ width: 120, marginRight: 8 }}
        >
          <Option value={-1}>Descending</Option>
          <Option value={1}>Ascending</Option>
        </Select>
        <Button type="primary" onClick={handleSort} loading={loading}>
          Sort
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <InputNumber
          min={0}
          value={priceLimit}
          onChange={(value) => setPriceLimit(value)}
          style={{ marginRight: 8 }}
        />
        <Button onClick={handleFilter}>Filter</Button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Error message */}
      <Table
        columns={columns}
        dataSource={products.length ? products : []}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        visible={selectedProduct !== null}
        onCancel={() => setSelectedProduct(null)}
        footer={null}
        title={`Purchase ${selectedProduct?.name}`}
      >
        <Form onFinish={handleBuyProduct}>
          <Form.Item label="Quantity">
            <InputNumber
              min={1}
              max={selectedProduct?.quantity}
              value={purchaseQuantity}
              onChange={(value) => setPurchaseQuantity(value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Buy
            </Button>
            <Button
              onClick={() => setSelectedProduct(null)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;

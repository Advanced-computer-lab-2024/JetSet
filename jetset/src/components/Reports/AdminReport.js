import React, { useState } from 'react';

const SalesReport = () => {
  const [adminId, setAdminId] = useState('');
  const [filters, setFilters] = useState({
    product: '',
    startDate: '',
    endDate: '',
    month: '',
  });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch the view report
  const fetchSalesReport = async () => {
    setError(null);
    setReport(null);
    setLoading(true);

    const query = new URLSearchParams({
      id: adminId,
    }).toString();

    try {
      const response = await fetch(`/admin-sales-report?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sales report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the filtered report
  const fetchFilteredSalesReport = async () => {
    setError(null);
    setReport(null);
    setLoading(true);

    const query = new URLSearchParams({
      id: adminId,
      ...filters,
    }).toString();

    try {
      const response = await fetch(`/filter-admin-report?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered sales report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sales Report</h1>
      <div>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter Admin ID"
          required
        />
      </div>

      {/* View Report Button */}
      <button onClick={fetchSalesReport}>View Report</button>

      <div>
        {/* Filters for the sales report */}
        <input
          type="text"
          value={filters.product}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, product: e.target.value }))
          }
          placeholder="Filter by Product Name"
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
          placeholder="End Date"
        />
        <input
          type="month"
          value={filters.month}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, month: e.target.value }))
          }
          placeholder="Filter by Month (YYYY-MM)"
        />
        <button onClick={fetchFilteredSalesReport}>Filter Report</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report && (
        <div>
          <h2>{report.message}</h2>
          <p>Total Revenue: ${report.totalRevenue.toFixed(2)}</p>

          <h3>Filtered Products:</h3>
          <ul>
            {report.filteredProducts.map((product) => (
              <li key={product.id}>
                <p><strong>{product.name}</strong></p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Revenue: ${product.revenue.toFixed(2)}</p>
                <ul>
                  {product.purchaseRecords.map((record, index) => (
                    <li key={index}>
                      Tourist: {record.touristUsername} - Quantity: {record.quantity} - Date: {new Date(record.purchaseDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesReport;

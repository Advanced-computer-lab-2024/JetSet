// UserStatistics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/admin-user-statistics'); // Adjust the URL as needed
        setStatistics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Statistics</h1>
      <h2>Total Users</h2>
      <ul>
        <li>Tourists: {statistics.totalUsers.tourists}</li>
        <li>Tour Guides: {statistics.totalUsers.tourGuides}</li>
        <li>Advertisers: {statistics.totalUsers.advertisers}</li>
        <li>Governors: {statistics.totalUsers.governors}</li>
        <li>Sellers: {statistics.totalUsers.sellers}</li>
      </ul>

      <h2>Monthly New Users</h2>
      <h3>Tourists</h3>
      <ul>
        {statistics.monthlyUsers.tourists.map((user, index) => (
          <li key={index}>
            Month: {user.month}, Count: {user.count}
          </li>
        ))}
      </ul>

      <h3>Tour Guides</h3>
      <ul>
        {statistics.monthlyUsers.tourGuides.map((user, index) => (
          <li key={index}>
            Month: {user.month}, Count: {user.count}
          </li>
        ))}
      </ul>

      <h3>Advertisers</h3>
      <ul>
        {statistics.monthlyUsers.advertisers.map((user, index) => (
          <li key={index}>
            Month: {user.month}, Count: {user.count}
          </li>
        ))}
      </ul>

      <h3>Governors</h3>
      <ul>
        {statistics.monthlyUsers.governors.map((user, index) => (
          <li key={index}>
            Month: {user.month}, Count: {user.count}
          </li>
        ))}
      </ul>

      <h3>Sellers</h3>
      <ul>
        {statistics.monthlyUsers.sellers.map((user, index) => (
          <li key={index}>
            Month: {user.month}, Count: {user.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserStatistics;
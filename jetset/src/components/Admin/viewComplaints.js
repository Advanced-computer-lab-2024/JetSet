import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedComplaints, setExpandedComplaints] = useState([]);


  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:3000/viewAllComplaints');
        setComplaints(response.data);
      } catch (err) {
        setError('Failed to fetch complaints.HEREE');
        console.error(err); 

      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleToggleDetails= (id)=>{
    setExpandedComplaints((prevExpanded) => {
      if (prevExpanded.includes(id)) {
        return prevExpanded.filter((complaintId) => complaintId !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  }

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>List of Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id} onClick={()=>handleToggleDetails(complaint._id)} style={{ cursor: 'pointer' }}>
            <h3>{complaint.title}</h3>
            {expandedComplaints.includes(complaint._id) &&(
            <>
              <p>{complaint.body}</p>
              <p>Date: {new Date(complaint.date).toLocaleDateString()}</p>
            </>)
            }
            <p>Status: {complaint.state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ComplaintList;

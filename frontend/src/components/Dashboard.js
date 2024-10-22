import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database, ref, onValue } from '../firebase';
import './PlantDashboard.css';

function Dashboard() {
  const { id } = useParams();
  const [plantData, setPlantData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const plantRef = ref(database, `plants/${id}`);
    onValue(plantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlantData(data);
      } else {
        setError('No data found for this plant');
      }
    }, (error) => {
      console.error('Error fetching data:', error);
      setError(error.message);
    });
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!plantData) {
    return <p>Loading...</p>;
  }

  return (
<div className="dashboard-page">
  <div className="plant-info-container">
    {plantData.image && (
      <img src={plantData.image} alt="Plant" className="plant-image" />
    )}
    <div className="plant-info">
      <p><strong>Name:</strong> {plantData.name}</p>
      <p><strong>Date Planted:</strong> {plantData.datePlanted}</p>
      <p><strong>Plant Type:</strong> {plantData.type}</p>
      <p><strong>Device:</strong> {plantData.device}</p>
      <p><strong>Health Status:</strong> {plantData.healthStatus}</p>
      <p><strong>Disease Detected:</strong> {plantData.diseaseDetected}</p>
      <p><strong>Plant Stage:</strong> {plantData.stage}</p>
      <p><strong>Days Since Planted:</strong> {plantData.daysSince}</p>
      <p><strong>RGB Color:</strong> {plantData.rgbColour}</p>
    </div>
  </div>
  <div className="navigation-buttons">
    <Link to={`/dashboard/${parseInt(id) - 1}`} className="nav-button">Previous</Link>
    <Link to={`/dashboard/${parseInt(id) + 1}`} className="nav-button">Next</Link>
  </div>
</div>

  );
}

export default Dashboard;

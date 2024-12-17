import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database, ref, onValue } from '../firebase';
import './PlantDashboard.css';

function Dashboard() {
  const { id } = useParams();
  const [plantData, setPlantData] = useState(null);
  const [plantIds, setPlantIds] = useState([]);  // Store all plant IDs
  const [currentIndex, setCurrentIndex] = useState(null);  // Track current index in the plantIds array
  const [error, setError] = useState(null);

  useEffect(() => {
    const plantsRef = ref(database, 'plants');
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ids = Object.keys(data);
        setPlantIds(ids);
        const index = ids.indexOf(id);  // Find the index of the current plant
        setCurrentIndex(index);
      } else {
        setError('No plants found');
      }
    }, (error) => {
      console.error('Error fetching plant IDs:', error);
      setError(error.message);
    });
  }, [id]);

  // Fetch data for the current plant
  useEffect(() => {
    if (id) {
      const plantRef = ref(database, `plants/${id}`);
      onValue(plantRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPlantData(data);
        } else {
          setError('No data found for this plant');
        }
      }, (error) => {
        console.error('Error fetching plant data:', error);
        setError(error.message);
      });
    }
  }, [id]);
  
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!plantData || currentIndex === null) {
    return <p>Loading...</p>;
  }

  // Get next and previous plant IDs
  const prevPlantId = currentIndex > 0 ? plantIds[currentIndex - 1] : null;
  const nextPlantId = currentIndex < plantIds.length - 1 ? plantIds[currentIndex + 1] : null;


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
        {prevPlantId && (
          <Link to={`/dashboard/${prevPlantId}`} className="prev-button">
            Previous
          </Link>
        )}
        {nextPlantId && (
          <Link to={`/dashboard/${nextPlantId}`} className="next-button">
            Next
          </Link>
        )}
      </div>
</div>

  );
}

export default Dashboard;

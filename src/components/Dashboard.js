import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database, ref, onValue } from '../firebase';
import './PlantDashboard.css';

function Dashboard({ testMode = false, mockData = null }) {
  const { id } = useParams() || {}; // UseParams must always be called
  const defaultId = testMode ? 'TestPlantId' : id;

  const [plantData, setPlantData] = useState(mockData || null);
  const [plantIds, setPlantIds] = useState(testMode ? ['TestPlantId'] : []);
  const [currentIndex, setCurrentIndex] = useState(testMode ? 0 : null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (testMode) {
      if (mockData === null) {
        setError('No plants found');
      }
      return;
    }

    const plantsRef = ref(database, 'plants');
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ids = Object.keys(data);
        setPlantIds(ids);
        const index = ids.indexOf(defaultId);
        setCurrentIndex(index);
      } else {
        setError('No plants found');
      }
    });
  }, [defaultId, testMode, mockData]);

  useEffect(() => {
    if (testMode || !defaultId) return;

    const plantRef = ref(database, `plants/${defaultId}`);
    onValue(plantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlantData(data);
      } else {
        setError('No data found for this plant');
      }
    });
  }, [defaultId, testMode]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!plantData || currentIndex === null) {
    return <p>Loading...</p>;
  }

  const prevPlantId = currentIndex > 0 ? plantIds[currentIndex - 1] : null;
  const nextPlantId = currentIndex < plantIds.length - 1 ? plantIds[currentIndex + 1] : null;

  return (
    <div className="dashboard-page">
      <div className="plant-info-container">
        {plantData.image && <img src={plantData.image} alt="Plant" className="plant-image" />}
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
        {prevPlantId && <Link to={`/dashboard/${prevPlantId}`} className="prev-button">Previous</Link>}
        {nextPlantId && <Link to={`/dashboard/${nextPlantId}`} className="next-button">Next</Link>}
      </div>
    </div>
  );
}

export default Dashboard;

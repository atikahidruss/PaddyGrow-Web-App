import React, { useEffect, useState, useCallback } from 'react';
import { database, ref, onValue, set, remove } from '../firebase';
import './Plants.css';

function Plants() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({
    name: '',
    datePlanted: '',
    type: '',
    device: '',
    healthStatus: '',
    diseaseDetected: '',
    stage: '',
    daysSince: '',
    rgbColour: '',
    image: ''
  });
  const [error, setError] = useState(null);

  // Function to handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant({ ...newPlant, [name]: value });
  };

  // Function to monitor changes in plant health status and trigger notifications
  const monitorHealthStatusChanges = useCallback((plants) => {
    Object.entries(plants).forEach(([plantId, plantData]) => {
      const healthStatus = plantData.healthStatus;
      const plantName = plantData.name;

      if (healthStatus === 'Infected') {
        addNotification(plantName, plantId); // Add notification if infected
      } else if (healthStatus === 'Good') {
        removeNotification(plantId); // Remove notification if health is good
      }
    });
  }, []); // No dependencies

  // Listen for changes in the 'plants' data and update the plant list
  useEffect(() => {
    const plantsRef = ref(database, 'plants');
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlants(Object.entries(data));
        monitorHealthStatusChanges(data); // Monitor plant health changes for notifications
      } else {
        setPlants([]);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
      setError(error.message);
    });
  }, [monitorHealthStatusChanges]); // Add monitorHealthStatusChanges as a dependency

  // Function to handle adding a new plant
  const handleAddPlant = (e) => {
    e.preventDefault();
    const nextId = plants.length > 0 ? Math.max(...plants.map(([id]) => parseInt(id))) + 1 : 1;
    const newPlantRef = ref(database, `plants/${nextId}`);
    set(newPlantRef, newPlant)
      .then(() => {
        console.log('Plant added successfully');
        setNewPlant({
          name: '',
          datePlanted: '',
          type: '',
          device: '',
          healthStatus: '',
          diseaseDetected: 'none',
          stage: '',
          daysSince: '',
          rgbColour: '',
          image: ''
        });
      })
      .catch((error) => {
        console.error('Error adding plant:', error);
        setError(error.message);
      });
  };

  // Function to add a notification when the health status is 'Infected'
  const addNotification = (plantName, plantId) => {
    const notificationsRef = ref(database, `notifications/${plantId}`);
    set(notificationsRef, {
      message: `${plantName} is Infected.`,
      timestamp: new Date().toLocaleString()
    });
  };

  // Function to remove the notification when health status becomes 'Good'
  const removeNotification = (plantId) => {
    const notificationRef = ref(database, `notifications/${plantId}`);
    remove(notificationRef)
      .then(() => {
        console.log('Notification removed');
      })
      .catch((error) => {
        console.error('Error removing notification:', error);
      });
  };

  // Handle deleting a plant
  const handleDeletePlant = (plantId) => {
    remove(ref(database, `plants/${plantId}`))
      .then(() => {
        console.log('Plant deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting plant:', error);
        setError(error.message);
      });
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="plant-page">
      <form onSubmit={handleAddPlant} className="add-plant-form">
        <input type="text" name="name" value={newPlant.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="date" name="datePlanted" value={newPlant.datePlanted} onChange={handleInputChange} required />
        <input type="text" name="type" value={newPlant.type} onChange={handleInputChange} placeholder="Type" required />
        <input type="text" name="device" value={newPlant.device} onChange={handleInputChange} placeholder="Device" required />
        <button type="submit">Add Plant</button>
      </form>
      <ul className="plant-list">
  {plants.map(([id, plant]) => {
    if (!plant) return null; // Skip if plant is undefined

    return (
      <li key={id} className="plant-item">
        <p><strong>Name:</strong> {plant.name || 'N/A'}</p>
        <p><strong>Date Planted:</strong> {plant.datePlanted || 'N/A'}</p>
        <p><strong>Plant Type:</strong> {plant.type || 'N/A'}</p>
        <p><strong>Device:</strong> {plant.device || 'N/A'}</p>
        <button onClick={() => handleDeletePlant(id)}>Delete Plant</button>
      </li>
    );
  })}
</ul>
    </div>
  );
}

export default Plants;

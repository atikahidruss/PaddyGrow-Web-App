import React, { useEffect, useState } from 'react';
import { database, ref, onValue, set, update, remove } from '../firebase';
import './Plants.css';

function Plants() {
  const [plants, setPlants] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
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
  const [sortOption, setSortOption] = useState('none'); // State for sorting option

  useEffect(() => {
    const plantsRef = ref(database, 'plants');
    const devicesRef = ref(database, 'device');
  
    const unsubscribePlants = onValue(
      plantsRef,
      (snapshot) => {
        const data = snapshot.val();
        const plantArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
        setPlants(plantArray);
      },
      (error) => setError(error.message)
    );

    const unsubscribeDevices = onValue(
      devicesRef,
      (snapshot) => {
        const devicesData = snapshot.val();
        const available = Object.keys(devicesData).filter(
          (device) => devicesData[device]?.status === 'Available'
        );
        setAvailableDevices(available);
      },
      (error) => setError(error.message)
    );

    return () => {
      unsubscribePlants();
      unsubscribeDevices();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant({ ...newPlant, [name]: value });
  };

  const handleAddPlant = (e) => {
    e.preventDefault();
  
    // Calculate the next ID based on the current plants
    const nextId = plants.length > 0 
      ? Math.max(...plants.map((plant) => parseInt(plant.id))) + 1 
      : 1;
  
    // Reference for the new plant
    const newPlantRef = ref(database, `plants/${nextId}`);
    const deviceRef = ref(database, `device/${newPlant.device}`);

    // Ensure the date is stored in YYYY-MM-DD format
    const formattedDate = newPlant.datePlanted.split('-').reverse().join('-');
  
    // Add the new plant to the database and update the device status
    set(newPlantRef, { ...newPlant, id: nextId, datePlanted: formattedDate}) // Store the ID in the plant data as well
      .then(() => {
        console.log(`Plant added successfully with ID: ${nextId}`);
        return update(deviceRef, { status: 'Not available' });
      })
      .then(() => {
        console.log('Device status updated to "Not available"');
        // Reset the form state
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
        console.error('Error:', error);
        setError(error.message);
      });
  };
  
  const handleDeletePlant = (plantId, device) => {
    const plantRef = ref(database, `plants/${plantId}`);
    const deviceRef = ref(database, `device/${device}`);
  
    update(deviceRef, { status: 'Available' })
      .then(() => {
        console.log(`Device ${device} status updated to "Available"`);
        return remove(plantRef);
      })
      .then(() => {
        console.log(`Plant with ID ${plantId} deleted successfully`);
      })
      .catch((error) => {
        console.error('Error deleting plant or updating device status:', error);
        setError(error.message);
      });
  };  

  // Sorting logic
  const sortPlants = (plants, option) => {
    if (option === 'infected-to-healthy') {
      // Explicitly sort with "Infected" first
      return [...plants].sort((a, b) => {
        const healthOrder = { Infected: 1, Good: 2 }; // Define order explicitly
        return healthOrder[a.healthStatus] - healthOrder[b.healthStatus];
      });
    } else if (option === 'healthy-to-infected') {
      // Explicitly sort with "Healthy" first
      return [...plants].sort((a, b) => {
        const healthOrder = { Good: 1, Infected: 2 }; // Define order explicitly
        return healthOrder[a.healthStatus] - healthOrder[b.healthStatus];
      });
    }
    return plants; // Default: no sorting
  };
  
  
  // Handle sorting option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedPlants = sortPlants(Object.values(plants || {}).filter(Boolean), sortOption);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="plant-page">
      <form onSubmit={handleAddPlant} className="add-plant-form">
        <input type="text" name="name" value={newPlant.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="date" name="datePlanted" value={newPlant.datePlanted} onChange={handleInputChange} required />
        <input type="text" name="type" value={newPlant.type} onChange={handleInputChange} placeholder="Type" required />
        <select name="device" value={newPlant.device} onChange={handleInputChange} required>
          <option value="" disabled>Select Device</option>
          {availableDevices.map((device) => (
            <option key={device} value={device}>{device}</option>
          ))}
        </select>
        <button type="submit">Add Plant</button>
      </form>

      <div className="sorting-section">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="none">None</option>
          <option value="infected-to-healthy">Infected to Healthy</option>
          <option value="healthy-to-infected">Healthy to Infected</option>
        </select>
      </div>

      <ul className="plant-list">
        {sortedPlants.map((plant, index) => (
          <li key={index} className="plant-item">
            <img src={plant.image} alt={plant.name} className="plant-image" />
            <p><strong>Name:</strong> {plant.name || 'N/A'}</p>
            <p><strong>Date Planted:</strong> {plant.datePlanted || 'N/A'}</p>
            <p><strong>Health Status:</strong> {plant.healthStatus || 'N/A'}</p>
            <p><strong>Device:</strong> {plant.device || 'N/A'}</p>
            <button onClick={() => handleDeletePlant(plant.id, plant.device)}>Delete Plant</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Plants;

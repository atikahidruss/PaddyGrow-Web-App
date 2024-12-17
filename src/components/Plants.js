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

  useEffect(() => {
    const plantsRef = ref(database, 'plants');
    const devicesRef = ref(database, 'device');

    const unsubscribePlants = onValue(
      plantsRef,
      (snapshot) => {
        const data = snapshot.val();
        setPlants(data || []);
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
    const existingIds = Object.keys(plants).map(Number);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const nextId = maxId + 1;

    const newPlantRef = ref(database, `plants/${nextId}`);
    const deviceRef = ref(database, `device/${newPlant.device}`);

    set(newPlantRef, newPlant)
      .then(() => {
        console.log('Plant added successfully');
        return update(deviceRef, { status: 'Not available' });
      })
      .then(() => {
        console.log('Device status updated to "Not available"');
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

      <ul className="plant-list">
        {Object.entries(plants).map(([key, plant]) => {
          if (!plant) return null;
          return (
            <li key={key} className="plant-item">
              <p><strong>Name:</strong> {plant.name || 'N/A'}</p>
              <p><strong>Date Planted:</strong> {plant.datePlanted || 'N/A'}</p>
              <p><strong>Plant Type:</strong> {plant.type || 'N/A'}</p>
              <p><strong>Device:</strong> {plant.device || 'N/A'}</p>
              <button onClick={() => handleDeletePlant(key, plant.device)}>Delete Plant</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Plants;

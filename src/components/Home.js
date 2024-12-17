import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database, ref, onValue } from '../firebase';
import './Home.css';

function Home() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const plantsRef = ref(database, 'plants');
    const unsubscribe = onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const plantList = Object.entries(data).map(([id, plant]) => ({
          id, 
          ...plant
        }));
        setPlants(plantList);
      } else {
        setPlants([]);
      }
    }, (error) => console.error("Error fetching plants:", error));

    return () => unsubscribe();
  }, []);

  return (
    <div className="home">
      <div className="home">
      <div className="image-container">
        <img src="/homepage.jpg" alt="Paddy Field" className="center-image"/>
        <div className="text-box">
          <p>Seeding Innovation, Harvesting Efficiency</p>
        </div>
      <ul className="plant-list">
        {plants.map((plant) => (
          <li key={plant.id}>
            <Link to={`/dashboard/${plant.id}`} className="plant-link">
              {plant.name || `Plant ${plant.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
    </div>
  );
}

export default Home;

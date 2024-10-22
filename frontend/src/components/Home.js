import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="image-container">
        <img src="/homepage.jpg" alt="Paddy Field" className="center-image"/>
        <div className="text-box">
          <p>Seeding Innovation, Harvesting Efficiency</p>
        </div>
      </div>
      <ul className="plant-list">
        <li><Link to="/dashboard/1" className="plant-link">Plant 1</Link></li>
        <li><Link to="/dashboard/2" className="plant-link">Plant 2</Link></li>
        <li><Link to="/dashboard/3" className="plant-link">Plant 3</Link></li>
      </ul>
    </div>
  );
}

export default Home;
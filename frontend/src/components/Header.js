// Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
import './Header.css';

function Header() {
  const location = useLocation(); // Get current location
  
  return (
    <header className="header">
      <h1 className="heading">PaddyGrow</h1>
      <nav className="nav">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>HOME</Link>
        <Link to="/dashboard/1" className={`nav-link ${location.pathname.startsWith("/dashboard") ? "active" : ""}`}>DASHBOARD</Link>
        <Link to="/plants" className={`nav-link ${location.pathname === "/plants" ? "active" : ""}`}>PLANTS</Link>
        <Link to="/notification" className={`nav-link ${location.pathname === "/notification" ? "active" : ""}`}>NOTIFICATION</Link>
      </nav>
    </header>
  );
}

export default Header;

// Header.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth'; // For logging out
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

function Header() {
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // Navigate after logout

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      alert('Logout successful!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <h1 className="heading">PaddyGrow</h1>
      <nav className="nav">
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/dashboard/1" className="nav-link">DASHBOARD</Link>
        <Link to="/plants" className="nav-link">PLANTS</Link>
        <Link to="/notification" className="nav-link">NOTIFICATION</Link>
      </nav>
      <div className="logout-icon">
        <FontAwesomeIcon
          icon={faSignOutAlt}
          onClick={handleLogout}
          title="Logout"
          style={{ cursor: 'pointer' }}
        />
      </div>
    </header>
  );
}

export default Header;

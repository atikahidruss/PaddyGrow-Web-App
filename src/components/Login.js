// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate} from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css'; // Add a custom CSS file for styling

const Login = ({ onToggleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/'); // Redirect to the home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-header">
        <h1 className="app-name">PaddyGrow</h1>
      </div>
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="register-link">
          Don’t have an account?{' '}
          <a href="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;

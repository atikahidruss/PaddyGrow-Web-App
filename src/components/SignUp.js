import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try another one.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
      <h1>Create Your Account</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <p className="error-text">{error}</p>}
      </form>
      <p>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Login
        </a>
      </p>
    </div>
    </div>
  );
};

export default SignUp;

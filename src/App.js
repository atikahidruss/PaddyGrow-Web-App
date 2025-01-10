// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Plants from './components/Plants';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import Header from './components/Header';
import HealthMonitor from './components/HealthMonitor';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { NotificationProvider } from './components/NotificationContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; 

function ProtectedRoute({ children }) {
  const [user] = useAuthState(auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          {user && (
            <>
              <HealthMonitor />
            </>
          )}
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} /> 
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plants"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Plants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/:id"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notification"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Notification />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {/* Conditionally render Footer */}
          {user && (
            <footer>
              <p>© 2025 PaddyGrow. All rights reserved.</p>
            </footer>
          )}
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;

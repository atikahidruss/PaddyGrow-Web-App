// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Plants from './components/Plants';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/notification" element={<Notification />} />
          </Routes>
        </main>
        <footer>
          <p>© 2024 PaddyGrow. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

// CSS
import './App.css';

// Pages
import Home      from './components/pages/Home';
import Explore   from './components/pages/Explore';
import Dashboard from './components/pages/Dashboard';
import Login     from './components/pages/Login';
import Register  from './components/pages/Register';

// Components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking the token
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setIsLoggedIn(false); // Set login state to false
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register' element={<Register />} />
      </Routes>

      <ToastContainer />
      
      <Footer />
    </Router>
  );
}

export default App;
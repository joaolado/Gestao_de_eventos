
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// CSS
import './App.css';

// Pages
import Home      from './components/pages/Home';
import Explore   from './components/pages/Explore';
import Event     from './components/pages/EditEvent';
import Dashboard from './components/pages/Dashboard';
import Login     from './components/pages/Login';
import Register  from './components/pages/Register';

// Components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

function App() 
{
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => 
  {
    // Check if the User is Logged in by Checking the Token
    if (localStorage.getItem('token')) 
    {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => 
  {
    localStorage.removeItem('token'); // Remove Token on Logout
    setIsLoggedIn(false);             // Set Login State to False
  };

  return (

    <Router>

      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <Routes>
        <Route path='/'           element={<Home />} />
        <Route path='/explore'    element={<Explore />} />
        <Route path='/event/:id'  element={<Event />} />
        <Route path='/dashboard'  element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/login'      element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register'   element={<Register />} />
      </Routes>

      <ToastContainer />
      
      <Footer />

    </Router>
  );
}

export default App;
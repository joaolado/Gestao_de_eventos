
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App()
{
  return (
    <>
      <Router>

        <Navbar />
        
        <Routes>

          <Route path='/'          element={<Home />} />
          <Route path='/explore'   element={<Explore />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login'     element={<Login />} />
          <Route path='/register'  element={<Register />} />

        </Routes>

        <Footer />

      </Router>
    </>
  );
}

export default App;
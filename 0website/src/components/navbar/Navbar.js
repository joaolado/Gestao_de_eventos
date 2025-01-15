
import React, { useState, useEffect } from 'react';

// Import Navigation
import { Link, useLocation } from 'react-router-dom';

// CSS
import '../navbar/Navbar.css';

// Components
import { Button } from '../button/Button';

function Navbar({ isLoggedIn, handleLogout }) 
{
  // State Variables for Managing User Inputs and Fetched Data
  const [click, setClick] = useState(false);    // State to Manage Mobile Menu Visibility (open/close)
  const [button, setButton] = useState(true);   // State to Manage Display the Button for Desktop View

  const location = useLocation();  // Initialize Navigation

  const isActive = (path) => location.pathname === path;

  const handleClick = () => setClick(!click);    // Toggle the Mobile Menu
  const closeMobileMenu = () => setClick(false); //  Close the Mobile Menu

  // Show or Hide the Button Based on the Window Width
  const showButton = () => 
  {
    if (window.innerWidth <= 960) 
    {
      setButton(false); // Hide Button
    } 
    
    else 
    {
      setButton(true); // Show Button
    }
  };

  // Run the showButton Function
  useEffect(() => 
  {
    showButton();
  }, []);

  // Add an Event Listener to Handle Window Resize and Adjust the Button Visibility
  window.addEventListener('resize', showButton);

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          <Link 
            to="/" 
            className="navbar-logo" 
            onClick={closeMobileMenu}
            >EventFlow
            {/* <img src="/images/logo-w.png" alt="EventFlow Logo" /> */}
            <i class='fab fa-odnoklassniki' />
          </Link>

          <div className="menu-icon" onClick={handleClick}>

            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />

          </div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>

            <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <Link 
                to="/" 
                className="nav-links" 
                onClick={closeMobileMenu}
                >Home
              </Link>
            </li>

            <li className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
              <Link
                to="/explore"
                className="nav-links"
                onClick={closeMobileMenu}
                >Explore
              </Link>
            </li>

            <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Link
                to="/dashboard"
                className="nav-links"
                onClick={closeMobileMenu}
                >Dashboard
              </Link>
            </li>

            <li>
              {isLoggedIn ? (

                <button
                  className="nav-links-mobile"
                  onClick={() => 
                  {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  >LOGOUT
                </button>

              ) : (

                <Link
                  to="/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                  >LOGIN / REGISTER
                </Link>
              )}
            </li>
          </ul>

          {button && 
          (
            <Button
              buttonStyle="btn--outline"
              onClick={isLoggedIn ? handleLogout : null}
              >{isLoggedIn ? 'LOGOUT' : 'LOGIN / REGISTER'}
            </Button>
          )}
          
        </div>
      </nav>
    </>
  );
}

export default Navbar;
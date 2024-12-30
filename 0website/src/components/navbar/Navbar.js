
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// CSS
import '../navbar/Navbar.css';

// Components
import { Button } from '../button/Button';

function Navbar({ isLoggedIn, handleLogout }) 
{
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => 
  {
    if (window.innerWidth <= 960) 
    {
      setButton(false);
    } 
    
    else 
    {
      setButton(true);
    }
  };

  useEffect(() => 
  {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          <Link 
            to="/" 
            className="navbar-logo" 
            onClick={closeMobileMenu}
            >EventFlow
            <img src="/images/logo-w.png" alt="EventFlow Logo" />
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
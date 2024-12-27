
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { toast } from 'react-toastify';         // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing toast CSS

// API
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Login.css';

function Login({ setIsLoggedIn }) 
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const togglePasswordVisibility = () => 
  {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();

    try 
    {
      const data = await fetchAPI('/auth/login', 
      {
        method: 'POST',

        body: JSON.stringify
        ({
          email,
          userPassword: password,
        }),
      });

      // Store the Token and Show Success Toast
      localStorage.setItem('token', data.token);

      // Update the Login State
      setIsLoggedIn(true);                         
      toast.success('Login Successful! Welcome!');

      // Redirect to the Dashboard
      navigate('/dashboard');
    } 
    
    catch (error) 
    {
      console.error('Login Failed:', error.message);
      toast.error('Login Failed. Please Check Your Credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">

        <div className="logo">
          EventFlow
          <img src="/images/logo-b.png" alt="EventFlow Logo" />
        </div>

        <h2>Welcome Back!</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">

            <label htmlFor="password">Password</label>

            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Please Pick a Strong Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="toggle-password" onClick={togglePasswordVisibility}>

                {passwordVisible ? 
                (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M2.899 12.735a1.87 1.87 0 0 1 0-1.47c.808-1.92 2.1-3.535 3.716-4.647S10.103 4.945 12 
                      5.004c1.897-.059 3.768.502 5.385 1.614s2.908 2.727 3.716 4.647a1.87 1.87 0 0 1 0 1.47c-.808 
                      1.92-2.1 3.535-3.716 4.647S13.897 19.055 12 18.996c-1.897.059-3.768-.502-5.385-1.614S3.707 14.655 
                      2.9 12.735" />
                      <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7" />
                    </g>
                  </svg>

                ) : (

                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M5.45 16.92a10.8 10.8 0 0 1-2.55-3.71a1.85 1.85 0 0 1 0-1.46A10.6 10.6 0 0 1 6.62 
                      7.1A9 9 0 0 1 12 5.48a8.8 8.8 0 0 1 4 .85m2.56 1.72a10.85 10.85 0 0 1 2.54 3.7a1.85 1.85 0 0 1 0 
                      1.46a10.6 10.6 0 0 1-3.72 4.65A9 9 0 0 1 12 19.48a8.8 8.8 0 0 1-4-.85" />
                      <path d="M8.71 13.65a3.3 3.3 0 0 1-.21-1.17a3.5 3.5 0 0 1 3.5-3.5c.4-.002.796.07 1.17.21m2.12 
                      2.12c.14.374.212.77.21 1.17a3.5 3.5 0 0 1-3.5 3.5a3.3 3.3 0 0 1-1.17-.21M3 20L19 4" />
                    </g>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <button type="submit" className="sign-in-button">LOGIN</button>

          <p>
            New to EventFlow? Create an Account <a href="/register"><u>Here</u>.</a>
          </p>

        </form>
      </div>

      <div className="right-section">

        <div className="background"></div>

      </div>
    </div>
  );
}

export default Login;
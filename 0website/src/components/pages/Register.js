
import React, { useState } from 'react';

// Import Navigation
import { useNavigate } from 'react-router-dom';

// Import Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Register.css';

function Register() 
{
  // State Variables for Managing User Inputs and Fetched Data
  const [email, setEmail] = useState('');                        // Holds the Email Input
  const [password, setPassword] = useState('');                  // Holds the Password Input
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggles Password Visibility

  const navigate = useNavigate(); // Hook for Navigation

  // Toggle Password Visibility Between Text and Password
  const togglePasswordVisibility = () => 
  {
    setPasswordVisible(!passwordVisible);
  };

  // Form Submission Handler
  const handleSubmit = async (e) => 
  {
    e.preventDefault(); // Prevent the Default Form Submit Action

    try 
    {
      // Send Register Request to API
      const data = await fetchAPI('/auth/register', 
      {
        method: 'POST',

        body: JSON.stringify
        ({
          email,
          userPassword: password,
        }),
      });

      toast.success('Registration Successful! Lets Get Started.');

      // Redirect to Login Page After Registration
      navigate('/login'); 
    } 
    
    catch (error) 
    {
      console.error('Registration Failed:', error.message);
      toast.error('Registration Failed. Please Try Again.');
    }
  };

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (

    <div className="register-page">
      <div className="left-section">

        <div className="logo">
          EventFlow
          {/* <img src="/images/logo-b.png" alt="EventFlow Logo" /> */}
          <i class='fab fa-odnoklassniki' />
        </div>

        <h2>Create an Account.</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">

            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="^[^@\s]+@[^@\s]+\.(com|pt)$" 
              title="Email | Must Contain (@) | End With (.com) or (.pt)" 
              required
            />
          </div>

          <div className="input-group">

            <label htmlFor="password">Password</label>

            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Please pick a strong password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,8}" 
                title="Password | Must Have 8 Characters | 1 (a-z), 1 (A-Z), 1 (0-9)" 
                minLength={8}
                maxLength={8}
                required
              />

              <span className="toggle-password" onClick={togglePasswordVisibility}>

                {passwordVisible ? 
                (
                  <svg className="eye-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M2.899 12.735a1.87 1.87 0 0 1 0-1.47c.808-1.92 2.1-3.535 3.716-4.647S10.103 4.945 
                      12 5.004c1.897-.059 3.768.502 5.385 1.614s2.908 2.727 3.716 4.647a1.87 1.87 0 0 1 0 1.47c-.808 
                      1.92-2.1 3.535-3.716 4.647S13.897 19.055 12 18.996c-1.897.059-3.768-.502-5.385-1.614S3.707 14.655 
                      2.9 12.735" />
                      <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7" />
                    </g>
                  </svg>

                ) : (

                  <svg className="eye-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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

          <button type="submit" className="register-button">REGISTER</button>

          <p>
            Already Have an Account? Login <a href="/login"><u>Here</u>.</a>
          </p>

        </form>
      </div>
      
      <div className="right-section">

        <div className="background"></div>

      </div>
    </div>
  );
}

export default Register;
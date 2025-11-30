import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css';
import logo from '../../../assets/logo.png';
import sideImage from '../../../assets/sideImage.png';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });

  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {

      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      

      const { token, role, firstName } = res.data;

 localStorage.setItem('token', token);
localStorage.setItem('userInfo', JSON.stringify(res.data));
localStorage.setItem('user', JSON.stringify(res.data));  
localStorage.setItem('userType', role);


      alert(`Welcome back, ${firstName}!`);

   
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard'); 
      }

    } catch (err) {
      
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
    }
  };

  return (
    <div className="container">

      <div className="formSection">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Logo" />
          <p className="logo-heading">Hubly</p>
        </div>

        <div className="formWrapper">
          <h1 className="heading">Sign in to your Account</h1>
          
        
          {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="username">Email Address</label>
              <input 
                type="email"
                id="username" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="loginButton">
              Log in
            </button>
          </form>

          <p className="footerText">
            Don't have an account? <Link to="/signup" className="link">Sign up</Link>
          </p>
        </div>

        <p className="legalText">
          This site is protected by reCAPTCHA and the <a href="#">Google Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
        </p>
      </div>

 
      <div className="imageSection">
        <img src={sideImage} alt="Workspace" className="heroImage" />
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import './Navbar.css';
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">


      <div className="company-logo">
        <img src={logo} className="logo" alt="Logo" />
        <p className="logo-heading">Hubly</p>
      </div>

    
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

    
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="register-btn">Signup</Link>
      </div>

    </nav>
  );
};

export default Navbar;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logo.png";
import sideImage from "../../../assets/sideImage.png";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        payload
      );

      console.log("Signup Success:", res.data);
      alert(res.data.message || "Account created successfully!");

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Logo" />
          <p className="logo-heading">Hubly</p>
        </div>

        <div className="signup-box">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-header">
              <h2>Create an account</h2>
              <Link to="/login" className="login-link">
                Sign in instead
              </Link>
            </div>

            <label>First name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />

            <label>Last name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <div className="terms-row">
              <input type="checkbox" required />
              <p>
                By creating an account, I agree to our
                <a href="#"> Terms of Use </a> and
                <a href="#"> Privacy Policy</a>.
              </p>
            </div>

            <button type="submit" className="signup-btn">
              Create an account
            </button>
          </form>
          <p className="captcha-text">
            This site is protected by reCAPTCHA and the
            <Link to="#"> Google Privacy Policy </Link> and
            <Link to="#"> Terms of Service </Link> apply.
          </p>
        </div>
      </div>

      <div className="signup-right">
        <img src={sideImage} alt="side" />
      </div>
    </div>
  );
};

export default Signup;

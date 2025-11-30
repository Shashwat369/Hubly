import React, { useState, useEffect } from "react";
import "./Settings.css";

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.forceLogout) {
      alert("Password changed! Login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    alert("Profile updated!");
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-card">
        <div className="settings-tabs">
          <button className="tab-btn active">Edit Profile</button>
        </div>

        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group half">
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* LAST NAME */}
          <div className="form-row">
            <div className="form-group half">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-row">
            <div className="form-group half">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="icon-wrapper">
                  <InfoIcon />
                </span>
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="form-row">
            <div className="form-group half">
              <label>Password</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span className="icon-wrapper">
                  <InfoIcon />
                </span>
              </div>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-row">
            <div className="form-group half">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <div className="icon-wrapper tooltip-container">
                  <InfoIcon />
                  <div className="tooltip-bubble">
                    User will be logged out immediately
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

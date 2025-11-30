// client/src/components/Layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

// Assets
import logo from "../../../assets/logo.png";
import home from "../../../assets/home.png";
import message from "../../../assets/message.png";
import analytics from "../../../assets/analytics.png";
import chatBot from "../../../assets/chatBot.png";
import teams from "../../../assets/teams.png";
import settings from "../../../assets/settings.png";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { path: "/dashboard", icon: home, label: "Home" },
    { path: "/dashboard/chat-center", icon: message, label: "Chat Center" },
    { path: "/dashboard/analytics", icon: analytics, label: "Analytics" },
    { path: "/dashboard/chatbot", icon: chatBot, label: "Chatbot" }, 
    { path: "/dashboard/teams", icon: teams, label: "Teams" },
    { path: "/dashboard/settings", icon: settings, label: "Settings" },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img src={logo} alt="Hubly-Cloud" className="sidebar-logo" />
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.label} 
            className="sidebar-link-wrapper"
          >
            <div className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}>
              <img src={item.icon} alt={item.label} className="sidebar-icon" />
              <p className="sidebar-label">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

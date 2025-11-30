import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import searchIcon from "../../../assets/searchIcon.png";
import sms from "../../../assets/sms.png";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All Tickets");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = "http://localhost:5000/api/tickets";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Unable to load tickets.");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const filteredTickets = tickets.filter((ticket) => {
    const ticketStatus = ticket.status ? ticket.status.toLowerCase() : "open";

    const matchesTab =
      activeTab === "All Tickets" ||
      (activeTab === "Resolved" && ticketStatus === "resolved") ||
      (activeTab === "Unresolved" && ticketStatus !== "resolved");

    const matchesSearch = ticket.ticketId
      ? ticket.ticketId
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : false;

    return matchesTab && matchesSearch;
  });

  if (loading)
    return <div className="dashboard-loading">Loading tickets...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* SEARCH BAR */}
      <div className="search-wrapper">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search for ticket"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABS */}
      <div className="dashboard-tabs">
        {["All Tickets", "Resolved", "Unresolved"].map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <span className="tab-icon">
                <img src={sms} alt="" />
              </span>
            )}
            {tab}
          </div>
        ))}
      </div>
      <hr className="tabs-divider" />

      {/* TICKET LIST */}
      <div className="ticket-list">
        {filteredTickets.length === 0 ? (
          <div className="no-tickets-message">
            {searchQuery ? "Ticket not found" : "No tickets found"}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-id-group">
                  <span
                    className={`status-dot ${
                      ticket.status === "resolved" ? "green" : "yellow"
                    }`}
                  ></span>
                  <span className="ticket-id">Ticket# {ticket.ticketId}</span>
                </div>
                <span className="ticket-date">
                  {ticket.createdAt
                    ? "Posted at " +
                      new Date(ticket.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>
              </div>

              <div className="ticket-body">
                <p className="ticket-message">
                  {ticket.messages && ticket.messages.length > 0
                    ? ticket.messages[ticket.messages.length - 1].text
                    : "No messages yet"}
                </p>
              </div>

              <div className="ticket-footer">
                <div className="user-info">
                  <div className="avatar-circle">
                    {getInitials(ticket.name)}
                  </div>

                  <div className="user-details">
                    <span className="user-name">
                      {ticket.name || "Unknown User"}
                    </span>
                    <span className="user-contact">
                      {ticket.phone || "No Phone"}
                    </span>
                    <span className="user-email">
                      {ticket.email || "No Email"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

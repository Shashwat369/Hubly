import React, { useState, useEffect, useRef } from "react";
import "./ChatCenter.css";
import home from "../../../assets/home.png";
import profile from "../../../assets/profile.png";
import phone from "../../../assets/phone.png";
import Mail from "../../../assets/Mail.png";
import Ticket from "../../../assets/Ticket.png";
import { Link } from "react-router-dom";

const ChatCenter = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [teammates, setTeammates] = useState([]);

  const [modal, setModal] = useState({ show: false, type: "", value: null });

const API_URL = import.meta.env.VITE_API_URL + "/api";

  const messagesEndRef = useRef(null);
  let systemMessageShown = false;

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // FORMAT DATE
  const formatMessageDate = (ts) => {
    const date = new Date(ts);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // GET INITIALS
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  // SELECTED TICKET
  const selectedTicket = React.useMemo(() => {
    return tickets.find((t) => t._id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // 🔐 CHECK IF CHAT BELONGS TO SOMEONE ELSE
  const isNotMyTicket =
    selectedTicket &&
    selectedTicket.assignedTo &&
    loggedInUser?._id &&
    selectedTicket.assignedTo !== loggedInUser._id;

  // MISSED CHAT
  const isMissedChat = (ticket) => {
    if (!ticket?.messages?.length) return false;
    const lastMsg = ticket.messages[ticket.messages.length - 1];
    if (lastMsg.sender === "admin") return false;
    if (ticket.status === "resolved") return false;

    const timeDiff = new Date() - new Date(lastMsg.timestamp);
    return timeDiff > 5 * 60 * 1000;
  };

  const getSenderName = (msg) => {
    if (msg.sender === "admin") {
      const assignee = teammates.find(
        (t) => t._id === selectedTicket.assignedTo
      );
      return assignee ? assignee.name : "Admin";
    }
    return selectedTicket.name;
  };

  // FETCH TICKETS
  const fetchTickets = async (isInitialLoad = false) => {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      const data = await response.json();
      setTickets(data);

      if (isInitialLoad && data.length > 0) {
        setSelectedTicketId(data[0]._id);
      }
      if (isInitialLoad) setLoading(false);
    } catch (err) {
      console.error(err);
      if (isInitialLoad) setLoading(false);
    }
  };

  // FETCH TEAMMATES
  const fetchTeammates = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("User fetch failed:", await res.json());
        setTeammates([]); 
        return;
      }

      const data = await res.json();
      setTeammates(data);
    } catch (err) {
      console.error("Fetch teammates error:", err);
      setTeammates([]); 
    }
  };

  useEffect(() => {
    fetchTickets(true);
    fetchTeammates();
    const interval = setInterval(() => fetchTickets(false), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?._id, selectedTicket?.messages?.length]);

  // SEND MESSAGE
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const tempMsg = {
        text: newMessage,
        sender: "admin",
        timestamp: new Date(),
      };

      selectedTicket.messages.push(tempMsg);
      setNewMessage("");

      await fetch(`${API_URL}/tickets/${selectedTicket._id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tempMsg.text, sender: "admin" }),
      });

      fetchTickets(false);
    } catch (err) {
      console.error(err);
    }
  };

  // STATUS & ASSIGN MODAL LOGIC
  const requestStatusUpdate = (newStatus) =>
    newStatus === "resolved"
      ? setModal({ show: true, type: "status", value: newStatus })
      : executeStatusUpdate(newStatus);

  const requestAssignUpdate = (userId) =>
    setModal({ show: true, type: "assign", value: userId });

  const executeStatusUpdate = async (status) => {
    try {
      await fetch(`${API_URL}/tickets/${selectedTicket._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchTickets(false);
    } catch (err) {
      console.error(err);
    }
  };

  const executeAssign = async (userId) => {
    try {
      await fetch(`${API_URL}/tickets/${selectedTicket._id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: userId }),
      });

      fetchTickets(false);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmModal = () => {
    if (modal.type === "status") executeStatusUpdate(modal.value);
    if (modal.type === "assign") executeAssign(modal.value);
    setModal({ show: false, type: "", value: null });
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="contact-center-container">
      {/* LEFT SIDEBAR */}
      <div className="cc-sidebar">
        <h3 className="cc-sidebar-title">Contact Center</h3>
        <div className="cc-chat-list">
          <p className="chats">Chats</p>

          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`cc-chat-item ${
                selectedTicketId === ticket._id ? "active" : ""
              }`}
              onClick={() => setSelectedTicketId(ticket._id)}
            >
              <div className="cc-avatar">{getInitials(ticket.name)}</div>
              <div className="cc-chat-info">
                <div className="cc-chat-header">
                  <span className="cc-chat-name">{ticket.name}</span>
                  {isMissedChat(ticket) && (
                    <span className="cc-missed-dot">●</span>
                  )}
                </div>
                <p className="cc-chat-preview">
                  {ticket.messages?.length
                    ? ticket.messages[ticket.messages.length - 1].text
                    : "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE CHAT PANEL */}
      <div className="cc-main-chat">
    
        {selectedTicket && isNotMyTicket && (
          <div className="cc-locked-screen">
            <h3>This chat is assigned to another team member</h3>
            <p>You no longer have permission to reply.</p>
          </div>
        )}

        {/* CHAT UI (only if allowed) */}
        {selectedTicket && !isNotMyTicket ? (
          <>
            <div className="cc-chat-header-bar">
              <span>Ticket# {selectedTicket.ticketId}</span>
              <Link to="/dashboard">
                <img src={home} className="cc-header-icon" />
              </Link>
            </div>

            <div className="cc-messages-area">
              <div className="cc-date-separator">
                <span>
                  {selectedTicket.messages[0]
                    ? formatMessageDate(selectedTicket.messages[0].timestamp)
                    : "Today"}
                </span>
              </div>

              {selectedTicket.messages.map((msg, idx) => {
                if (msg.sender === "system") {
                  if (!systemMessageShown) {
                    systemMessageShown = true;
                    return (
                      <div key={idx} className="cc-system-message">
                        {msg.text}
                      </div>
                    );
                  }
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className={`cc-message-row ${
                      msg.sender === "admin" ? "sent" : "received"
                    }`}
                  >
                    <div className="cc-msg-avatar">
                      {getInitials(getSenderName(msg))}
                    </div>
                    <div className="cc-message-content">
                      <div className="cc-msg-sender-name">
                        {getSenderName(msg)}
                      </div>
                      <div className="cc-message-bubble">{msg.text}</div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {selectedTicket.status === "resolved" ? (
              <div className="cc-resolved-footer">
                This chat has been resolved
              </div>
            ) : (
              <div className="cc-input-area">
                {isMissedChat(selectedTicket) && (
                  <div className="cc-missed-chat-label">
                    REPLYING TO MISSED CHAT
                  </div>
                )}

                <div className="cc-input-wrapper">
                  <textarea
                    placeholder="Type here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button className="cc-send-btn" onClick={handleSendMessage}>
                    ➤
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          !selectedTicket && (
            <div className="cc-no-selection">
              Select a chat to start messaging
            </div>
          )
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="cc-details-panel">
        {selectedTicket && (
          <>
            <div className="cc-details-header">
              <div className="cc-avatar small">
                {getInitials(selectedTicket.name)}
              </div>
              <span>{selectedTicket.name}</span>
            </div>

            <div className="cc-section">
              <h4>Details</h4>
              <div className="cc-input-group">
                <img src={profile} className="cc-icon" />
                <input type="text" value={selectedTicket.name} readOnly />
              </div>
              <div className="cc-input-group">
                <img src={phone} className="cc-icon" />
                <input type="text" value={selectedTicket.phone} readOnly />
              </div>
              <div className="cc-input-group">
                <img src={Mail} className="cc-icon" />
                <input type="text" value={selectedTicket.email} readOnly />
              </div>
            </div>

            <div className="cc-section">
              <h4>Teammates</h4>
              <div className="cc-input-group">
                <img src={profile} className="cc-icon" />
                <select
                  onChange={(e) => requestAssignUpdate(e.target.value)}
                  value={selectedTicket.assignedTo || ""}
                >
                  <option value="">Select Assignee</option>

                  {(teammates || []).map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName + " " + t.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cc-input-group">
                <img src={Ticket} className="cc-icon" />
                <select
                  value={selectedTicket.status}
                  onChange={(e) => requestStatusUpdate(e.target.value)}
                >
                  <option value="open">Ticket Status</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {modal.show && (
        <div className="cc-modal-overlay">
          <div className="cc-modal-content">
            <h3>
              {modal.type === "status"
                ? "Chat will be closed"
                : "Assign Teammate"}
            </h3>
            <p>
              {modal.type === "status"
                ? "Are you sure you want to resolve this chat?"
                : "Chat would be assigned to a different team member."}
            </p>
            <div className="cc-modal-actions">
              <button
                className="cc-modal-cancel"
                onClick={() => setModal({ show: false })}
              >
                Cancel
              </button>
              <button className="cc-modal-confirm" onClick={confirmModal}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCenter;

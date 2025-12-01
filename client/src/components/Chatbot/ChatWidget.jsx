import React, { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";


import chatIcon from "../../assets/chatIcon.png";
import chatLogo from "../../assets/chatLogo.png";
import sendIcon from '../../assets/sendIcon.png'
import axios from 'axios'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]); 
  const [ticketMongoId, setTicketMongoId] = useState(null);

  const messagesEndRef = useRef(null);


  const timeoutRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowTeaser(false);
      setIsHovered(false);
    }
  };

  const handleTeaserClick = (e) => {
    e.stopPropagation();
    toggleChat();
  };


  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isOpen && showTeaser) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitted, isOpen]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill in required fields");
      return;
    }


    try {
   
      const API_URL = import.meta.env.VITE_API_URL + "/api";

    const res = await axios.post(`${API_URL}/tickets/create`, formData);

      console.log("Ticket Created:", res.data);
setTicketId(res.data.ticketId);       
setTicketMongoId(res.data.mongoId);   

      setIsSubmitted(true);

      setFormData({ name: "", phone: "", email: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong connecting to the server.");
    }

  };
const handleSendMessage = async () => {
  if (!messageInput.trim() || !ticketId) return;

  const currentMsg = messageInput;
  setMessageInput("");

  setMessages((prev) => [...prev, { text: currentMsg, sender: "user" }]);

  try {
    const API_URL = import.meta.env.VITE_API_URL + "/api";



    await axios.post(`${API_URL}/tickets/${ticketMongoId}/message`, {
      text: currentMsg,
      sender: "user"
    });

  } catch (err) {
    console.error("Failed to send message", err);
  }
};



  return (
    <div
      className="chat-widget-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- OPEN CHAT WINDOW --- */}
      {isOpen && (
        <div className="chat-window open-animation">
          <div className="chat-header">
            <div className="header-info">
              <div className="logo-wrapper">
                <img src={chatLogo} alt="Logo" className="header-logo" />
                <span className="status-dot"></span>
              </div>
              <h3>Hubly</h3>
            </div>
          </div>

          <div className="chat-body">
      
          <div className="user-message-row">
              <div className="user-bubble">Hey!</div>
            </div>


            <div className="bot-message-row">
              <img src={chatLogo} alt="Bot" className="chat-avatar" />

          
              {!isSubmitted ? (
               
                <div className="bot-form-card">
                  <p className="form-title">Introduction Yourself</p>

                  <form className="chat-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Your name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Your phone</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="+1(000)000-000"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Your email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <button type="submit" className="start-chat-btn">
                      Thank You!
                    </button>
                  </form>
                </div>
              ) : (
                /* 2. The Success View */
                <div className="bot-form-card success-card">
                  <div className="success-check">✅</div>
                  <p className="success-message">
                    Thank You, our team will get back to you soon.
                  </p>
                  <span className="ticket-info">Ticket #{ticketId} Created</span>
                </div>
              )}
            </div>
            {messages.map((msg, idx) => (
               <div key={idx} className={msg.sender === 'user' ? "user-message-row" : "bot-message-row"}>
                  {msg.sender !== 'user' && <img src={chatLogo} alt="Bot" className="chat-avatar" />}
                  <div className={msg.sender === 'user' ? "user-bubble" : "bot-form-card"}>
                     {msg.text}
                  </div>
               </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Write a message..."
              disabled={!isSubmitted}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
             
            />
            <button className="send-btn" onClick={handleSendMessage}
                disabled={!isSubmitted}>
              <img src={sendIcon} alt="Send" />
            </button>
          </div>
        </div>
      )}

      {/* --- TEASER BUBBLE --- */}
      {isHovered && !isOpen && showTeaser && (
        <div
          className="chat-teaser fadeIn-animation"
          onClick={handleTeaserClick}
        >
          <button
            className="teaser-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
          >
            ×
          </button>

          <div className="teaser-avatar-wrapper">
            <img src={chatLogo} alt="Bot" />
            <span className="teaser-dot"></span>
          </div>

          <div className="teaser-content">
            <p>
              👋 Want to chat about Hubly? I'm a chatbot here to help you find
              your way.
            </p>
          </div>
        </div>
      )}

      {/* --- FAB BUTTON --- */}
      <button
        className={`chat-fab ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
      >
        {isOpen ? (
          <span className="close-x">✕</span>
        ) : (
          <img src={chatIcon} alt="Chat" className="raw-icon" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;

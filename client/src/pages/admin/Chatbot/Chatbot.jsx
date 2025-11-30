import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import chatLogo from "../../../assets/chatLogo.png"
import sendIcon from "../../../assets/sendIcon.png"
import edit from "../../../assets/edit.png"

const Chatbot = () => {
  // State for all settings
  const [config, setConfig] = useState({
    headerColor: "#33475B", 
    bgColor: "#EEEEEE",
    initialMessage1: "How can I help you?",
    initialMessage2: "Ask me anything!",
    introTitle: "Introduction Yourself", 
    introName: "Your name",
    introPhone: "Your Phone",
    introEmail: "Your Email",
   
    welcomeMessage: "👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.",
  
    missedChatTimer: {
        hours: 0,
        minutes: 10,
        seconds: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api/settings";


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data) {
            setConfig(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load settings:", err);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "welcomeMessage" && value.length > 80) return; 
    setConfig(prev => ({ ...prev, [name]: value }));
  };


  const handleTimerChange = (e) => {
      const { name, value } = e.target;
      setConfig(prev => ({
          ...prev,
          missedChatTimer: {
              ...prev.missedChatTimer,
              [name]: parseInt(value) || 0
          }
      }));
  };

  const handleColorSelect = (field, color) => {
    setConfig(prev => ({ ...prev, [field]: color }));
  };

  const handleSave = async () => {
    try {
        const res = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        });
        
        if (res.ok) {
            alert("Chatbot settings saved successfully!");
        } else {
            alert("Failed to save settings.");
        }
    } catch (err) {
        console.error("Save Error:", err);
        alert("Server error while saving.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chatbot-settings-container">
      <h2 className="page-title">Chat Bot</h2>

      <div className="chatbot-layout">
        
        {/* --- LEFT: LIVE PREVIEW --- */}
        <div className="preview-section">
          <div className="chat-preview-card">
            <div className="preview-header" style={{ backgroundColor: config.headerColor }}>
              <div className="preview-brand">
                <img src={chatLogo} alt="chatLogo" className="preview-logo-circle "/>
                <span>Hubly</span>
              </div>
            </div>

            <div className="preview-body" style={{ backgroundColor: config.bgColor }}>
              <div className="preview-bot-msg-row">
                <img src={chatLogo} alt="Chat Avatar" className="preview-avatar"/>
                <div className="preview-bubble">{config.initialMessage1}</div>
              </div>
              <div className="preview-bot-msg-row">
                 <img src={chatLogo} alt="Chat Avatar" className="preview-avatar invisible"/>
                <div className="preview-bubble">{config.initialMessage2}</div>
              </div>

              <div className="preview-form-card">
                <h4>{config.introTitle}</h4>
                <div className="preview-input-group">
                  <label>{config.introName}</label>
                  <input type="text" placeholder="Your Name" disabled />
                </div>
                <div className="preview-input-group">
                  <label>{config.introPhone}</label>
                  <input type="text" placeholder="+1(000) 000-0000" disabled />
                </div>
                <div className="preview-input-group">
                  <label>{config.introEmail}</label>
                  <input type="text" placeholder="example@gmail.com" disabled />
                </div>
                <button className="preview-submit-btn">Thank You!</button>
              </div>
            </div>

            <div className="preview-footer">
              <span>Write a message</span>
              <img src={sendIcon} alt="send-icon" className="send-icon" />
            </div>
          </div>

      
          <div className="preview-teaser">
            <img src={chatLogo} alt="Chat-Teaser" className="teaser-avatar"/>
            <div className="teaser-text">
                {config.welcomeMessage}
            </div>
            <span className="close-x">×</span>
          </div>
        </div>

        {/* --- RIGHT: SETTINGS FORM --- */}
        <div className="settings-panel">
          
          {/* 1. Header Color */}
          <div className="setting-card">
            <h3>Header Color</h3>
            <div className="color-options">
                <div className={`color-circle white ${config.headerColor === '#FFFFFF' ? 'selected' : ''}`} onClick={() => handleColorSelect('headerColor', '#FFFFFF')}></div>
                <div className={`color-circle black ${config.headerColor === '#000000' ? 'selected' : ''}`} onClick={() => handleColorSelect('headerColor', '#000000')}></div>
                <div className={`color-circle navy ${config.headerColor === '#33475B' ? 'selected' : ''}`} onClick={() => handleColorSelect('headerColor', '#33475B')}></div>
            </div>
            <div className="hex-input-wrapper">
                <div className="color-box" style={{backgroundColor: config.headerColor}}></div>
                <input type="text" name="headerColor" value={config.headerColor} onChange={handleChange} className="hex-input" />
            </div>
          </div>

          {/* 2. Background Color */}
          <div className="setting-card">
            <h3>Custom Background Color</h3>
            <div className="color-options">
                <div className={`color-circle white ${config.bgColor === '#FFFFFF' ? 'selected' : ''}`} onClick={() => handleColorSelect('bgColor', '#FFFFFF')}></div>
                <div className={`color-circle black ${config.bgColor === '#000000' ? 'selected' : ''}`} onClick={() => handleColorSelect('bgColor', '#000000')}></div>
                <div className={`color-circle grey ${config.bgColor === '#EEEEEE' ? 'selected' : ''}`} onClick={() => handleColorSelect('bgColor', '#EEEEEE')}></div>
            </div>
            <div className="hex-input-wrapper">
                <div className="color-box" style={{backgroundColor: config.bgColor}}></div>
                <input type="text" name="bgColor" value={config.bgColor} onChange={handleChange} className="hex-input" />
            </div>
          </div>

          {/* 3. Customize Message */}
          <div className="setting-card">
            <h3>Customize Message</h3>
            <div className="input-row">
                <input type="text" name="initialMessage1" value={config.initialMessage1} onChange={handleChange} />
                <img src={edit} alt="edit-icon" className="edit-icon" />
            </div>
            <div className="input-row">
                <input type="text" name="initialMessage2" value={config.initialMessage2} onChange={handleChange} />
                <img src={edit} alt="edit-icon" className="edit-icon" />
            </div>
          </div>

          {/* 4. Introduction Form */}
          <div className="setting-card">
            <h3>Introduction Form</h3>
            <div className="form-edit-group">
                <input type="text" name="introTitle" value={config.introTitle} onChange={handleChange} placeholder="Header Text" />
                <input type="text" name="introName" value={config.introName} onChange={handleChange} placeholder="Name Label" />
                <input type="text" name="introPhone" value={config.introPhone} onChange={handleChange} placeholder="Phone Label" />
                <input type="text" name="introEmail" value={config.introEmail} onChange={handleChange} placeholder="Email Label" />
            </div>
          </div>

          {/* 5. NEW: Welcome Message Card */}
          <div className="setting-card">
            <h3>Welcome Message</h3>
            <div className="welcome-msg-wrapper">
                <span className="char-count">{config.welcomeMessage.length}/80</span>
                <div className="welcome-msg-input-row">
                    <span className="wave-icon"></span>
                    <textarea 
                        name="welcomeMessage" 
                        value={config.welcomeMessage} 
                        onChange={handleChange}
                        rows="2"
                    />
                    <img src={edit} alt="edit-icon" className="edit-icon" />
                </div>
            </div>
          </div>

          {/* 6. Missed Chat Timer */}
          <div className="setting-card">
            <h3>Missed chat timer</h3>
            <div className="timer-inputs">
                <div className="timer-field">
                    <label>HH</label>
                    <input type="number" name="hours" min="0" max="23" value={config.missedChatTimer?.hours || 0} onChange={handleTimerChange} />
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-field">
                    <label>MM</label>
                    <input type="number" name="minutes" min="0" max="59" value={config.missedChatTimer?.minutes || 0} onChange={handleTimerChange} />
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-field">
                    <label>SS</label>
                    <input type="number" name="seconds" min="0" max="59" value={config.missedChatTimer?.seconds || 0} onChange={handleTimerChange} />
                </div>
            </div>
            
            <button className="save-settings-btn" onClick={handleSave}>Save</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;
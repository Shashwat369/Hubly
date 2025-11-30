const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  headerColor: { type: String, default: "#33475B" },
  bgColor: { type: String, default: "#EEEEEE" },
  initialMessage1: { type: String, default: "How can I help you?" },
  initialMessage2: { type: String, default: "Ask me anything!" },

  introTitle: { type: String, default: "Introduction Yourself" },
  introName: { type: String, default: "Your name" },
  introPhone: { type: String, default: "Your Phone" },
  introEmail: { type: String, default: "Your Email" },

  welcomeMessage: {
    type: String,
    default: "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way."
  },

  missedChatTimer: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 10 },
    seconds: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("Settings", settingsSchema);


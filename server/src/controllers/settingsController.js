const Settings = require("../models/Settings");

// GET Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        headerColor: "#33475B",
        bgColor: "#EEEEEE",
        initialMessage1: "How can I help you?",
        initialMessage2: "Ask me anything!",
        introTitle: "Introduction Yourself",
        introName: "Your Name",
        introPhone: "Your Phone",
        introEmail: "Your Email",
        welcomeMessage: "👋 Want to chat about Hubly? I'm a chatbot here to help you!",
        missedChatTimer: { hours: 0, minutes: 10, seconds: 0 }
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    Object.assign(settings, req.body);

    await settings.save();

    res.json({ message: "Settings updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings" });
  }
};



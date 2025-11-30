const Ticket = require("../models/Ticket");
const User = require("../models/User");

const createTicket = async (req, res) => {
  console.log("🔥 Ticket Request Received:", req.body);

  try {
    const { name, email, phone } = req.body;

    // Find Admin
    const adminUser = await User.findOne({ role: "admin" });
    const assignedTo = adminUser ? adminUser._id : null;

    if (!adminUser) console.log("⚠️ No Admin found. Ticket unassigned.");

    const ticketId = Math.floor(1000 + Math.random() * 9000);

    // Create Ticket (Keys match your Schema exactly)
    const ticket = await Ticket.create({
      ticketId,
      name, // Matches Schema 'name'
      email, // Matches Schema 'email'
      phone, // Matches Schema 'phone'
      assignedTo,
      status: "open",
    });

    console.log("✅ Ticket Created Successfully:", ticketId);

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId: ticket.ticketId,
      mongoId: ticket._id,
    });
  } catch (error) {
    console.error("❌ Ticket Creation Failed:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
const getTickets = async (req, res) => {
  try {
    // Fetch all tickets and sort by newest first (-1)
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const addMessage = async (req, res) => {
  try {
    const { id } = req.params; // FIXED
    const { text, sender } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    console.log("🟦 Incoming Message For Ticket _id:", id);

    const ticket = await Ticket.findById(id); // FIXED

    if (!ticket) {
      console.log("❌ Ticket not found for _id:", id);
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.messages.push({
      sender: sender || "user",
      text,
      timestamp: new Date(),
    });

    await ticket.save();

    console.log("✅ Message saved successfully!");

    res.status(200).json({ message: "Message added", ticket });
  } catch (error) {
    console.error("❌ Error adding message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Status of Ticket
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "unresolved", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    console.log("🔵 Updating status for MongoID:", id);

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      console.log("❌ Ticket not found for ID:", id);
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;

    if (status === "resolved") {
      ticket.messages.push({
        sender: "system",
        text: "This chat has been resolved.",
        timestamp: new Date(),
      });
    }

    await ticket.save();

    console.log("✅ Status updated successfully!");

    res.status(200).json({ message: "Status updated", ticket });
  } catch (error) {
    console.error("❌ Status Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.assignedTo = assignedTo;
    await ticket.save();

    res.status(200).json({ message: "Ticket assigned", ticket });
    ticket.messages.push({
      sender: "system",
      text: `This chat has been assigned to a new team member.`,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Assign Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  addMessage,
  updateStatus,
  assignTicket,
};

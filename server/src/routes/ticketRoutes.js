const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

console.log("🔍 Ticket Controller Loaded:", ticketController);

// Routes
router.post("/create", ticketController.createTicket);

router.get("/", ticketController.getTickets);

// THIS MUST BE EXACT (use :id)
router.post("/:id/message", ticketController.addMessage);

// Update Status
router.put("/:id/status", ticketController.updateStatus);
router.put("/:id/assign", ticketController.assignTicket);


module.exports = router;


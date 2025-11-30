const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    required: true, 
    index: true 
  },
  senderId: { 
    type: String, 
    required: true 
  },
  senderRole: {
    type: String,
    enum: ['client', 'admin', 'team_member'],
    required: true
  },
  text: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
const Ticket = require("../models/Ticket");

// Helper → Last 7 days [YYYY-MM-DD]
const getLast7Days = () => {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

exports.getOverviewStats = async (req, res) => {
  try {
    const last7Days = getLast7Days();
    const missedChats = [];

    // --- REAL DATA CALCULATION (no randomness) ---
    for (const day of last7Days) {
      const count = await Ticket.countDocuments({
        createdAt: {
          $gte: new Date(`${day}T00:00:00`),
          $lte: new Date(`${day}T23:59:59`)
        }
      });

      missedChats.push(count);
    }

    // Summary Stats
    const totalTickets = await Ticket.countDocuments();
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    const resolvedPercent =
      totalTickets === 0
        ? 0
        : Math.round((resolvedTickets / totalTickets) * 100);

    // Reply time placeholder
    const avgReplySeconds = 27;

    return res.json({
      missedChats,        // REAL stable data → 7 values
      avgReplySeconds,   // e.g., 27 secs
      resolvedPercent,   
      totalChats: totalTickets
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Analytics error" });
  }
};

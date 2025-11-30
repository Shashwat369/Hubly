const express = require("express");
const router = express.Router();
const User = require("../models/User")

const { registerAdmin, loginUser, addTeamMember } = require("../controllers/authController");


const protect  = require("../middleware/authMiddleware");


const admin = require("../middleware/adminMiddleware");

// Public Routes
router.post("/signup", registerAdmin);
router.post("/login", loginUser);

router.post("/add-member", protect, admin, addTeamMember);

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password -__v -createdAt -updatedAt");

    const formattedUsers = users.map((u) => ({
      _id: u._id,
      name: `${u.firstName} ${u.lastName}`.trim(), // IMPORTANT 🔥
      email: u.email,
      phone: u.phone,
      role: u.role,
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
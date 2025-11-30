const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// --- 1. PUBLIC SIGNUP (Only for the FIRST Admin) ---
const registerAdmin = async (req, res) => {
  console.log("🔥 CONTROLLER HIT! The request reached here.");
  try {
    // SECURITY CHECK: Is there already an admin?
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res
        .status(403)
        .json({
          message:
            "Admin registration is closed. Please contact your administrator.",
        });
    }

    const { firstName, lastName, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin", // First user is ALWAYS admin
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 2. LOGIN (For Both Admin & Team) ---
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // username = email

    const user = await User.findOne({ email: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role, // Frontend will use this to decide where to redirect
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. PRIVATE: ADD TEAM MEMBER (Only Admin can call this) ---
const addTeamMember = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with 'user' role (Team Member)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "team_member", // Force role to be 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        message: "Team member added successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerAdmin, loginUser, addTeamMember };

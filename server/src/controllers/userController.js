const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all team members
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create new team member
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
      role,
    });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    console.log("⚠️ UPDATE USER HIT ⚠️");

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "User Updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    console.log("DELETE HIT", req.params.id);
    const { id } = req.params;

    console.log("Deleting user with ID:", id);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    let passwordChanged = false;

    // If password is being changed
    if (req.body.password) {
      updates.password = req.body.password;
      passwordChanged = true;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    // If password was changed → force logout
    if (passwordChanged) {
      return res.json({
        message: "Password updated. Please login again.",
        forceLogout: true,
      });
    }

    res.json({
      message: "Profile updated successfully",
      forceLogout: false,
    });

  } catch (err) {
    console.log("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getMe,
};

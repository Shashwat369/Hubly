const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Logged-in user
router.get("/me", protect, userController.getMe);
router.put("/update", protect, userController.updateProfile);

// ADMIN ONLY ROUTES
router.get("/", protect, userController.getUsers);
router.post("/", protect, adminOnly, userController.createUser);
router.put("/:id", protect, adminOnly, userController.updateUser);
router.delete("/:id", protect, adminOnly, userController.deleteUser);

module.exports = router;


const express = require("express");
const { body, validationResult } = require("express-validator");
const tokenAuth = require("../middlewares/tokenAuth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const router = express.Router();

//Route for editing Name property. PUT /edit/name
router.patch(
  "/name",
  [
    tokenAuth,
    body("newName")
      .isString()
      .isLength({ min: 2 })
      .withMessage("New name must be at least 2 characters long"),
    body("password").exists().withMessage("Password Missing"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { newName, password } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the provided password matches the stored password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(403).json({ message: "Invalid password" });
      }

      // Update the user's name
      user.name = newName;
      await user.save();

      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      return res.json({
        message: "Name updated successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

//Route for editing Email property. PUT /edit/email
router.patch(
  "/email",
  [
    tokenAuth,
    body("newEmail").isEmail().withMessage("Invalid email format"),
    body("password").exists().withMessage("Password Missing"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { newEmail, password } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the provided password matches the stored password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(403).json({ message: "Invalid password" });
      }

      // Update the user's email
      user.email = newEmail;
      await user.save();

      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      return res.json({
        message: "Email updated successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

//Route for resetting the Password. PUT /edit/password
router.patch(
  "/password",
  [
    tokenAuth,
    body("password").exists().withMessage("Password Missing"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]*$/)
      .withMessage(
        "Password must contain at least one letter, one numbers, and one special character"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { newPassword, password } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the provided current password matches the stored password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(403).json({ message: "Invalid current password" });
      }

      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = newHashedPassword;
      await user.save();

      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

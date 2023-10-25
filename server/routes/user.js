const express = require("express");
const User = require("../models/User");
const router = express.Router();
const tokenAuth = require("../middlewares/tokenAuth");

// /user route to get user details
router.get("/", tokenAuth, async (req, res) => {
  try {
    //user property is added in tokenAuth middleware. user property only has id property.
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({ user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;

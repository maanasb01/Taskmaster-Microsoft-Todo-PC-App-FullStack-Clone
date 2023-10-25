const express = require("express");
const tokenAuth = require("../middlewares/tokenAuth");
const { ToDoList } = require("../models/ToDoList");
const { ToDo } = require("../models/ToDo");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

//Route to delete the user account
router.delete("/", tokenAuth, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const userLists = await ToDoList.find({ user: req.user.id });
    const userTodos = await ToDo.find({ user: req.user.id });

    await ToDo.deleteMany({ _id: { $in: userTodos } });
    await ToDoList.deleteMany({ _id: { $in: userLists } });
    await User.findByIdAndDelete(req.user.id);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Account Deleted Successfully.", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: error.message,
        message: "Internal Server Error",
        success: false,
      });
  }
});

module.exports = router;

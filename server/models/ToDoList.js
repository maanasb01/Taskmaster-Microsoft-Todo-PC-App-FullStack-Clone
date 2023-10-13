const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define a common schema for to-do lists
const listSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true,
    default: "Untitled List",
  },
  toDos: [{
    type: Schema.Types.ObjectId,
    ref: "toDos"
  }],

  isDefaultTasksList:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create separate models for to-do lists
const ToDoList = mongoose.model("toDoLists", listSchema);

module.exports = { ToDoList};

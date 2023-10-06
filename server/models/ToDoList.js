const mongoose = require("mongoose");
const { Schema } = mongoose;

const toDoListSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:"user"
  },
  title: {
    type: String,
    required: true,
    default: "Untitled List",
  },
  toDos: [{ 
    type: Schema.Types.ObjectId, 
    ref: "toDos" }],
  starred: {
    type: Boolean,
    default: false,
  },
},
{timestamps:true});

module.exports = mongoose.model("toDoLists", toDoListSchema);

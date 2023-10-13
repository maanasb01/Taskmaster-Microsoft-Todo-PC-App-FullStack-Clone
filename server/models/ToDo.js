const mongoose = require("mongoose")
const { Schema } = mongoose;


const todoStepsSchema = new Schema({
  stepTitle: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false,
  }
})

const toDoSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:"user"
  },
  toDoList:{
    type: Schema.Types.ObjectId,
    ref:"toDoLists"
  },
  title: {
    type: String,
    required: true,
  },
  steps: {
    type: [todoStepsSchema],
  },
  note: {
    type: String,
  },
  dueAt: { 
    type: Date
 },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  markedImp: {
    type: Boolean,
    default: false
  },
  inMyDay: {
    type: Boolean,
    default: false
  }
},
{timestamps:true});

const ToDo = mongoose.model("toDos", toDoSchema);
module.exports = { ToDo};
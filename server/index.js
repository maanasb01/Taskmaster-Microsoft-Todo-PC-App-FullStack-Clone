const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const cron = require("node-cron");
const {ToDoList} = require("./models/ToDoList");
const {ToDo} = require("./models/ToDo");

const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/todolist", require("./routes/toDoList"));
app.use("/todo", require("./routes/toDo"));
app.use("/edit", require("./routes/edit"));
app.use("/deleteuser", require("./routes/deleteUser"));

// Schedule a task to run daily at midnight to update "My Day"
cron.schedule('0 0 * * *', async () => {
  console.log("Inside cron ")
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day

  try {
    // Find all todos with a due date within the current day
    const todos = await ToDo.find({
      dueAt: {
        $gte: today,      // Greater than or equal to the beginning of the day
        $lte: endOfDay    // Less than or equal to the end of the day
      }
    });
    console.log(todos)

    await ToDo.updateMany(
      {_id:{$in: todos.map(todo=>todo._id)} }, //Update the todos whose Ids are in the array of Ids (the array created from the map function)
      {$set: {inMyDay: true} }
    );

  } catch (error) {
    console.error('Error updating "My Day" section:', error);
  }
});

// Schedule a task to run daily just before midnight to clear "My Day"
cron.schedule('59 23 * * *', async () => {
  try {

    const todosInMyDay = await ToDo.find({inMyDay: true});
    
    
    await ToDo.updateMany(
      {_id:{$in: todosInMyDay.map(todo=>todo._id)} },
      {$set: {inMyDay: false} }
    );

  } catch (error) {
    console.error('Error clearing "My Day" section:', error);
  }
});

app.listen(port, () => {
  console.log(`ToDo app listening on port ${port}`);
});

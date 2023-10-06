const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/todolist", require("./routes/toDoList"));
app.use("/todo", require("./routes/toDo"));

app.listen(port, () => {
  console.log(`ToDo app listening on port ${port}`);
});

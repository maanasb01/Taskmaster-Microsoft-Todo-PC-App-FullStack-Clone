const mongoose = require("mongoose");

const connectionLink = process.env.DB_CONNECTION_STRING;

const connectToMongo = () => {
  mongoose.connect(connectionLink).then(
    () => console.log("Connected to Taskmaster's Database"),
    (err) => console.error(err)
  );
};

module.exports = connectToMongo;

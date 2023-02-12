const express = require('express')
const app = express();
const { chats } = require("./data/data");
const dotenv = require("dotenv")
dotenv.config();
const connectDB = require("./config/db")
const userRoutes = require('./routes/userRoutes')
const charRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");

connectDB();

app.use(express.json());

const cors = require("cors");
app.use(cors());

app.get("/api/chat", (req, res) => {
    res.send(chats);
})

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use("/api/message", messageRoutes);

app.use("/api/chat", charRoutes)

app.use(express.json()); // since we are sending json to DB

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log("working"));



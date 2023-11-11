// emit:
// The emit function is used on the server to send data to the clients. It allows the server to send custom events with data to one or more connected clients.
// For example, socket.emit('event_name', data) sends an event with the specified name and data to the client or clients.

// on:
// The on function is used on both the client and the server to listen for specific events from the other end. It allows the server or client to listen for custom events and perform actions when those events are received.
// For example, socket.on('event_name', callback) sets up a listener for the specified event, and the provided callback function is executed when the event is received.

// in:
// The in function is used to send a message or an event to a specific room. It is commonly used in real-time applications where users can join different rooms or channels, and messages can be sent to specific rooms rather than being broadcast to all connected sockets.
// For example, socket.in(room).emit('event_name', data) sends an event with the specified name and data to the sockets in the specified room.

const express = require("express");
const cors = require("cors");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connection_db = require("./config/DB_connect");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const {
  notFound,
  errorHandler,
} = require("../backend/middleware/errorMiddleware");
const path = require("path");

dotenv.config(); // Load environment variables from .env file

connection_db(); // database connection

const app = express();

app.use(express.json()); // to accept request in json format

// app.get("/", (req, res) => {
//   res.send("App is running");
// });

app.use("/api/user", userRoutes); // user api endpoint
app.use("/api/chats", chatRoutes); // chats api endpoint
app.use("/api/message", messageRoutes); // message api endpoint

// ---------------Deployment Code---------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// ---------------Deployment Code---------------------

app.use(notFound); //middleware is used to catch any unmatched routes
app.use(errorHandler); //middleware to handle any errors that occurred during the request processing.

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server started and running on Port ${PORT}`)
); // It's a localhost server

const io = require("socket.io")(server, {
  pingTimeout: 60000, // the amt of time it will wait before it goes off
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    //create the new room with the id of the userdata
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      /*socket.in is used to send a message or an event to a specific room. It is commonly used in real-time applications where users can join different rooms or channels, and messages can be sent to specific rooms rather than being broadcast to all connected sockets. and This line sends a "message received" event along with the newMessageReceived data to the socket in the room specified by user._id. It allows targeted communication to a specific user's socket, ensuring that the message is only received by users who are part of that specific room or channel.*/
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // disconnecting the socket because it takes more bandwidth
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});

/*

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  //console.log(req.params.id);

  const singlechat = chats.find((c) => c._id === req.params.id);

  res.send(singlechat);
});

*/

const express = require("express");
const app = express();
const socket = require("socket.io");

const port = process.env.PORT || 5000;
const { usersStore } = require('./stores')
const server = app.listen(
  port,
  console.log(`Server is running on port ${port} `)
);
const io = socket(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, password, roomname }) => {
    usersStore.addUser({socketId: socket.id, username, password, room: roomname});
    const user = usersStore.findUserBySocketId(socket.id)
    socket.join(roomname);

    socket.emit("message", {
      userId: user.userId,
      username: user.username,
      text: `Welcome ${user.username}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      userId: user.userId,
      username: user.username,
      text: `${user.username} has joined the chat`,
    });
  });

  socket.on("chat", (text) => {
    const user = usersStore.findUserBySocketId(socket.id);
    io.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text,
      timestamp: new Date()
    });
  });

  socket.on("disconnect", () => {
    const user = usersStore.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        userId: user.id,
        username: user.username,
        text: `${user.username} has left the chat`,
      });
    }
  });
});

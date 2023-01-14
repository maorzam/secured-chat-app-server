const express = require("express");
const app = express();
const socket = require("socket.io");

const port = process.env.PORT || 5000;
const { messagesStore, usersStore } = require('./stores')
const server = app.listen(
  port,
  console.log(`Server is running on port ${port} `)
);
const io = socket(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    const socketId = socket.id;
    const user = usersStore.findUserBySocketId(socketId)
    if (user) {
        socket.userId = user.userId;
        socket.username = user.username;
        socket.online = user.online
        return next();
    }
    const { password, username } = socket.handshake.auth;
    if (usersStore.isUsernameTaken(username)) {
      return next(new Error("username is already taken"));
    }
    const userObject = {
        socketId,
        username,
        password,
    }
    usersStore.addUser(userObject)
    socket.userId = socketId;
    socket.username = username;
    socket.online = true;
    next();
  });
  
  io.on("connection", async (socket) => {
    console.log('new connection')
    usersStore.setUserOnline(socket.userId)
    socket.join(socket.userId);
  
    let users = usersStore.getUsers()
    users = users.map(user => {
        return {
            ...user,
            messages: messagesStore.getUserMessages(user.userId),
            password: null
        }
    })
  
    socket.emit("users-list", users);
  
    // notify current users about new connection
    socket.broadcast.emit("user-connected", {
      userId: socket.userId,
      username: socket.username,
      online: true,
      messages: [],
    });
  
    socket.on("message", ({ content, to }) => {
      console.log({to})
      const userId = socket.userId
      const message = {
        content,
        sender: userId,
        receiver: to,
        timestamp: new Date()
      };
      socket.to(to).emit("message", message);
      messagesStore.addMessage(userId, message);
    });
  
    // notify users upon disconnection
    // socket.on("disconnect", async () => {
    //   const matchingSockets = await io.in(socket.userId).allSockets();
    //   const isDisconnected = matchingSockets.size === 0;
    //   if (isDisconnected) {
    //     // notify other users
    //     socket.broadcast.emit("user disconnected", socket.userID);
    //     // update the connection status of the session
    //     sessionStore.saveSession(socket.sessionID, {
    //       userID: socket.userID,
    //       username: socket.username,
    //       connected: false,
    //     });
    //   }
    // });
  });
  


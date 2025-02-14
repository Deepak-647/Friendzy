const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const onlineUsers = {}; // Store online users

const getSecretRoomId = (userId, toTargetId) => {
  return crypto
    .createHash("sha256")
    .update([userId, toTargetId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("user-online", (userId) => {
      onlineUsers[userId] = socket.id; // Mark user as online
      io.emit("update-user-status", onlineUsers); // Notify all users
    });

    socket.on("joinChat", ({ userId, toTargetId }) => {
      const roomId = getSecretRoomId(userId, toTargetId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, toTargetId, text }) => {
        //save messages to database
        try {
          const roomId = getSecretRoomId(userId, toTargetId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, toTargetId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, toTargetId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("newMessageRecieved", {
            firstName,
            lastName,
            text,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId]; // Remove user from online list
        io.emit("update-user-status", onlineUsers); // Notify all users
      }
    });
  });
};

module.exports = initializeSocket;

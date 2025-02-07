const socket = require("socket.io");
const crypto = require("crypto");

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

    socket.on("joinChat", ({ userId, toTargetId }) => {
      const roomId = getSecretRoomId(userId, toTargetId);

      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, toTargetId, text }) => {
      const roomId = getSecretRoomId(userId, toTargetId);

      io.to(roomId).emit("newMessageRecieved", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

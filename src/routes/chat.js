const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/authMiddleware");

const chatRouter = express.Router();

chatRouter.get("/chat/:toTargetId", userAuth, async (req, res) => {
  const { toTargetId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, toTargetId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new chat({
        participants: [userId, toTargetId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});
module.exports = chatRouter;

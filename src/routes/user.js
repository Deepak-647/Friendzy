const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,

      status: "interested",
    }).populate("fromUserId",["firstName","lastName","photoUrl"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;

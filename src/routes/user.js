const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl"]
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,

      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
        $or : [ 
            {toUserId : loggedInUser._id , status : "accepted"},
            {fromUserId : loggedInUser._id , status : "accepted"},
        ]
    }).populate("fromUserId",USER_SAFE_DATA)

    const connections = connectionRequest.map(row => row.fromUserId)
    res.send({connections})
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;

const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //Allowing only status
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        res.status(400).send("Status is invald!!!");
      }

      //Checking if the user whom we send request is exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).send("User not found!!");
      }

      //Checking wheather the connection is exist or not
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).send({ message: "Conenction request already exist" });
      }

      //Creating new connection request
      const ConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //saving the connection request in DB
      const requestData = await ConnectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        requestData,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Status now allowed !!" });
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId : loggedInUser._id,
        status :"interested"
      })

      if(!connectionRequest){
        res.status(404).json({Message : "Connection request not found !!"})
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({message : "Connection request " + status ,data});
    } catch (err) {
      throw new Error("ERROR :" + err.message);
    }
  }
);
module.exports = requestRouter;

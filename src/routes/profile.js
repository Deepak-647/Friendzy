const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/authMiddleware");
const { validateEditProfileData } = require("../utils/validations");
profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

//Editing the user info
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.json({message : `${loggedInUser.firstName} , your data updated successfully !!`,
        data : loggedInUser}
     );
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});
//Getting all users from db
profileRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

//Getting a single user using email
profileRouter.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    }
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

//Deleting an user from database
profileRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully ..");
  } catch (err) {
    res.status(404).send("User cannot be deleted");
  }
});

//Updating user in db
//   profileRouter.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;

//     try {
//       //Allowing updates for some fields
//       const ALLOWED_UPDATES = [
//         "firstName",
//         "lastName",
//         "photoUrl",
//         "gender",
//         "skills",
//       ];
//       const isUpdateAllowed = Object.keys(data).every((k) =>
//         ALLOWED_UPDATES.includes(k)
//       );
//       if (!isUpdateAllowed) {
//         throw new Error("Update not allowed !");
//       }
//       const user = await User.findByIdAndUpdate(userId, data, {
//         runValidators: true,
//       });

//       res.send("User updated Successfully...");
//     } catch (err) {
//       res.status(404).send("User not Updated" + err);
//     }
//   });

module.exports = profileRouter;

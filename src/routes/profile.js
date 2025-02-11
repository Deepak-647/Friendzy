const express = require("express");
const multer = require("multer");
const path = require("path");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/authMiddleware");
const { validateEditProfileData } = require("../utils/validations");
const bcrypt = require("bcrypt");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Editing the user info with image upload
profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit request");
      }
      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => {
        if (key !== "photo") {
          loggedInUser[key] = req.body[key];
        }
      });

      if (req.file) {
        loggedInUser.photo = req.file.filename;
      }

      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName}, your data updated successfully !!`,
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);

// Updating the password
profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const savedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(oldPassword, savedPassword);
    if (!isPasswordValid) {
      throw new Error("Old password is not correct!!");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;

    await user.save();
    res.send("Password updated Successfully..");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Getting all users from db
profileRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

// Getting a single user using email
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

// Deleting a user from database
profileRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully ..");
  } catch (err) {
    res.status(404).send("User cannot be deleted");
  }
});

module.exports = profileRouter;

const express =require('express');
const authRouter =express.Router();
const { validateSignupData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");


//Sending data to db of new user
authRouter.post("/signup", async (req, res) => {
    try {
      //Validate signup data
      validateSignupData(req);
  
      const { firstName, lastName, emailId, password } = req.body;
      //encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
     
  
      //creating new user instance
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
      await user.save();
      res.send("User Added Successfully ...");
    } catch (err) {
      res.status(400).send("Error saving the user:" + err.message);
    }
  });

  //login the user
authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid credentials!");
      }
      const isPasswordValid = await user.validatePassword(password);
  
      if (isPasswordValid) {
        //JWT token
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login Successful !!!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  });

  module.exports = authRouter;
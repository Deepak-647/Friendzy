const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

//This middleware converting the JSON to JS object
app.use(express.json());

//Sending data to db of new user
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully ...");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

//Getting all users from db
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

//Getting a single user using email
app.get("/user", async (req, res) => {
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
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully ..");
  } catch (err) {
    res.status(404).send("User cannot be deleted");
  }
});

//Updating user in db
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data,{runValidators:true});
    
    res.send("User updated Successfully...");
  } catch (err) {
    res.status(404).send("User not Updated"+err);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database successfully..");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected !", err);
  });

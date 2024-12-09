const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validations");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const {userAuth} = require('./middlewares/authMiddleware')




const app = express();

//This middleware converting the JSON to JS object
app.use(express.json());
app.use(cookieParser());

//Sending data to db of new user
app.post("/signup", async (req, res) => {
  try {
    //Validate signup data
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //JWT token
      const token = jwt.sign({ _id: user._id }, "Deepak@647");
      res.cookie("token", token);
      res.send("Login Successful !!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/profile", userAuth,(req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    //Allowing updates for some fields
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoUrl",
      "gender",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed !");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.send("User updated Successfully...");
  } catch (err) {
    res.status(404).send("User not Updated" + err);
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

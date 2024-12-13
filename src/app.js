const express = require("express");
const connectDB = require("./config/database");

var cookieParser = require("cookie-parser");

const app = express();

//This middleware converting the JSON to JS object
app.use(express.json());
app.use(cookieParser());

const authRouter =require('./routes/auth')
const profileRouter =require('./routes/profile');
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


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

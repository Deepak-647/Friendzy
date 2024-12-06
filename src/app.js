 const express =require('express');
 const connectDB =require("./config/database")
 const User = require('./models/user')

 const app = express();

 app.post("/signup",async(req,res)=>{
   const user = new User ({
    firstName : "Deepak",
    lastName : "Behera",
    emailId:"deepak123@gmail.com",
    password:"Deepak@123"

   })

   try{
    await user.save()
    res.send("User Added Successfully ...")
   }catch(err){
 res.status(400).send('Error saving the user:'+err.message)
   }
  })
 
 connectDB()
 .then(()=>{
  console.log("Connected to database successfully..")
  app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
 });
})
.catch((err)=>{
  console.error("Database cannot be connected !",err)
})

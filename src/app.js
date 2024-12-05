 const express =require('express');

 const app = express();

 app.use("/hello", (req,res)=>{
   res.send("Hello HEllo");
})
 app.use("/test", (req,res)=>{
   res.send("Testing the server");
})

 app.use("/", (req,res)=>{
   res.send("Hello from server");
})


 
 app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
 });
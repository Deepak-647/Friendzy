const socket = require("socket.io")



const initializeSocket = (server) =>{
    const io= socket(server,{
        cors :{
          origin : "http://localhost:5173"
        }
      });
      
      io.on("connection",(socket)=>{
        //handle events

        socket.on("joinChat",({firstName,userId,toTargetId})=>{
            const roomId = [ userId,toTargetId].sort().join("_");
            console.log(firstName , "Joined room : " + roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage",({
            firstName,
            userId,
            toTargetId,
            text,
          })=>{
            const roomId = [userId,toTargetId].sort().join("_");
            console.log(firstName+ " "+ text)
            io.to(roomId).emit("newMessageRecieved",{firstName,text})
          })

        socket.on("disconnect",()=>{})
      })
}

module.exports = initializeSocket;
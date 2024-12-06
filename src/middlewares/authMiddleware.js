// const authMiddleware = (req,res,next) =>{
//     const token =  "xyz";
//     const authorization = token === "xyz";
//     if(!authorization){
//         res.status(401).send("UnAuthorised")
//     }else{
//         next();
//     }
// }
// const userMiddleware = (req,res,next) =>{
//     const token =  "xyz";
//     const authorization = token === "xyz";
//     if(!authorization){
//         res.status(401).send("UnAuthorised")
//     }else{
//         next();
//     }
// }

// module.exports = {authMiddleware,userMiddleware}
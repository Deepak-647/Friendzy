const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://dbehera647:Deepak%40647@cluster0.l7gbfw1.mongodb.net/friendzy')
}

module.exports =connectDB;
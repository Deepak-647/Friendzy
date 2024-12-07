const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        minLength : 4,
        maxLength: 20
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        lowercase:true,
        unique:true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data not valid!")
            }
        }
        
    },
    skills:{
        type : [String]
    }
},{
    timestamps : true
})

module.exports = mongoose.model("User",userSchema)
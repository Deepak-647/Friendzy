const mongoose = require("mongoose");
const validator = require('validator');
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid email address"+ value) 
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Password is not Strong"+ value) 
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data not valid!");
        }
      },
    },
    photoUrl :{
        type:String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIDLyE2qiXbONA33TsxXBaa9vUEn3VxXw3A&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL"+ value) 
            }
          }
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skillsArray) {
          return skillsArray.length <= 10;
        },
        message: "You can have a maximum of 10 skills only.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

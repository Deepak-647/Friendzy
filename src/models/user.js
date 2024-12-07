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
      validate: {
        validator: function (password) {
          const regex = /^[A-Z][A-Za-z0-9@#%*]+$/;
          const hasSpecialChar = /[@#%*]/.test(password);
          const hasNumber = /\d/.test(password);
          return regex.test(password) && hasSpecialChar && hasNumber;
        },
        message:
          "Password must start with a capital letter, include at least one special character (@, #, %, *), and contain at least one number.",
      },
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

const { connect, Schema, model } = require("mongoose")
connect()

const userSchema = new Schema({
   
    userName:{
    type: String,
    require: true,
    unique: true ,
    trim : true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
    },

  firstName:{
    type : String,
    require: true,
    trin: true,
    maxLength:50
  },

  lastName:{
    type: String,
    trim: true,
    maxLength:50
  },

  password:{
    type: String,
    require: true,
    minLength: 6
  }
})




const User = model("User" , userSchema)

module.exports = {
    User
}
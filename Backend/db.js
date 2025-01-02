const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
        minLength:3,
        maxLength:10,
    },

    lastname:{
        type: String,
        trim:true,
        maxLength: 10,
    },
    password:{
        type:String,
        require:true,
        trim: true,
        maxLength:20
    }

})

const accountSchema = new mongoose.model({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },

    balance:{
      type: Number,
      require: true
    }
})
const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports ={
  User,
  Account
}
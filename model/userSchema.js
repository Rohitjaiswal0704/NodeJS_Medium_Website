const mongoose = require("mongoose")

const plm = require("passport-local-mongoose")
const userSchema = new mongoose.Schema({
    username:String,
    name:String,
    email:String,
    password:String,
    about:String,
    interests:[],
    list:[],
    stories:[],
    avatar:{
        type:String,
        default:"dummy.png"
    }
})

userSchema.plugin(plm,{ usernameField:"email" })

const User = mongoose.model("user",userSchema)
module.exports = User
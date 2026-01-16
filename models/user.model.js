const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true,
        minlength:[5,"username must be at least 5 characters long"],
        trim:true,
        lowercase:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        minlength:[13,"Enter a valid email"],
        trim:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true,
        minlength:[3,"password must be at least 3 characters long"],
        trim:true,
    }
})

const user =mongoose.model("User",userSchema)

module.exports=user
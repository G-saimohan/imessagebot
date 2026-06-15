import mongoose from "mongoose"

const userSchema= new mongoose.Schema({

    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
        unique:true,
    },
    profilePiC:{
        type:String,
        default:"",
    },

},{timestamps:true},); //craetedat or updatedat


const User = mongoose.model("User",userSchema)
export default User;


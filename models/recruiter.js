const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken")
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  designation: {
    type: String,
  },
  companyImage: {
    type: String,
  },
  companyFullName: {
    type: String,
  },
  companyShortName: {
    type: String,
  },
  companyLocation: {
    type: String,
  },
  companySize: {
    type: String,
  },
  token:{
      type:String,
      
  },
  status:{
    type:String,
    enum:["pending","verified"],
    default:"pending"
  },
  otp:{
    type:Number,
  }  
});
RecruiterSchema.pre('save', async function(next){
  const user=this
 
  if(user.isModified('password')){
      user.password=await bcrypt.hash(user.password,8)
     
  }
 return next()
})

RecruiterSchema.methods.generateAuthToken=async function(){
  const user=this
  const token=jwt.sign({_id:user.id.toString()},process.env.JWTRECRUITER)
  
  user.token=token
  return token
}
const Recruiter = mongoose.model("Recruiters", RecruiterSchema);

module.exports = Recruiter;

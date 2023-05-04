const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
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
  DOB: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },
  experience: {
    type: Number,
  },
  jobPreference: [
    {
      jobType: {
        type: String,
      },
      functionalArea: {
        type: String,
      },
      expectedSalary: {
        type: String,
      },
    },
  ],
  education: [
    {
      instituteName: {
        type: String,
      },
      level: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  ],
  token:{
    type:String
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

CandidateSchema.methods.generateAuthToken=async function(){
  const user=this
  const token=jwt.sign({_id:user.id.toString()},process.env.JWTCANDIDATE)
  
  user.token=token
  return token
}
CandidateSchema.pre('save', async function(next){
  const user=this
  
  if(user.isModified('password')){
      user.password=await bcrypt.hash(user.password,8)
      console.log(user.password)
  }
 return next()
})
const Candidate = mongoose.model("Candidates", CandidateSchema);

module.exports = Candidate;

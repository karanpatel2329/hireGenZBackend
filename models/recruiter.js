const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken")
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
  fullName:{
    type:String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo:{
    type:Number,

  },
  gender:{
    type:String
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
  company:{

    companyImage: {
      type: String,
    },
    companyFullName: {
      type: String,
    },
    companyType: {
      type: String,
    }
    ,
    companyLocation: {
      type: String,
    },
    companySize: {
      type: String,
    },
    aboutCompany:{
      type:String,
    },
    companyId:{
      type:Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    }
   
  },
  detailFillProgress:{
    type:Number,
    default:0,
  }
  
  ,
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

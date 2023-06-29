const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  fullName: {
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
  mobileNumber:{
    type:Number
  },
  profileImage: {
    type: String,
  },
  city:{
    type:String,
  },

  gender: {
    type: String,
    enum: ["male", "female","others"],
    default: "male",
  },

  
  qualification: [
    {
      highestQualification: {
        type: String,
      },
      instituteName: {
        type: String,
      },
      startYear:{
        type:Date,
      },
      endYear:{
        type:Date
      },
      stream:{
        type:String
      }
    },
  ],
  experiences: [
    {
      profile: {
        type: String,
      },
      organization: {
        type: String,
      },
      location:{
        type:String
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      isCurrentlyWorking:{
        type:Boolean,
        default:false
      }
      ,
      description:{
        type:String
      }
    },
  ],
  portfolioLink:{
    type:String
  },
  skills:[{
    type:String
  }]
  ,
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
  },
  detailFillProgress:{
    type:Number,
    default:0
  },
  preference:{
    areaOfInterest:[{
        type:String
    }],
    workMode:[
        {
            type:String
        }
    ],
   lookingFor:[{
    type:String,
   }],
    salaryRange:{
      min:{
        type:Number,
      },
      max:{
        type:Number,
      }
    }
},
savedJob:[
  {
    
      type:String,
    
  }
],
appliedIn:[{
  jobId:{
    type:Schema.Types.ObjectId,
  },
  status:{
    type:String
  },
  appliedOn:{
    type:String
  }
}],
createdOn:{
  type:String
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
  console.log(user.password)
  if(user.isModified('password')){
      user.password=await bcrypt.hash(user.password,8)
      console.log(user.password)
  }
 return next()
})
const Candidate = mongoose.model("Candidates", CandidateSchema);

module.exports = Candidate;

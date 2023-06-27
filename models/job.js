const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  applied:[
    {
        status:{
            type:String,
        },
        userId:{
            type:Schema.Types.ObjectId,
        }
    }
  ],  
  degree: {
    type: String,
  },
  title:{
    type:String
  }
  ,
  desc: {
    type: String,
  },
  experience: {

     min:{
      type:Number,
    },
    max:{
      type:Number,
    }
  },
  functionalArea: {
    type: String,
    required: true,
  },
  jobSkill:[{
    type:String
  }]
  ,
  jobType: {
    type: String,
  },
  logo: {
    type: String,
  },
  companyName: {
    type: String,
  },
  recruiterId:{
    type:Schema.Types.ObjectId,
  }
  ,
  companyId: {
    type: String,
  },
  salaryRange:{
    min:{
      type:Number,
    },
    max:{
      type:Number,
    }
  },
  mode:[{
    type:String,
  }]
});
const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
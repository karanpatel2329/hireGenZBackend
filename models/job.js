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
    type: Number,
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
  companyId: {
    type: String,
  },
});
const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
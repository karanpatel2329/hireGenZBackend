



const Recruiter=require("../models/recruiter");
const Candidate=require("../models/candidate");
const sendEmail=require("../services/sendEmail")
const candidateRegister=async(req,res)=>{
   
    try {
        
        const isCandidate=await Candidate.find({email:req.body.email});
        const isRecruiter=await Recruiter.find({email:req.body.email});
        
        if(isCandidate.length!==0 ||isRecruiter.length!==0){
            res.status(409).send({
                message:"User not created",
                error:"User Already Exists"
            })
        }
        else{
        const otp=generateOTP();
        var data=req.body;
        data.otp=otp;
        const candidate=new Candidate(data);
        candidate.save();
       
        var message=`Verfiy your email with this OTP: ${otp}`;
        await sendEmail(candidate.email, "Verify Email", message);
        
        const t=candidate.toObject()
        delete t.password;  
        delete t.otp;  
        const d={
            data:t,
            message:"User Created Successfully"
        }
        res.status(200).send(JSON.stringify(d));        
        
       
    }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: "User not successful created",
            error: error.mesage,
          })
    }
}
const candidateVerify=async(req,res)=>{
    try {
       
        const candidate=await Candidate.findById(req.body.id);

        if(candidate){
            if(parseInt(candidate.otp)===parseInt(req.body.otp)){
                candidate.status="verified";
                candidate.otp="";
                candidate.save();
                const token= await candidate.generateAuthToken();
                res.status(200).send({
                    data:candidate,
                    message:"User Verified",
                    error:""
                })
            }
            else{
                res.status(401).send({
                    error:"Invalid OTP",
                    message:"Invalid OTP"
                })
            }   
        }
        else{
            res.status(404).send({
                message:"User Not Found",
                error:"Invalid User"
            })
        }
    } catch (error) {
        
    }
}
function generateOTP() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
  }
module.exports={
    candidateRegister,
    candidateVerify
}
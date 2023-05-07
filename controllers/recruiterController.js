

const sendEmail=require("../services/sendEmail")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Recruiter=require("../models/recruiter");
const Candidate=require("../models/candidate");
function isCompanyEmail(email) {
    const [username, emailDomain] = email.split('@');
    const excludedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
   
    if (excludedDomains.includes(emailDomain)) {
      return false;
    }
    return true;
  }
const recruiterRegister=async(req,res)=>{
   
    try {
        
        if(!isCompanyEmail(req.body.email)){
            res.status(404).send({
                message:"User not created",
                error:"User Email should be Professional"
            })
        }
        else{
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
        const recruiter=new Recruiter(data);
        recruiter.save();
      
        var message=`Verfiy your email with this OTP: ${otp}`;
        await sendEmail(recruiter.email, "Verify Email", message);
        
        const t=recruiter.toObject()
        delete t.password;  
        delete t.otp;  
        const d={
            data:t,
            message:"User Created Successfully"
        }
        res.status(200).send(JSON.stringify(d));        
        
               
        }}
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: "User not successful created",
            error: error.mesage,
          })
    }
}
const recruiterVerify=async(req,res)=>{
    try {
       
        const recruiter=await Recruiter.findById(req.body.id);

        if(recruiter){
            if(parseInt(recruiter.otp)===parseInt(req.body.otp)){
                recruiter.status="verified";
                await recruiter.updateOne({$unset: { otp: 1 }})
                recruiter.save();
                const token= await recruiter.generateAuthToken();
                res.status(200).send({
                    data:recruiter,
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

  const recruiterLogin=async(req,res)=>{
    try {
        
        const recruiter=await Recruiter.findOne({email:req.body.email});
       
        if(recruiter){
       
            var isMatch=await bcrypt.compare(req.body.password,recruiter.password);
            if(isMatch){
               
                if(recruiter.status!=="pending"){
                await recruiter.generateAuthToken();
                const t=recruiter;
                delete t.password;
                res.status(200).send({
                    message:"User Login Successfully",
                    data:t,
                    error:""
                })
                }
                else{
                    res.status(401).send({
                        message:"Email not Verified",
                        error:"Email not Verified"
                    })
                }
            }
            else{
                res.status(401).send({
                    message:"Invalid Password",
                    error:"Invalid Password"
                })
            }
      
        }
        else{
            res.status(404).send({
                message:"User Not Found",
                error:"User Not Found"
            })
        }
    } catch (error) {
        
    }
}

const getRecruiterProfile=async(req,res)=>{
    try {
        if(!req.header("Authorization")){
            res.status(401).send({
                message:"Please Provide Token to get Detail",
                error:"Please Provide Token to get Detail"
            })
        }
        else{
        const token=req.header('Authorization').replace('Bearer ','')
        
        if(!token){
            res.status(401).send({
                message:"Please Provide Token to get Detail",
                error:"Please Provide Token to get Detail"
            })
        }
        const decode=jwt.verify(token,process.env.JWTRECRUITER)
               
        const user =await Recruiter.findOne({_id:decode._id})
        //console.log(user)
        if(!user){
            res.status(404).send({
                message:"No User Found",
                error:"No User Found"})
        }
        else{
            const t=user.toObject();
            delete t.password;
            res.status(202).send({
                data:t,
                message:"Fetch User Successfully",
                error:""
            })
        }}
        
    } catch (error) {
        console.log(error)
        res.status(401).send({
            message:"Invalid Token",
            error:error
        })
       
    }
}
module.exports={
    recruiterRegister,
    recruiterVerify,
    recruiterLogin,
    getRecruiterProfile
}


const sendEmail=require("../services/sendEmail")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Recruiter=require("../models/recruiter");
const Job=require("../models/job");
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
                const t =recruiter.toObject();
                delete t.password;
                delete t.otp;
                res.status(200).send({
                    data:t,
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
      //console.log(user)
        if(!req.user){
            res.status(404).send({
                message:"No User Found",
                error:"No User Found"})
        }
        else{
            const t=req.user.toObject();
            delete t.password;
            res.status(202).send({
                data:t,
                message:"Fetch User Successfully",
                error:""
            })
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            message:"Invalid Token",
            error:error
        })  
       
    }
}

const sendRecruiterPasswordResetOtp=async(req,res)=>{
    try {
        const finder={email:req.body.email}
       
        const recruiter=await Recruiter.findOne(finder);
        if(!recruiter){
            res.status(401).send({message:"User Not Found",
            error:"User Not Found"})
        }
        else{
        if(recruiter.status=="pending"){
            res.status(401).send({message:"Your Email is Not Verified",
            error:"Email is Not Verified"})
        }
        else{
        const otp=generateOTP();
        
        recruiter.updateOne({$set:{otp:otp}}).then(async(result)=>{
            var message=`OTP to reset your password: ${otp}`;
            await sendEmail(recruiter.email, "Reset Account Password", message);
            var t=recruiter.toObject();
            delete t.password;
            delete t.otp;
            res.status(200).send({
                message:"Otp Sent Successfully",
                data:t,
                error:""
            })
        }).catch((err)=>{
            
            res.status(501).send({
                message:"Something Went Wrong",
                error:err
            })
        })
    }
        }
    } catch (error) {
        res.status(501).send({
            message:"Something Went Wrong1",
            error:error
        })
    }
}

const passwordResetOtpVerify=async(req,res)=>{

    try {
        const recruiter=await Recruiter.findById(req.body.id);
        if(!recruiter){
            res.status(404).send({
                message:"User Not Found",
                error:"User Not Found"
            })
        }
        else{

        if(!recruiter.otp){
            res.status(500).send({
                message:'No Otp Found',
                error:"No OTP Found"
            })
        }
        else{
        if(parseInt(recruiter.otp)===parseInt(req.body.otp)){
            await recruiter.updateOne({$unset: { otp: 1 }})
            recruiter.save();
            var t=recruiter.toObject();
            delete t.password;
            delete t.otp;
         
            res.send({
                message:"OTP Verified Successfully",
                data:t,
                error:""
            })
        }
        else{
            res.status(404).send({
                message:"Invalid Otp",
                error:"Invalid Otp"
            })
        }}}
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}
const resetPassword=async(req,res)=>{
    try {
        const recruiter=await Recruiter.findById(req.body.id);
        if(!recruiter){
            res.status(404).send({
                message:"User Not Found",
                error:"User Not Found"
            })
        }
        else{
        var isMatch=await bcrypt.compare(req.body.newPassword,recruiter.password);
        if(isMatch){
            res.status(403).send({
                message:"New Password can't be same as New Password",
                error:"New Password can't be same as New Password"
            })
        }
        else{
            recruiter.password=req.body.newPassword;
            recruiter.save()
        const t=recruiter.toObject();
        delete t.password
        res.status(200).send({
            message:"Password Reset Successfully",
            error:"",
            data:t
        })}}
    } catch (error) {
        res.status(500).send({
            message:"Something Went Wrong",
            error:error
        })
    }
}

const addRecruiterProfile=async(req,res)=>{
    try {
        if(req.body.fullName!=null && req.body.mobileNo!=null && req.body.gender!=null && req.body.designation!=null && req.body.profileImage!=null)
        {
                req.user.fullName=req.body.fullName;
                req.user.mobileNo=req.body.mobileNo;
                req.user.gender=req.body.gender;
                req.user.designation=req.body.designation;
                req.user.profileImage=req.body.profileImage;
                req.user.detailFillProgress=1;
                await req.user.save().then((result)=>{
                    res.status(201).send({
                        message:"Profile Added Successfully",
                        error:""
                    })
                }).catch((err)=>{
                    res.status(400).send({
                    error:err.toString(),
                    mesage:"Something Went Wrong",
                    data:""})
                })
        }
        else{
            res.status(400).send({
                error:"Incomplete Data",
                mesage:"Some Data are Missing",
                data:""
            })
        }
    } catch (error) {
        res.status(400).send({
            error:error.toString(),
            message:"Something Went Wrong",
            data:""
        })
    }
}
const addRecruiterCompany=async(req,res)=>{
    try {
        if(req.body.companyFullName!=null && req.body.location!=null && req.body.type!=null && req.body.size!=null && req.body.about!=null && req.body.companyImage!=null)
        {
                const company={
                    companyFullName:req.body.companyFullName,
                    companyLocation:req.body.location,
                    companyType:req.body.type,
                    companySize:req.body.size,
                    companyImage:req.body.companyImage,
                    aboutCompany:req.body.about
                }
                // req.user.company.companyFullName=req.body.companyFullName;
                // req.user.company.companyLocation=req.body.location;
                // req.user.company.companyType=req.body.type;
                // req.user.company.companySize=req.body.size;
                // req.user.company.companyImage=req.body.companyImage;
                // req.user.company.aboutCompany=req.body.about;

                //req.user.detailFillProgress=2;
                await Recruiter.findByIdAndUpdate(req.user.id,{$set:{company:company,detailFillProgress:2}}).then((result)=>{
                    res.status(201).send({
                        message:"Company Profile Added Successfully",
                        error:""
                    })
                }).catch((err)=>{
                    res.status(400).send({
                    error:err.toString(),
                    mesage:"Something Went Wrong",
                    data:""})
                })
        }
        else{
            res.status(400).send({
                error:"Incomplete Data",
                mesage:"Some Data are Missing",
                data:""
            })
        }
    } catch (error) {
        res.status(400).send({
            error:error.toString(),
            message:"Something Went Wrong",
            data:""
        })
    }
}

const postJob=async(req,res)=>{
    try {
        if(req.body.title!=null &&req.body.type!=null&&req.body.degree!=null&&req.body.functionalArea!=null&&req.body.mode!=null&&req.body.jobSkill!=null &&req.body.salaryRange!=null &&req.body.experience!=null &&req.body.description!=null ){
            const data={};
            const salArr= req.body.salaryRange.split("-");
            const expArr= req.body.experience.split("-");
            data.title=req.body.title;
            data.jobType=req.body.type;
            data.experience={};
            data.experience.min=parseInt(expArr[0]);
            data.experience.max=parseInt(expArr[1]);
            data.desc=req.body.description;
            data.functionalArea=req.body.functionalArea;
            data.jobSkill=req.body.jobSkill;
            data.mode=req.body.mode;
            data.salaryRange={};
            data.salaryRange.min=parseInt(salArr[0]);
            data.salaryRange.max=parseInt(salArr[1]);
            data.companyId=req.user.company.companyId;
            data.companyName=req.user.company.companyFullName;
            data.applied=[];
            data.degree=req.body.degree;
            data.logo=req.user.company.companyImage;
            data.recruiterId=req.user.id;
          //  console.log(data);
            const job= new Job(data);
            await job.save().then((result)=>{
                res.status(200).send({
                    message:"Job Posted Successfully",
                    error:"",
                    data:result
                })
            }).catch((err)=>{
                res.status(400).send({
                error:err.toString(),
                mesage:"Something Went Wrong",
                data:""})
            })
        }
        else{
            res.status(400).send({
                error:"Incomplete Data",
                mesage:"Some Data are Missing",
                data:""
            })
        }
    } catch (error) {
        res.status(400).send({
            error:error.toString(),
            message:"Something Went Wrong",
            data:""
        })
    }
}

const editPostJob = async (req, res) => {
    try {
      // Extract the jobId from req.body
      const { jobId, updatedData } = req.body;
  
      const data={};
      if(updatedData.salaryRange!=null){
        const salArr= updatedData.salaryRange.split("-");
        data.salaryRange={};
        data.salaryRange.min=parseInt(salArr[0]);
        data.salaryRange.max=parseInt(salArr[1]);  
      }
      if(updatedData.experience!=null){
        const expArr= updatedData.experience.split("-");
        data.experience={};
        data.experience.min=parseInt(expArr[0]);
        data.experience.max=parseInt(expArr[1]);
      }
      if (updatedData.title != null) {
        data.title = updatedData.title;
      }
      if (updatedData.jobType != null) {
        data.jobType = updatedData.type;
      }
      if (updatedData.description != null) {
        data.desc = updatedData.description;
      }
      if (updatedData.functionalArea != null) {
        data.functionalArea = updatedData.functionalArea;
      }
      if (updatedData.jobSkill != null) {
        data.jobSkill = updatedData.jobSkill;
      }
      if (updatedData.mode != null) {
        data.mode = updatedData.mode;
      }
    //  data.companyId = req.user.company.companyId;
      //data.companyName = req.user.company.companyFullName;
      if (updatedData.degree != null) {
        data.degree = updatedData.degree;
      }
      console.log(data);
      console.log(jobId);
   
       await Job.findByIdAndUpdate(
         jobId ,
        { $set: data  }
      ).then((result)=>{
        res.status(200).send({
            message: "Job Updated Successfully",
            error: ""
            
          });
      }).catch((err)=>{
        res.status(404).send({
            error: err.toString(),
            message: "Job not found or unauthorized to edit",
            data: ""
          });
      });
        
    } catch (error) {
      res.status(400).send({
        error: error.toString(),
        message: "Something Went Wrong",
        data: ""
      });
    }
  };
  
const getAllCandidateApplication = async (req, res) => {
try {
    const job = await Job.find({ recruiterId: req.user._id });
    if (job.length > 0) {
    const applications = [];

    await Promise.all(
        job.map(async (app) => {
        if (app.applied.length !== 0) {
            const appPromises = app.applied.map(async (applied) => {
            const candidate = await Candidate.findById(applied.userId);
            const temp = { ...candidate._doc };
            delete temp.password;
            delete temp.otp;
            delete temp.detailFillProgress;
            delete temp.savedJob;
            delete temp.status;
            const t = {
                candidate: temp,
                job: app,
            };
            return t;
            });

            const appResults = await Promise.all(appPromises);
            applications.push(...appResults);
        }
        })
    );

    // console.log(applications);

    if (applications.length > 0) {
        return res.status(200).send({
        message: "Application Fetched Successfully",
        error: "",
        data: applications,
        });
    } else {
        return res.status(200).send({
        message: "No Candidate Apply For Job Yet",
        error: "",
        });
    }
    } else {
    return res.status(200).send({
        message: "No Job Found",
        error: "",
    });
    }
} catch (error) {
    return res.status(401).send({
    message: "Internal Server Error",
    error: error.toString(),
    });
}
};

const shortListCandidate = async (req, res) => {
    try {
      const { candidateId, jobId } = req.body;
      
      // Update the candidate's status in the appliedIn array
      await Candidate.updateOne(
        { _id: candidateId, "appliedIn.jobId": jobId },
        { $set: { "appliedIn.$.status": "shortlisted" } }
      ).then((result)=>{
        res.status(200).send({
            message: "Candidate Shortlisted Successfully",
            error: "",
          });
      }).catch((err)=>{
        res.status(501).send({
            message: "Something went Wrong Try Again Later",
            error: err.toString(),
          });
      });
      
     
    } catch (error) {
      res.status(400).send({
        message: "Internal Server Error",
        error: error.toString(),
      });
    }
  };
  
const declineCandidate = async (req, res) => {
    try {
      const { candidateId, jobId } = req.body;
      
      // Update the candidate's status in the appliedIn array
      await Candidate.updateOne(
        { _id: candidateId, "appliedIn.jobId": jobId },
        { $set: { "appliedIn.$.status": "declined" } }
      ).then((result)=>{
        res.status(200).send({
            message: "Candidate Decline Successfully",
            error: "",
          });
      }).catch((err)=>{
        res.status(501).send({
            message: "Something went Wrong Try Again Later",
            error: err.toString(),
          });
      });
      
     
    } catch (error) {
      res.status(400).send({
        message: "Internal Server Error",
        error: error.toString(),
      });
    }
  };
  
  
module.exports={
    recruiterRegister,
    recruiterVerify,
    recruiterLogin,
    getRecruiterProfile,
    passwordResetOtpVerify,
    sendRecruiterPasswordResetOtp,
    resetPassword,
    addRecruiterProfile,
    addRecruiterCompany,
    postJob,
    editPostJob,
    getAllCandidateApplication,
    shortListCandidate,
    declineCandidate
}
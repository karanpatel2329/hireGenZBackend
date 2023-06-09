



const Recruiter=require("../models/recruiter");
const Candidate=require("../models/candidate");

const sendEmail=require("../services/sendEmail")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const Job = require("../models/job");
const { Schema, Mongoose, default: mongoose } = require("mongoose");
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
        data.createdOn=Date().toString();
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
                await candidate.updateOne({$unset: { otp: 1 }})
                candidate.save();
                const token= await candidate.generateAuthToken();
                const t=candidate;
                delete t.password;

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
const candidateLogin=async(req,res)=>{
    try {
        
        const candidate=await Candidate.findOne({email:req.body.email});
      
        if(candidate){
       
            var isMatch=await bcrypt.compare(req.body.password,candidate.password);
            if(isMatch){
                
                if(candidate.status!=="pending"){
                await candidate.generateAuthToken();
                const t=candidate;
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

const getCandidateProfile=async(req,res)=>{
    try {
        res.status(200).send({
            message:"Profile Fetch Successfully",
            data:req.user,
            error:""
        })
    } catch (error) {
        console.log(error)
        res.status(401).send({
            message:"Invalid Token",
            error:error
        })
       
    }
}

const addPersonalDetails=async(req,res)=>{
    try {
            
            const data=req.body;
            await Candidate.findByIdAndUpdate(req.user._id,{$set:{fullName:data.fullName,mobileNumber:data.mobileNumber,city:data.city,gender:data.gender,detailFillProgress:1}}).then((result)=>{
                res.status(200).send({
                    message:"Personal Info Added successfully",
                    error:""
                })
            }).catch((err)=>{
                res.status(501).send({
                    message:"Internal Server Error",
                    error:err
                })
            })
        
    
        
    } catch (error) {
        res.status(401).send({
            message:"Invalid Token",
            error:error
        })
    }
}

const addQualificationDetail=async(req,res)=>{
    try {
            
        const data=req.body;
        if(data.qualification!==undefined){
            const updatedQualification = data.qualification.map((item) => {
                return {
                  highestQualification: item.highestQualification,
                  instituteName: item.instituteName,
                  startYear: new Date(item.startYear).toISOString().split('T')[0],
                  endYear: new Date(item.endYear).toISOString().split('T')[0],
                  stream: item.stream,
                };
              });
            await Candidate.findByIdAndUpdate(req.user._id,{$set:{qualification:updatedQualification,detailFillProgress:2}}).then((result)=>{
                res.status(200).send({
                    message:"Qualification Info Added successfully",
                    error:""
                })
            }).catch((err)=>{
                res.status(501).send({
                    message:"Internal Server Error",
                    error:err
                })
            })
        }
        else{
            res.status(501).send({
                message:"Something Went Wrong",
                error:"No Qualification Detail Found"
            })
        }
    

    
} catch (error) {
    res.status(401).send({
        message:"Invalid Token",
        error:error
    })
}
}

const addExperiencesDetails=async(req,res)=>{
    try {
            
        const data=req.body;
        console.log(data.experience);
        if(data.experience!=undefined){

        await Candidate.findByIdAndUpdate(req.user._id,{$set:{experiences:data.experience,detailFillProgress:3}}).then((result)=>{
            res.status(200).send({
                message:"Experience Info Added successfully",
                error:""
            })
        }).catch((err)=>{
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })
        }
        else{
            res.status(501).send({
                message:"Something Went Wrong",
                error:"No Experience Detail Found"
            })
        }

    
} catch (error) {
    res.status(401).send({
        message:"Invalid Token",
        error:error
    })
}
}

const addRequirementsDetails=async(req,res)=>{
    try {
            
        const data=req.body;
        
        if(data.portfolioLink!==undefined||data.skills!==undefined){

        await Candidate.findByIdAndUpdate(req.user._id,{$set:{portfolioLink:data.portfolioLink,skills:data.skills,detailFillProgress:4}}).then((result)=>{
            res.status(200).send({
                message:"Requirements Info Added successfully",
                error:""
            })
        }).catch((err)=>{
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })
    
    }
    else{
        res.status(501).send({
            message:"Something Went Wrong",
            error:"Some Detail Found"
        })
    }
    
} catch (error) {
    res.status(401).send({
        message:"Invalid Token",
        error:error
    })
}
}

const sendCandidatePasswordResetOtp=async(req,res)=>{
    try {
        const finder={email:req.body.email}
       
        const candidate=await Candidate.findOne(finder);
        if(!candidate){
            res.status(401).send({message:"User Not Found",
            error:"User Not Found"})
        }
        else{
        if(candidate.status=="pending"){
            res.status(401).send({message:"Your Email is Not Verified",
            error:"Email is Not Verified"})
        }
        else{
        const otp=generateOTP();
        
        candidate.updateOne({$set:{otp:otp}}).then(async(result)=>{
            var message=`OTP to reset your password: ${otp}`;
            await sendEmail(candidate.email, "Reset Account Password", message);
            var t=candidate.toObject();
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
    }}
       

    } catch (error) {
        res.status(501).send({
            message:"Something Went Wrong1",
            error:error
        })
    }
}

const passwordResetOtpVerify=async(req,res)=>{

    try {
        const candidate=await Candidate.findById(req.body.id);
        if(!candidate){
            res.status(404).send({
                message:"User Not Found",
                error:"User Not Found"
            })
        }
        else{

        if(!candidate.otp){
            res.status(500).send({
                message:'No Otp Found',
                error:"No OTP Found"
            })
        }
        else{
        if(parseInt(candidate.otp)===parseInt(req.body.otp)){
            await candidate.updateOne({$unset: { otp: 1 }})
            candidate.save();
            var t=candidate.toObject();
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
        const candidate=await Candidate.findById(req.body.id);
        if(!candidate){
            res.status(404).send({
                message:"User Not Found",
                error:"User Not Found"
            })
        }
        else{
        var isMatch=await bcrypt.compare(req.body.newPassword,candidate.password);
        if(isMatch){
            res.status(403).send({
                message:"New Password can't be same as New Password",
                error:"New Password can't be same as New Password"
            })
        }
        else{
       candidate.password=req.body.newPassword;
        candidate.save()
        const t=candidate.toObject();
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


const addEducation=async(req,res)=>{
    try {
            
        const data=req.body;
        const new_education=[...req.user.qualification,req.body.education]
        await Candidate.findByIdAndUpdate(req.user._id,{$set:{qualification:new_education}}).then((result)=>{
            res.status(200).send({
                message:"Qualification Info Updated successfully",
                error:""
            })
        }).catch((err)=>{
            console.log(err)
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })

} catch (error) {
    res.status(401).send({
        message:"Invalid Token",
        error:error
    })
}
}

const deleteEducation = async (req, res) => {
    try {
        const qualificationId = req.body.qualificationId;
        const newEducation = req.user.qualification.filter(qualification => qualification._id.toString() !== qualificationId);
        
        await Candidate.findByIdAndUpdate(req.user._id, { $set: { qualification: newEducation } })
            .then((result) => {
                res.status(200).send({
                    message: "Qualification Info deleted successfully",
                    error: ""
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(501).send({
                    message: "Internal Server Error",
                    error: err
                });
            });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message: "Invalid Token",
            error: error
        });
    }
}

const editEducation = async (req, res) => {
    try {
        const { qualificationId, updatedData } = req.body;

        const updateQuery = {};
        for (const key in updatedData) {
            updateQuery[`qualification.$[qualification].${key}`] = updatedData[key];
        }

        await Candidate.findByIdAndUpdate(
            req.user._id,
            {
                $set: updateQuery
            },
            {
                arrayFilters: [{ "qualification._id": { $eq: qualificationId } }]
            }
        )
            .then((result) => {
                res.status(200).send({
                    message: "Qualification Info updated successfully",
                    error: ""
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(501).send({
                    message: "Internal Server Error",
                    error: err
                });
            });
    } catch (error) {
        res.status(401).send({
            message: "Invalid Token",
            error: error
        });
    }
}
const addExperience=async(req,res)=>{
    try {
       
        const new_experience=[...req.user.experiences,req.body.experience]
        await Candidate.findByIdAndUpdate(req.user._id,{$set:{experiences:new_experience}}).then((result)=>{
            res.status(200).send({
                message:"Experience Info Updated successfully",
                error:""
            })
        }).catch((err)=>{
            console.log(err)
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })

} catch (error) {
    res.status(401).send({
        message:"Invalid Token",
        error:error
    })
}
}

const deleteExperience = async (req, res) => {
    try {
        const experienceId = req.body.experienceId;
        const new_experience = req.user.experiences.filter(experience => experience._id.toString() !== experienceId);

        await Candidate.findByIdAndUpdate(req.user._id, { $set: { experiences: new_experience} })
            .then((result) => {
                res.status(200).send({
                    message: "Experience Info deleted successfully",
                    error: ""
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(501).send({
                    message: "Internal Server Error",
                    error: err
                });
            });
    } catch (error) {
        res.status(401).send({
            message: "Invalid Token",
            error: error
        });
    }
}

const editExperience = async (req, res) => {
    try {
        const { experienceId, updatedData } = req.body;

        const updateQuery = {};
        for (const key in updatedData) {
            updateQuery[`experiences.$[experiences].${key}`] = updatedData[key];
        }
        
        await Candidate.findByIdAndUpdate(
            req.user._id,
            {
                $set: updateQuery
            },
            {
                arrayFilters: [{ "experiences._id": { $eq: experienceId } }]
            }
        )
            .then((result) => {
                res.status(200).send({
                    message: "Experiences Info updated successfully",
                    error: ""
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(501).send({
                    message: "Internal Server Error",
                    error: err
                });
            });
    } catch (error) {
        res.status(401).send({
            message: "Invalid Token",
            error: error
        });
    }
}

const editPersonalDetail=async(req,res)=>{
    try {
        var fullName=req.body.fullName?req.body.fullName:req.user.fullName;
        var mobileNumber=req.body.mobileNumber?req.body.mobileNumber:req.user.mobileNumber;
        var city =req.body.city?req.body.city:req.user.city;
        var gender=req.body.gender?req.body.gender:req.user.gender;
        await Candidate.findByIdAndUpdate( req.user._id,{fullName:fullName,mobileNumber:mobileNumber,city:city,gender:gender}).then((result)=>{
            res.status(200).send({
                message:"User Personal Detail Updated Successfully!",
                data:result,
                error:""
            })
        }).catch((err)=>{
            res.status(501).send({
            message:"Something Went Wrong!",
            error:err
        })

        })
        
    } catch (error) {
          res.status(500).send({
            message:"Something Went Wrong!",
            error:error
        })

    }
}

const addPreferenceDetail = async (req, res) => {
    try {
      const { areaOfInterest, workMode, lookingFor, salaryRange } = req.body.preference;
      const candidate = req.user;
  
      candidate.preference.areaOfInterest = areaOfInterest;
      candidate.preference.workMode = workMode;
      candidate.preference.lookingFor = lookingFor;

      const [min, max] = salaryRange.split("-").map(value => parseInt(value.trim()));
      candidate.preference.salaryRange = { min, max };
  
      await candidate.save();
  
      res.status(200).send({
        message: "Preference Detail Added Successfully",
        data: candidate,
        error: ""
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Failed to add preference detail",
        error: error.message
      });
    }
  };
  
const saveJob=async(req,res)=>{
    try {
        const savedJobs= [...req.user.savedJob,req.body.jobId];
        await Candidate.findByIdAndUpdate(req.user._id,{$set:{savedJob:savedJobs}}).then((result)=>{
            res.status(200).send({
                message:"Job Saved successfully",
                error:""
            })
        }).catch((err)=>{
            console.log(err)
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })


    } catch (error) {
        res.status(500).send({
            message:"Something Went Wrong!",
            error:error
        })
    }
}
const unSaveJob=async(req,res)=>{
    try {
        const savedJobs = req.user.savedJob.filter(savejob => savejob.toString() !== req.body.jobId);

        await Candidate.findByIdAndUpdate(req.user._id,{$set:{savedJob:savedJobs}}).then((result)=>{
            res.status(200).send({
                message:"Job UnSaved successfully",
                error:""
            })
        }).catch((err)=>{
            console.log(err)
            res.status(501).send({
                message:"Internal Server Error",
                error:err
            })
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Something Went Wrong!",
            error:error
        })
    }
}

const applyJobById=async(req,res)=>{
    try {
        const {jobId}=req.body;

        const existingJob = req.user.appliedIn.find(
            (job) => job.jobId.toString() === jobId
          );
      
          if (existingJob) {
            return res.status(200).send({
              message: "Job Already Applied",
              error: "",
            });
          }
          else{
        req.user.appliedIn.push({status:"pending",appliedOn:Date().toString(),jobId:new mongoose.Types.ObjectId(jobId)});
        req.user.save();

        await  Job.findByIdAndUpdate(jobId ,{
            $push: {
              applied: {
                status: "pending",
                appliedOn:Date().toString(),
                userId:new  mongoose.Types.ObjectId(req.user._id),
              },
            },
          }).then((result)=>{
            res.status(200).send({
                message:"Apply To Job Successfully",
                error:""
            })
          }).catch((err)=>{
            res.status(400).send({
                message:"Something Went Wrong! Try Again Later",
                error:err.toString(),
            })
          })}
    } catch (error) {
        res.status(501).send({
            message:"Internal Server Error",
            error:error.toString(),
        })
    }
}

const getJobByCategory=async(req,res)=>{
    try {
        const pageNumber = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.limit) || 10;
        const regex=new RegExp(req.body.category,"i")
        const skip = pageNumber * pageSize;
    
        const jobs = await Job.find({ jobType: regex })
          .skip(skip)
          .limit(pageSize);
         
        const totalCount=await Job.countDocuments({ jobType: regex });   

        res.status(200).send({
            message:"Page "+pageNumber+" number jobs get Successfully",
            data:{jobs,totalCount},
            error:""
        })
    } catch (error) {
        res.status(500).send({
            message:"Something Went Wrong",
            error:error
        })
    }
}
const searchJob=async(req,res)=>{
    try{
        // console.log(req.user)
       
        const pageNumber = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.limit) || 10;
    
        // Calculate the skip value for pagination
        const skip = pageNumber * pageSize;

        const searchText=req.body.searchText
        const regex = new RegExp(searchText, 'i');
        // console.log(regex)
        const matchingJobs = await Job.find({
          $or: [
            { title: { $in: regex } },
            { companyName: { $in: regex } },
          ]
        }).skip(skip)
        .limit(pageSize);;
        // console.log(matchingJobs);
        
          const totalCount = await Job.countDocuments({   $or: [
            { title: { $in: regex } },
            { companyName: { $in: regex } },
          ] });

        // const job =await Job.find({
        //     jobSkill: { $in: user.skills },
        //   });
        // console.log(job);
        res.status(200).send({
            data:{matchingJobs,totalCount},
            message:"Page "+pageNumber+" number jobs get Successfully",
            error:""
        });      
    }catch(e){
        console.log(e);
        res.status(500).send({
            message:"Internal Server Error",
            error:e
        });
    }
}

const getJobByPreference = async(req,res)=>{
    try{
        //  const jobType=req.body.jobType;
        const pageNumber = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.limit) || 10;
        const jobRegex=[];

        for(var i=0 ;i<req.user.preference.lookingFor.length;i++){
                jobRegex.push(new RegExp(req.user.preference.lookingFor[i],"i"))
        }
        const areaRegex=[];

        for(var i=0 ;i<req.user.preference.areaOfInterest.length;i++){
                areaRegex.push(new RegExp(req.user.preference.areaOfInterest[i],"i"))
            }
            console.log(areaRegex);
        const modeRegex=[];

        for(var i=0 ;i<req.user.preference.workMode.length;i++){
                modeRegex.push(new RegExp(req.user.preference.workMode[i],"i"))
            }
        

        const skip = pageNumber * pageSize;
    
        const jobs = await Job.find({       
            $or: [
                { jobType: {$in:jobRegex} },
                { functionalArea: {$in:areaRegex} },
                { mode: {$in:modeRegex} },
                {
                    salaryRange:{
                        min:{$in:req.user.preference.salaryRange.min},
                        max:{$in:req.user.preference.salaryRange.max}
                    }
                }
                
            ]
        })
          .skip(skip)
          .limit(pageSize);
         
        const totalCount=await Job.countDocuments({       
            $or: [
                { jobType: {$in:jobRegex} },
                { functionalArea: {$in:areaRegex} },
                { mode: {$in:modeRegex} },
                {
                    salaryRange:{
                        min:{$in:req.user.preference.salaryRange.min},
                        max:{$in:req.user.preference.salaryRange.max}
                    }
                }
                
            ]
        });   

        res.status(200).send({
            data:{jobs,totalCount},
            message:"Page "+pageNumber+" number jobs get Successfully",
            error:""
        });      
    }catch(e){
        console.log(e);
        res.status(500).send({
            message:"Internal Server Error",
            error:e
        });
    }
}
module.exports={
    candidateRegister,
    candidateVerify,
    candidateLogin,
    getCandidateProfile,
    addPersonalDetails,
    addQualificationDetail,
    addExperiencesDetails,
    addRequirementsDetails,
    sendCandidatePasswordResetOtp,
    passwordResetOtpVerify,
    resetPassword,
    addEducation,
    deleteEducation,    
    editEducation,
    addExperience,
    deleteExperience,
    editExperience,
    editPersonalDetail,
    addPreferenceDetail,
    saveJob,
    unSaveJob,
    applyJobById,
    getJobByCategory,
    searchJob,
    getJobByPreference
}
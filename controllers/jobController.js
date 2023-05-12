const Candidate = require('../models/candidate');
const Job = require('../models/job');

const addJob = async(req,res)=>{
    try{
        const job = new Job(req.body);
        job.save();
        res.status(200).send({
            data:job,
            message:"job added successfully"
        });      
    }catch(e){
        console.log(e);
    }
}

const getAllJob = async(req,res)=>{
    try{
        // console.log(req.user)
       
        const pageNumber = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.limit) || 10;
    
        // Calculate the skip value for pagination
        const skip = pageNumber * pageSize;
        const preferredJobSkills = req.user.skills;
        const preferredFunctionalAreas = req.user.qualification.map(q => q.stream);
        
        const regexpreferredJobSkills = new RegExp(preferredJobSkills, 'i');
        const regexpreferredFunctionalAreas = new RegExp(preferredFunctionalAreas, 'i');

        const matchingJobs = await Job.find({
          $or: [
            { jobSkill: { $in: regexpreferredJobSkills } },
            { functionalArea: { $in: regexpreferredFunctionalAreas } },
          ]
        }).skip(skip)
        .limit(pageSize);;
        // console.log(matchingJobs);
        
          const totalCount = await Job.countDocuments({   $or: [
            { jobSkill: { $in: regexpreferredJobSkills } },
            { functionalArea: { $in: regexpreferredFunctionalAreas } },
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
const getJobById = async(req,res)=>{
    try{
        console.log(req.query.id);
        const job =await Job.findById(req.query.id);
        console.log(job);
        console.log("===");
        res.status(200).send({
            data:job,
            message:"job found successfully"
        });      
    }catch(e){
        res.status(400).send({
            data:[],
            error:e.message,
            message:"job not found"
        }); 
        console.log(e);
    }
}

const applyJobById = async(req,res)=>{
    try{
        console.log(req.body);
        const job =await Job.findById(req.body.id);

       const updatedJob = await Job.updateOne({_id:req.body.id},{
            jobType:"Full Time"
        });
        console.log(job);
        console.log("===");
        res.status(200).send({
            data:updatedJob,
            message:"applied successfully"
        });   
    }catch(e){

    }
}

const getJobByCategory=async(req,res)=>{
    try {
        const category=req.body.category;
        const pageNumber = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.limit) || 10;
        const regex=new RegExp(req.body.category,"i")
        // Calculate the skip value for pagination
        const skip = pageNumber * pageSize;
    
        // Perform the search query and get the total count
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
module.exports ={
    addJob,
    getAllJob,
    getJobById,
    applyJobById,
    getJobByCategory,
    searchJob
};
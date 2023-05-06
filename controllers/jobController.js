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
        const job =await Job.find({});
        console.log(job);
        res.status(200).send({
            data:job,
            message:"job found successfully"
        });      
    }catch(e){
        console.log(e);
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

module.exports ={
    addJob,
    getAllJob,
    getJobById,
    applyJobById
};
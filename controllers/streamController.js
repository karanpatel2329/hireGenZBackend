


const Stream =require("../models/stream");
const getStreams=async(req,res)=>{
    try {
        const streams=await Stream.find();
        res.status(200).send({
            message:"Get All Stream successfully!",
            data:streams,
            error:""
        })
    } catch (error) {
        res.status(500).send({
            message:"Something Went Wrong",
            error:error
        }) 
    }
}


module.exports={
    getStreams
}
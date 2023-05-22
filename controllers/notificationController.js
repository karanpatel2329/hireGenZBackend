



const Notification =require("../models/notification");
const getAllCandidateNotification=async(req,res)=>{
    try {
        console.log(req.user);
        const notification=await Notification.find({userId:req.user.id});

        if(notification){
            res.status(200).send({
                message:"Get Notification Successfully!",
                data:notification,
                error:""
            })
        }
        else{
        res.status(200).send({
            message:"No Notification Found!",
            error:"No Notification Found!"
        })}

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}

const sendNotification=async(req,res)=>{
    try {
        var to=req.body.to;
        var from=req.body.from;
        var message=req.body.message;
        var image=req.body.image?req.body.image:"";
        var title=req.body.title;

        const notification=await Notification({userId:to,senderId:from,message:message,image:image,title:title})
        await notification.save().then((result)=>{
            res.status(200).send({
                message:"Notification Send Successfully!",
                data:result,
                error:""
            })
        }).catch((err)=>{
            res.status(200).send({
                message:"Unable to send Notification!",
                error:err
            })
        })
    } catch (error) {
        res.status(200).send({
            message:"Unable to send Notification!",
            error:error
        })
    }
}

module.exports={getAllCandidateNotification,
sendNotification}
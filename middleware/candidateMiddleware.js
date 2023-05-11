require('dotenv').config()
const jwt =require("jsonwebtoken")


const Candidate=require("../models/candidate")
const auth =async(req,res,next)=>{

    try {
        if(!req.header("Authorization")){
            res.status(401).send({
                message:"Please Provide Token to get Detail",
                error:"Please Provide Token to get Detail"
            })
        }
        else{
        const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
    
        const decode=jwt.verify(token,process.env.JWTCANDIDATE)
        console.log(decode)
        const user =await Candidate.findOne({_id:decode._id})
      
        if(!user){
            res.status(401).send({message:"User Not Found",
            error:"User Not Found"
    })
        }
        req.token=token
        req.user=user
    }
        next()
    } catch (error) {
        res.status(401).send({message:"Please Authenticate",
            error:error
    })
    }
}

module.exports=auth
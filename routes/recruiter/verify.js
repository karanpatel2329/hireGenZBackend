


const express=require("express");
const recruiterController=require("../../controllers/recruiterController")
const router=new express.Router();


router.patch("/",recruiterController.recruiterVerify);

module.exports=router;
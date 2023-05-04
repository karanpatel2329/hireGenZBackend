


const express=require("express");
const recruiterController=require("../../controllers/recruiterController")
const router=new express.Router();


router.post("/",recruiterController.recruiterRegister);

module.exports=router;
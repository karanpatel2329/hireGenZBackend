




const express=require("express");
const recruiterController=require("../../controllers/recruiterController")

const router=new express.Router();

router.get("/",recruiterController.recruiterLogin);

module.exports=router;
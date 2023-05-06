const express=require("express");
const jobController=require("../../controllers/jobController")

const router=new express.Router();

router.get("/",jobController.getJobById);

module.exports=router;
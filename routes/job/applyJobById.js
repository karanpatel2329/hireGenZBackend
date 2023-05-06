const express=require("express");
const jobController=require("../../controllers/jobController")

const router=new express.Router();

router.post("/",jobController.applyJobById);

module.exports=router;
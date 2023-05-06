const express=require("express");
const jobController=require("../../controllers/jobController")

const router=new express.Router();

router.post("/",jobController.addJob);

module.exports=router;
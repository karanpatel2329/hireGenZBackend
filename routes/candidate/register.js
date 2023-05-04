


const express=require("express");
const candidateController=require("../../controllers/candidateController")
const router=new express.Router();


router.post("/",candidateController.candidateRegister);

module.exports=router;
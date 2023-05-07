



const express = require("express");
const candidateMiddleware=require("../../middleware/candidateMiddleware")
const candidateController=require("../../controllers/candidateController");
const router=new  express.Router();

router.get("/candidateLogin",candidateController.candidateLogin);
router.post("/candidateRegister",candidateController.candidateRegister);
router.patch("/candidateVerify",candidateController.candidateVerify);
router.get("/getCandidateProfile",candidateController.getCandidateProfile);
router.patch("/addPersonalDetail",candidateMiddleware,candidateController.addPersonalDetails);
router.patch("/addQualificationDetail",candidateMiddleware,candidateController.addQualificationDetail);
router.patch("/addJobsDetail",candidateMiddleware,candidateController.addJobsDetails);
router.patch("/addRequirementsDetail",candidateMiddleware,candidateController.addRequirementsDetails);
module.exports=router;
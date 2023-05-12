



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
router.patch("/addEducation",candidateMiddleware,candidateController.addEducation);
router.patch("/addJob",candidateMiddleware,candidateController.addJob);
router.patch("/deleteEducation",candidateMiddleware,candidateController.deleteEducation);
router.patch("/deleteJob",candidateMiddleware,candidateController.deleteJob);
router.patch("/editEducation",candidateMiddleware,candidateController.editEducation);
router.patch("/editJob",candidateMiddleware,candidateController.editJob);
router.patch("/addJobsDetail",candidateMiddleware,candidateController.addJobsDetails);
router.patch("/addRequirementsDetail",candidateMiddleware,candidateController.addRequirementsDetails);
router.patch("/sendPasswordResetOtp",candidateController.sendCandidatePasswordResetOtp);
router.patch("/passwordResetOtpVerify",candidateController.passwordResetOtpVerify);
router.patch("/resetPassword",candidateController.resetPassword);
module.exports=router;
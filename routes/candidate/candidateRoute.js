



const express = require("express");
const candidateMiddleware=require("../../middleware/candidateMiddleware")
const candidateController=require("../../controllers/candidateController");
const notificationController=require("../../controllers/notificationController");
const router=new  express.Router();

router.post("/candidateLogin",candidateController.candidateLogin);
router.post("/candidateRegister",candidateController.candidateRegister);
router.patch("/candidateVerify",candidateController.candidateVerify);
router.get("/getCandidateProfile",candidateMiddleware,candidateController.getCandidateProfile);
router.patch("/addPersonalDetail",candidateMiddleware,candidateController.addPersonalDetails);
router.patch("/addQualificationDetail",candidateMiddleware,candidateController.addQualificationDetail);
router.patch("/addEducation",candidateMiddleware,candidateController.addEducation);
router.patch("/addExperience",candidateMiddleware,candidateController.addExperience);
router.patch("/deleteEducation",candidateMiddleware,candidateController.deleteEducation);
router.patch("/deleteExperience",candidateMiddleware,candidateController.deleteExperience);
router.patch("/editEducation",candidateMiddleware,candidateController.editEducation);
router.patch("/editExperience",candidateMiddleware,candidateController.editExperience);
router.patch("/addExperiencesDetail",candidateMiddleware,candidateController.addExperiencesDetails);
router.patch("/addRequirementsDetail",candidateMiddleware,candidateController.addRequirementsDetails);
router.patch("/sendPasswordResetOtp",candidateController.sendCandidatePasswordResetOtp);
router.patch("/passwordResetOtpVerify",candidateController.passwordResetOtpVerify);
router.patch("/resetPassword",candidateController.resetPassword);
router.get("/getAllNotification",candidateMiddleware,notificationController.getAllCandidateNotification);
router.patch("/editPersonalDetail",candidateMiddleware,candidateController.editPersonalDetail);
router.patch("/addPreference",candidateMiddleware,candidateController.addPreferenceDetail);
router.patch("/saveJob",candidateMiddleware,candidateController.saveJob);
router.patch("/unSaveJob",candidateMiddleware,candidateController.unSaveJob);

module.exports=router;
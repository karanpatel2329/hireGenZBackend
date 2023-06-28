




const express=require("express")
const recruiterController=require("../../controllers/recruiterController");
const recruiterMiddleware=require("../../middleware/recruiterMiddleware");
const router=new express.Router();

router.post("/recruiterLogin",recruiterController.recruiterLogin);
router.post("/recruiterRegister",recruiterController.recruiterRegister);
router.patch("/recruiterVerify",recruiterController.recruiterVerify);
router.get("/getRecruiterProfile",recruiterMiddleware,recruiterController.getRecruiterProfile);
router.post("/addRecruiterProfile",recruiterMiddleware,recruiterController.addRecruiterProfile);
router.post("/addRecruiterCompany",recruiterMiddleware,recruiterController.addRecruiterCompany);
router.post("/postJob",recruiterMiddleware,recruiterController.postJob);
router.patch("/editPostJob",recruiterMiddleware,recruiterController.editPostJob);
router.patch("/sendPasswordResetOtp",recruiterController.sendRecruiterPasswordResetOtp);
router.patch("/passwordResetOtpVerify",recruiterController.passwordResetOtpVerify);
router.patch("/resetPassword",recruiterController.resetPassword);
router.get("/getAllApplication",recruiterMiddleware,recruiterController.getAllCandidateApplication);
router.patch("/shortlistCandidate",recruiterMiddleware,recruiterController.shortListCandidate);
router.patch("/declineCandidate",recruiterMiddleware,recruiterController.declineCandidate);
module.exports=router;
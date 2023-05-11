




const express=require("express")
const recruiterController=require("../../controllers/recruiterController");

const router=new express.Router();

router.get("/recruiterLogin",recruiterController.recruiterLogin);
router.post("/recruiterRegister",recruiterController.recruiterRegister);
router.patch("/recruiterVerify",recruiterController.recruiterVerify);
router.get("/getRecruiterProfile",recruiterController.getRecruiterProfile);
router.patch("/sendPasswordResetOtp",recruiterController.sendRecruiterPasswordResetOtp);
router.patch("/passwordResetOtpVerify",recruiterController.passwordResetOtpVerify);
router.patch("/resetPassword",recruiterController.resetPassword);
module.exports=router;
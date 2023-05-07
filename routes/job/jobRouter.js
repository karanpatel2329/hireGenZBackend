



const express=require("express")
const jobContoller=require("../../controllers/jobController");
const router=new express.Router();

router.post("/addJob",jobContoller.addJob);
router.post("applyJobById",jobContoller.applyJobById)
router.post("/getAllJobs",jobContoller.getAllJob)
router.get("/getJobById",jobContoller.getJobById);

module.exports=router;
const express=require("express");
const router=new express();
const streamController=require("../../controllers/streamController")


router.get("/getStreams",streamController.getStreams);

module.exports=router;
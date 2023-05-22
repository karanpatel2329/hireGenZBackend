const express = require("express");

const notificationController=require("../../controllers/notificationController");
const router=new  express.Router();


router.post("/sendNotification",notificationController.sendNotification);


module.exports=router;
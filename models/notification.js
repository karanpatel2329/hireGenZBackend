const mongoose=require("mongoose");
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const notificationSchema=new Schema({
    userId:{
        type:String,
        required:true,
    },
    message:{
        type:String,
    },
    image:{
        type:String,
    },
    sendId:{
        type:String
    },
    title:{
        type:String
    }
   


});

const Notification = mongoose.model("Notifications", notificationSchema);

module.exports = Notification;
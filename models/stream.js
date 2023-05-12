




const mongoose=require("mongoose");
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const streamSchema=new Schema({
    steam:{
        type:String,
    }
})
const Stream = mongoose.model("Streams", streamSchema);

module.exports = Stream;
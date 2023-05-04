const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
require("./dbConnection");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const candidateRegister=require("./routes/candidate/register");
const candidateVerify=require("./routes/candidate/verify");
const candidateLogin=require("./routes/candidate/login");

const recruiterLogin=require("./routes/recruiter/login");
const recruiterRegister=require("./routes/recruiter/register");
const recruiterVerify=require("./routes/recruiter/verify");


app.use("/candidateRegister",candidateRegister);
app.use("/candidateVerify",candidateVerify)
app.use("/candidateLogin",candidateLogin);


app.use("/recruiterLogin",recruiterLogin);
app.use("/recruiterRegister",recruiterRegister);
app.use("/recruiterVerify",recruiterVerify);

app.listen(port,()=>{
    // Callback 
    console.log(`Server running at http://localhost:${port}/`);
});
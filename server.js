const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
require("./dbConnection");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const candidateRouter=require("./routes/candidate/candidateRoute");

const recruiterRouter=require("./routes/recruiter/recruiterRoute");

const jobRouter=require("./routes/job/jobRouter");

app.use("/candidate",candidateRouter);

app.use("/recruiter",recruiterRouter)

app.use("/job",jobRouter);


app.listen(port,()=>{
    // Callback 
    console.log(`Server running at http://localhost:${port}/`);
});
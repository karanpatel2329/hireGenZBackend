const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(port,()=>{
    // Callback 
    console.log(`Server running at http://localhost:${port}/`);
});
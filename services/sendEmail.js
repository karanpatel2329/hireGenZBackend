const nodemailer = require("nodemailer");
const dotenv=require("dotenv");
dotenv.config();


const sendEmail = async (email, subject, text) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
      },
    });


    await transporter.sendMail({
      from:`HireGenZ <${process.env.EMAILUSER}>`,
      to: email,
      subject: subject,
      text: text,
    },function(error,result){
      if(error){
        console.log(error);
    console.log("email not sent");

      }
      else{
        console.log(result);
    console.log("email sent sucessfully");

      }
    });
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

// sendEmail("ptroshan0607@gmail.com","TEST","TEST")
module.exports = sendEmail;

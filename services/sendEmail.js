const nodemailer = require("nodemailer");
const {google}=require("googleapis");
const config=require("./config.js")
const dotenv=require("dotenv");
dotenv.config();
const OAuth2=google.auth.OAuth2;


const OAuth2_client=new OAuth2(config.clientId,config.clientSecret);
OAuth2_client.setCredentials({refresh_token:config.refreshToken});

const sendEmail = async (email, subject, text) => {
  try {
    const accessToken=OAuth2_client.getAccessToken();
    // console.log(accessToken);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      type:'OAuth2',
      user:config.user,
      clientId:config.clientId,
      clientSecret:config.clientSecret,
      refreshToken:config.refreshToken,
      accessToken:accessToken
      },
    });

    await transporter.sendMail({
      from:`HireGenZ <${process.env.USER}>`,
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
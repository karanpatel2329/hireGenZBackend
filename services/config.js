require('dotenv').config();

const config={
    user:process.env.EMAILUSER,
    clientId:process.env.clientId,
    clientSecret:process.env.clientSecret,
    refreshToken:process.env.refreshToken
}
// console.log(config);
module.exports=config;

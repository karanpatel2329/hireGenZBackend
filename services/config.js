require('dotenv').config();

const config={
    user:process.env.USER,
    clientId:process.env.clientId,
    clientSecret:process.env.clientSecret,
    refreshToken:process.env.refreshToken
}
// console.log(config);
module.exports=config;
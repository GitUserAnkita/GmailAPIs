const express = require('express');
const app = express();

const { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;    
const gmail = google.gmail('v1')
require('dotenv').config()

var code ;
const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID = process.env.ClientId,
  YOUR_CLIENT_SECRET = process.env.ClientSecret,
  YOUR_REDIRECT_URL = "http://localhost:3000/auth/google/callback"
);
console.log(oauth2Client)
// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "email",
  "profile"
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  // If you only need one scope you can pass it as a string
  scope: scopes
});

app.get('/auth',(req,res)=>{
    res.redirect(url)
});
app.get('/message',(req,res)=>{
  res.send("user logedin...")
})
app.get("/auth/google/callback",(req,res)=>{
    code = req.query.code
   console.log(code)
   res.redirect('/message')
   
});

// app.get('/token',(req,res)=>{
// const {tokens} =  oauth2Client.getToken(code)
// oauth2Client.setCredentials(tokens);
// console.log("token = ",tokens)
// })


app.listen(3000,()=>{
    console.log(`server is ready to prt on 3000`)
})

module.exports = app ;
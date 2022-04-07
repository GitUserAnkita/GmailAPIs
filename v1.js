const { google } = require('googleapis');
const gmail = google.gmail('v1');
const qs = require('qs')
require('dotenv').config()


  const oauth2Client = new google.auth.OAuth2(
    YOUR_CLIENT_ID = process.env.ClientId,
    YOUR_CLIENT_SECRET = process.env.ClientSecret,
    YOUR_REDIRECT_URL = "http://localhost:3000/auth/google/callback"
  );
  console.log("oauth2Client ====",oauth2Client)
  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
  ];
  
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',
    // If you only need one scope you can pass it as a string
    scope: scopes
  },(accessToken)=>{
    console.log("accessToken===",accessToken )
  });
  console.log("url ====",url)
  
  // const {tokens} = await oauth2Client.getToken("")
  //  oauth2Client.setCredentials(tokens);

  // oauth2Client.on('tokens', (tokens) => {
  //   if (tokens.refresh_token) {
  //     // store the refresh_token in my database!
  //     console.log(tokens.refresh_token);
  //   }
  //   console.log(tokens.access_token);
  // });

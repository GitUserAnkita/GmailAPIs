const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors())

const { google } = require('googleapis');
const gmail = google.gmail('v1');

var token;
var data;
var refreshToken;

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

const scopes = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "email",
  "profile"
];

// const urls = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes
// });


google.options({ auth: oauth2Client })

app.get('/auth', (req, res) => {
  // res.redirect(urls)
  const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});
console.log(url)
  res.status(200).send({url:url})
});

app.get("/auth/google/callback", async (req, res) => {
  var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  code = req.query.code
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);
  token = tokens.id_token
  refreshToken = tokens.refresh_token
  
  // res.status(200).send(token)
  res.redirect(`http://localhost:3001/GoogleLogin?token=${token}&refreshToken=${refreshToken}`);
});

app.get('/inbox', async (req, res) => {
  var messageDataArray = []
  var token = req.headers.token;
  var decoded = jwt.decode(token);
  var email = decoded.email

  // var oauth2 = google.oauth2({
  //   auth: oauth2Client,
  //   version: 'v2'
  // });

  const result = await gmail.users.messages.list({
    userId: email,
  });
  console.log(result.data.messages);
  for (var i = 0; i < 4; i++) {
    messagId = result.data.messages[i].id;
    console.log(messagId)
    messageData = await gmail.users.messages.get({
      id: messagId,
      userId: email,
    });
    messageDataArray.push(messageData.data)
  }
  res.status(200).send(messageDataArray)
})


app.get('/verify',(req, res) =>{
  var token = req.headers.token
  var decoded = jwt.decode(token);
  var exp = decoded.exp;
  // exp in millis
 if (exp < Date.now() / 1000) {
    res.status(400).send({status:false,message:"token expired"})
  }else{
    res.status(200).send({status:true , message:"token valid"})
  }
});


app.listen(3000, () => {
  console.log(`server is ready to prt on 3000`)
})

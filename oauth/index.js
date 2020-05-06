const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var auth;

function init(oauth)
{
   auth = oauth;
   createsheet();
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), init);
  // authorize(JSON.parse(content), appendData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function createsheet() {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.create({
    auth: auth,
    resource: {
        properties:{
            title: "sheet2"
        }
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Added");
        JSON.stringify(response);
        const spreadsheetId=response.data.spreadsheetId;
        console.log(spreadsheetId);

        appendData(auth,spreadsheetId);
     // deletesheet(auth);       
    }  
});
}
  function appendData(auth,spreadsheetId) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId:spreadsheetId,
      range: 'Sheet1!A1:B', //Change Sheet1 if your worksheet sheet name is something else
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [ ["Roll No", "Name", "Atttendance"] ]
      }
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      } else {
          console.log("Appended");
          console.log(spreadsheetId);
      }
    });
  }
  function deletesheet(auth,spreadsheetId) {   
      var sheets = google.sheets('v4');
      sheets.spreadsheets.batchUpdate({
      auth:auth,
      spreadsheetId:spreadsheetId,
      requestBody:{
             requests :[{ 
                 deleteSheet : {
                     sheetId:0 //sheetid here is an int of each sheet in a spreadsheet   
                 }
             }]
      }
    });
}
module.exports=createsheet;
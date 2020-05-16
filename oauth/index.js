const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var dataa ={
  semester : "S8-CSE",
  subjectName : "Data Mining",
  subjectCode:"CS410",
  teacher : "Dr Salim A",
  student :[
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:2,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    },
    {
      rollNo:1,
      name:"saran"
    }

  ]
};
var attendance ={
  noofhours:2,
  date:"16/9",
  day:"Mon",
 list:["P","A","P","P","A","P","P","A","P","A","P"]
};

var auth;
var a=0;
function init(oauth)
{
  auth = oauth;
  // createsheet(dataa);
  appendData("1SmXqlgESv6luhhsfyWDAinnUjoNwtyfifknrTxIntDI",attendance,attendance.noofhours);
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

//create google sheet return spreadsheetId
function createsheet(dataa,callback) {
// function createsheet(dataa) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.create({
    auth: auth,
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Added");
        JSON.stringify(response);
        const spreadsheetId=response.data.spreadsheetId;
        console.log(spreadsheetId);                           //remove
        // sheetData(spreadsheetId,dataa);
        getData(spreadsheetId);
        sheetData(spreadsheetId,dataa);
        calculate(spreadsheetId);
        // callback(spreadsheetId);     
    }  
});
}


function getData(spreadsheetId) {
  var sheets = google.sheets('v4');
 //add 0 to a cell to use for calculate function
 sheets.spreadsheets.batchUpdate({
  auth:auth,
  spreadsheetId:spreadsheetId,     
  requestBody : {
    requests :[ 
  {
    
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :111,
          endRowIndex:112,
          startColumnIndex:0,
          endColumnIndex:1
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredValue: { numberValue: 0},
            userEnteredFormat : {
              verticalAlignment:"Middle",
              backgroundColor:{
                red :0,
                green :0,
                blue :0
              },
              "textFormat": {
                "foregroundColor": {
                  "red": 1.0,
                  "green": 1.0,
                  "blue": 1.0
                },
                "fontSize": 10,
                "bold": true
              }
            }
         }]
        }]
      }
  }]
}
})
}

//static design of the google sheet
function mergecells(spreadsheetId,dataa){
  var sheets = google.sheets('v4');
  sheets.spreadsheets.batchUpdate({
        auth:auth,
        spreadsheetId:spreadsheetId,     
        requestBody : {
          requests :[ 
        {
        //title of the spreadsheet
       "updateSpreadsheetProperties": {
           "properties": {"title": dataa.subjectName +"-"+ dataa.subjectCode+"-"},
           "fields": "title"
        }
        },
       
           {
             //column 1 border white
            "updateBorders":{
               "range": {
                 "sheetId": 0,
                 "startColumnIndex": 0,
                 "endColumnIndex": 1
               },
               "right": {
                 "style": "dashed",
                 "width": 1,
                 "color": {
                   "red" :1,
                   "blue" :1,
                   "green" :1
                 }
                }     
                 } 
           },
           
          {
            //print row 1
                updateCells : {
                range : {
                sheetId : 0,
                startRowIndex :0,
                endRowIndex:1,
                startColumnIndex:2,
                endColumnIndex:3
              },
              fields: '*',
              rows : [{
                values : [{
                  userEnteredValue: { stringValue: "                                                         Enter P for Present, A for Present                                        Scroll right to see the Attendance tab                               "},
                  userEnteredFormat : {
                    verticalAlignment:"Middle",
                    backgroundColor:{
                      red :0.19,
                      green :0.19,
                      blue :0.6
                    },
                    "textFormat": {
                      "foregroundColor": {
                        "red": 1.0,
                        "green": 1.0,
                        "blue": 1.0
                      },
                      "fontSize": 10,
                      "bold": true
                    }
                  }
               }]
              }]
            }
           },

            //merge cells first row  
            {
              mergeCells : {
                range : {
                  sheetId : 0,
                  startRowIndex :0,
                  endRowIndex:1,
                  startColumnIndex:2,
                  endColumnIndex:100
                }
              }     
            },
           {
             //color a1 
            updateCells : {
            range : {
            sheetId : 0,
            startRowIndex :0,
            endRowIndex:1,
            startColumnIndex:0,
            endColumnIndex:1,
          },
          fields: '*',
          rows : [{
            values : [{
              userEnteredFormat : {
               backgroundColor:{
                red :0.19,
                green :0.19,
                blue :0.6
              }
              }
           }]
          }]
        }
       },
  
  {
    //b1 data + colour
        updateCells : {
        range : {
        sheetId : 0,
        startRowIndex :0,
        endRowIndex:1,
        startColumnIndex:1,
        endColumnIndex:2
      },
      fields: '*',
      rows : [{
        values : [{
          userEnteredFormat : {
            verticalAlignment:"Middle",
            backgroundColor:{
              red :0.19,
              green :0.19,
              blue :0.6
            },
            "textFormat": {
              "foregroundColor": {
                "red": 0.999,
                "green": 0.9215,
                "blue": 0
              },
              "fontSize": 14,
              "bold": true
            }
          },
          userEnteredValue: { stringValue: " CLASSES :"}
       }]
      }]
    }
   },  

           {
             //first row wide
            "updateDimensionProperties":{
              "range": {
                "sheetId": 0,
                "dimension": "ROWS",
                "startIndex": 0,
                "endIndex": 1
              },
              "properties": {
                "pixelSize": 48
              },
              "fields": "pixelSize"
            }
           },
           {
             //first column thin
            "updateDimensionProperties": {
              "range": {
                "sheetId": 0,
                "dimension": "COLUMNS",
                "startIndex": 0,
                "endIndex": 1
              },
              "properties": {
                "pixelSize": 25
              },
              "fields": "pixelSize"
            }
          },

           {
             //all column line white
            "updateBorders":{
               "range": {
                 "sheetId": 0,
                 "startRowIndex": 1,
                 "endRowIndex": 100,
                 "startColumnIndex": 2,
                 "endColumnIndex": 100
               },
               "innerVertical": {
                 "style": "Dashed",
                 "width": 1,
                 "color": {
                   red :1,
                   blue :1,
                   green :1
                 }
                }     
                 } 
           },
           {
             //cell 1 right border blue
            "updateBorders":{
               "range": {
                 "sheetId": 0,
                 "startColumnIndex": 0,
                 "endColumnIndex": 1,
                 "startRowIndex": 0,
                 "endRowIndex": 1

               },
               "right": {
                 "style": "none",
                 "width": 1,
                 "color": {
                   red :0.19,
                   blue :0.19,
                   green :0.6
                 }
                }     
                 } 
           },
          {
            // column 1 wide
            "updateDimensionProperties": {
              "range": {
                "sheetId": 0,
                "dimension": "COLUMNS",
                "startIndex": 1,
                "endIndex": 2
              },
              "properties": {
                "pixelSize": 150
              },
              "fields": "pixelSize"
            }
          },
          {
            //row 2 wide
            "updateDimensionProperties": {
              "range": {
                "sheetId": 0,
                "dimension": "ROWS",
                "startIndex":1,
                "endIndex":2
              },
              "properties": {
                "pixelSize": 20
              },
              "fields": "pixelSize"
            }
          },
         
            {
              //row 2-3 border thick
            "updateBorders":{
               "range": {
                 "sheetId": 0,
                 "startRowIndex": 2,
                 "endRowIndex": 3
               },
               "bottom": {
                 "style": "Solid_thick",
                 "width": 20,
                 "color": {
                   red :0.8,
                   blue :0.8,
                   green :0.8
                 }
             }     
               } 
           },
          {
            //column 1-2 border thick
           "updateBorders":{
              "range": {
                "sheetId": 0,
                "startColumnIndex": 1,
                "endColumnIndex": 2
              },
              "right": {
                "style": "Solid_thick",
                "width": 20,
                "color": {
                  red :0.8,
                  blue :0.8,
                  green :0.8
                }
            }     
              } 
          },
          
          {
            //row 1-2 border dash-white
            "updateBorders":{
               "range": {
                 "sheetId": 0,
                 "startRowIndex": 1,
                 "endRowIndex": 2
               },
               "bottom": {
                 "style": "dashed",
                 "width": 1,
                 "color": {
                   red :1,
                   blue :1,
                   green :1
                 }
               }          
             } 
           },

          ]
         }
        })
 
}

{    // append static class details
  function sheetData(spreadsheetId,dataa) {
   var sheets = google.sheets('v4');
   var values=[];  
   for(key of dataa.student)
   {
     values.push(
       {
         values : [{
          userEnteredValue :{
               numberValue : key["rollNo"] 
          },
          userEnteredFormat:{
            horizontalAlignment :"center",
            "textFormat": {
              "foregroundColor": {
                "red": 0,
                "green": 0,
                "blue": 0
              },
              "fontSize": 10,
              "bold": true
            },
          }  
       }
       ,
       {
         userEnteredValue :{
              stringValue : key["name"]
         },
         userEnteredFormat:{
           horizontalAlignment :"center",
           "textFormat": {
             "foregroundColor": {
               "red": 0,
               "green": 0,
               "blue": 0
             },
             "fontSize": 10,
             "bold": true
           },
         }
         
      },
     ]
     }
     )
   }
   sheets.spreadsheets.batchUpdate({
    auth:auth,
   spreadsheetId:spreadsheetId,     
   requestBody : {
     requests :[
{
  //dataa data entry
  updateCells : {
  range : {
  sheetId : 0,
  startRowIndex:3,
  endRowIndex:80,
  startColumnIndex :0,
  endColumnIndex:2,
   },
 fields: '*',
  rows : values
}

}
,
{
  //dataa semster
  updateCells : {
  range : {
  sheetId : 0,
  startRowIndex:1,
  endRowIndex:2,
  startColumnIndex :1,
  endColumnIndex:2,
   },
 fields: '*',
  rows :[{
    values:{
      userEnteredValue :{
           stringValue : dataa.semester
      },
      userEnteredFormat:{
        horizontalAlignment :"center",
        "textFormat": {
          "foregroundColor": {
            "red": 0,
            "green": 0,
            "blue": 1
          },
          "fontSize": 12,
          "bold": true
        },
      }
      
   }
  }] 
}
},
{
//dataa teacher name
updateCells : {
range : {
sheetId : 0,
startRowIndex:2,
endRowIndex:3,
startColumnIndex :1,
endColumnIndex:2,
},
fields: '*',
rows :[{
values:{
  userEnteredValue :{
       stringValue : dataa.teacher
  },
  userEnteredFormat:{
    horizontalAlignment :"center",
    "textFormat": {
      "foregroundColor": {
        "red": 0,
        "green": 0,
        "blue": 1
      },
      "fontSize": 10,
      "bold": true
    },
  }
  
}
}] 
}
}
]
   }
 })
 mergecells(spreadsheetId,dataa);
}

}


{   
   // append attendance taken periodwise
  function appendData(spreadsheetId,attendance,hours) {
   var sheets = google.sheets('v4');
   var details=[];  
   details.push({
    values: [{
      userEnteredValue :{
           stringValue : attendance["date"]
      },
      userEnteredFormat:{
        horizontalAlignment :"center",
        "textFormat": {
          "foregroundColor": {
            "red": 0.439,
            "green": 0.439,
            "blue": 0.439
          },
          "fontSize": 10,
          "bold": true
        },
      }
   
    }]
  });
  details.push({
    values: [{
      userEnteredValue :{
           stringValue : attendance["day"]
      },
      userEnteredFormat:{
        horizontalAlignment :"center",
        "textFormat": {
          "foregroundColor": {
            "red": 0.439,
            "green": 0.439,
            "blue": 0.439
          },
          "fontSize": 10,
          "bold": true
        },
      }
   
    }]
  });
    
    
   for(key of attendance["list"])
   {
     details.push({
          values: [{
          userEnteredValue :{
               stringValue : key
          },
          userEnteredFormat:{
            horizontalAlignment :"center",
            "textFormat": {
              "foregroundColor": {
                "red": 0.439,
                "green": 0.439,
                "blue": 0.439
              },
              "fontSize": 10,
              "bold": true
            },
          }
          
       },
     ] 
  })
 }
  
 sheets.spreadsheets.values.get({
  auth: auth,
  spreadsheetId: spreadsheetId,
  range: 'Sheet1!A112:A112', 
}, (err, response) => {
    a=Number(response.data.values);

 
 sheets.spreadsheets.batchUpdate({
   auth:auth,
   spreadsheetId:spreadsheetId,     
   requestBody : {
     requests :[
      
      {
        //dupe print absent at a110
            updateCells : {
            range : {
            sheetId : 0,
            startRowIndex :109,
            endRowIndex:110,
            startColumnIndex:0,
            endColumnIndex:1
          },
          fields: '*',
          rows : [{
            values : [{
              userEnteredFormat : {
                verticalAlignment:"Top",
                horizontalAlignment:"center",
                backgroundColor:{
                  red :0.19,
                  green :0.19,
                  blue :0.6
                },
                "textFormat": {
                  "foregroundColor": {
                    "red": 0.19,
                    "green": 0.19,
                    "blue": 0.6
                  },
                  "fontSize": 14,
                  "bold": true
                }
              },
              userEnteredValue: { formulaValue :'=countif($C4:$W4,"A")' }
           }]
          }]
        }
       },
       {
        //dupe print present at a111
            updateCells : {
            range : {
            sheetId : 0,
            startRowIndex :110,
            endRowIndex:111,
            startColumnIndex:0,
            endColumnIndex:1
          },
          fields: '*',
          rows : [{
            values : [{
              userEnteredFormat : {
                verticalAlignment:"Top",
                horizontalAlignment:"center",
                backgroundColor:{
                  red :0.19,
                  green :0.19,
                  blue :0.6
                },
                "textFormat": {
                  "foregroundColor": {
                    "red": 0.19,
                    "green": 0.19,
                    "blue": 0.6
                  },
                  "fontSize": 14,
                  "bold": true
                }
              },
              userEnteredValue: { formulaValue :'=countif($C4:$W4,"P")' }
           }]
          }]
        }
       },
        {
        //dupe print sum at a112
            updateCells : {
            range : {
            sheetId : 0,
            startRowIndex :111,
            endRowIndex:112,
            startColumnIndex:0,
            endColumnIndex:1
          },
          fields: '*',
          rows : [{
            values : [{
              userEnteredFormat : {
                verticalAlignment:"Top",
                horizontalAlignment:"center",
                backgroundColor:{
                  red :0.19,
                  green :0.19,
                  blue :0.6
                },
                "textFormat": {
                  "foregroundColor": {
                    "red": 0.19,
                    "green": 0.19,
                    "blue": 0.6
                  },
                  "fontSize": 14,
                  "bold": true
                }
              },
              userEnteredValue: { formulaValue :'=($A110+$A111)' }
           }]
          }]
        }
       },
      
    { 
       updateCells : {
         range : {
         sheetId : 0,
         startRowIndex:1,
         endRowIndex:100,
         startColumnIndex :2+a,
         endColumnIndex:3+a,
          },
        fields: '*',
         rows : details 
     }  
     },
   
     {
      //all column line white
     "updateBorders":{
        "range": {
          "sheetId": 0,
          "startRowIndex": 1,
          "endRowIndex": 100,
          "startColumnIndex": 2,
          "endColumnIndex": 100
        },
        "innerVertical": {
          "style": "Dashed",
          "width": 1,
          "color": {
            red :1,
            blue :1,
            green :1
          }
         }     
          } 
     },
     {
      //row 2-3 border thick
    "updateBorders":{
       "range": {
         "sheetId": 0,
         "startRowIndex": 2,
         "endRowIndex": 3
       },
       "bottom": {
         "style": "Solid_thick",
         "width": 20,
         "color": {
           red :0.8,
           blue :0.8,
           green :0.8
         }
     }     
       } 
   },
   {
    //row 1-2 border dash-white
    "updateBorders":{
       "range": {
         "sheetId": 0,
         "startRowIndex": 1,
         "endRowIndex": 2
       },
       "bottom": {
         "style": "dashed",
         "width": 1,
         "color": {
           red :1,
           blue :1,
           green :1
         }
       }          
     } 
   },
    ]
   }
  },(replies)=>{
    if(hours>1)
    {
      appendData(spreadsheetId,attendance,hours-1);
    }
  }

  )

}
);
  //  calculate(spreadsheetId);
  }
}


var x="4";
//formula stats
function calculate(spreadsheetId)
{
  var sheets = google.sheets('v4');
  var details=[];  
  for(i=0;i<attendance['list'].length;i++)
  {
    //pformula

    details.push({
         values: [{
         userEnteredValue :{
          formulaValue :'=countif($C'+x+':$W'+x+',"P")'
         },
         userEnteredFormat:{
           horizontalAlignment :"center",
           backgroundColor:{
            "red": 0.839,
                "green": 0.839,
                "blue": 0.839
          },
           "textFormat": {
             "foregroundColor": {
               "red": 0.439,
               "green": 0.439,
               "blue": 0.439
             },
             "fontSize": 10,
             "bold": true
           },
         }
         
      },
    ] 
 })
 x=(parseInt(x)+1).toString();
}

sheets.spreadsheets.batchUpdate({
  auth:auth,
  spreadsheetId:spreadsheetId,     
  requestBody : {
    requests :[{
      updateCells : {
        range:{
        sheetId : 0,
        startRowIndex:3,
        endRowIndex:100,
        startColumnIndex :23,
        endColumnIndex:24,
         },
       fields: '*',
        rows : details 
    }  
    }]
  }
})
var z="4";
var sheets = google.sheets('v4');
  var details=[];  
  for(i=0;i<attendance['list'].length;i++)
  {
    //aformula
    details.push({
         values: [{
         userEnteredValue :{
          formulaValue :'=countif($C'+z+':$W'+z+',"A")'
         },
         userEnteredFormat:{
           horizontalAlignment :"center",
           backgroundColor:{
            "red": 0.839,
                "green": 0.839,
                "blue": 0.839
          },
           "textFormat": {
             "foregroundColor": {
              "red": 0.439,
               "green": 0.439,
               "blue": 0.439
             },
             "fontSize": 10,
             "bold": true
           },
         }
         
      },
    ] 
 })
 z=(parseInt(z)+1).toString();
}
sheets.spreadsheets.batchUpdate({
  auth:auth,
  spreadsheetId:spreadsheetId,     
  requestBody : {
    requests :[
     
      {
      updateCells : {
        range:{
        sheetId : 0,
        startRowIndex:3,
        endRowIndex:100,
        startColumnIndex :24,
        endColumnIndex:25,
         },
       fields: '*',
        rows : details 
    }  
    }]
  }
})

var y="4";
var sheets = google.sheets('v4');
  var details=[];  
  for(i=0;i<attendance['list'].length;i++)
  {
    //avgformula
    details.push({
         values: [{
         userEnteredValue :{
          formulaValue :'=(($X'+y+'/$A1)*100)'
         },
         userEnteredFormat:{
           horizontalAlignment :"center",
           backgroundColor:{
            "red": 0.839,
                "green": 0.839,
                "blue": 0.839
          },
           "textFormat": {
             "foregroundColor": {
               "red": 0.439,
               "green": 0.439,
               "blue": 0.439
             },
             "fontSize": 10,
             "bold": true
           },
         }
         
      },
    ] 
 })
 y=(parseInt(y)+1).toString();
}
sheets.spreadsheets.batchUpdate({
  auth:auth,
  spreadsheetId:spreadsheetId,     
  requestBody : {
    requests :[{
      updateCells : {
        range:{
        sheetId : 0,
        startRowIndex:3,
        endRowIndex:100,
        startColumnIndex :25,
        endColumnIndex:26,
         },
       fields: '*',
        rows : details 
    }  
    },
    {
      //dupe print at a1
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :0,
          endRowIndex:1,
          startColumnIndex:0,
          endColumnIndex:1
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredFormat : {
              verticalAlignment:"Top",
              horizontalAlignment:"center",
              backgroundColor:{
                red :0.19,
                green :0.19,
                blue :0.6
              },
              "textFormat": {
                "foregroundColor": {
                  "red": 0.19,
                  "green": 0.19,
                  "blue": 0.6
                },
                "fontSize": 14,
                "bold": true
              }
            },
            userEnteredValue: { formulaValue :'=($X4+$Y4)' }
         }]
        }]
      }
     },
    {
      //total class no print at b1
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :0,
          endRowIndex:1,
          startColumnIndex:1,
          endColumnIndex:2
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredFormat : {
              verticalAlignment:"Middle",
              horizontalAlignment:"center",
              backgroundColor:{
                red :0.19,
                green :0.19,
                blue :0.6
              },
              "textFormat": {
                "foregroundColor": {
                  "red": 0.999,
                  "green": 0.9215,
                  "blue": 0
                },
                "fontSize": 10,
                "bold": true
              }
            },
            userEnteredValue: { formulaValue :'=CONCATENATE("CLASSES : ",A1)' }
         }]
        }]
      }
     },
     {
       //p
      updateCells : {
        range : {
        sheetId : 0,
        startRowIndex :1,
        endRowIndex:2,
        startColumnIndex:23,
        endColumnIndex:24
      },
      fields: '*',
      rows : [{
        values : [{
          userEnteredFormat : {
            verticalAlignment:"top",
            horizontalAlignment:"center",
            backgroundColor:{
              "red": 0.839,
              "green": 0.839,
              "blue": 0.839
            },
            "textFormat": {
              "foregroundColor": {
                red :0.19,
                green :0.19,
                blue :0.6
              },
              "fontSize": 14,
              "bold": true
            }
          },
          userEnteredValue: { stringValue :"P" }
       }]
      }]
    }
     },
     {
      //a
     updateCells : {
       range : {
       sheetId : 0,
       startRowIndex :1,
       endRowIndex:2,
       startColumnIndex:24,
       endColumnIndex:25
     },
     fields: '*',
     rows : [{
       values : [{
         userEnteredFormat : {
           verticalAlignment:"Top",
           horizontalAlignment:"center",
           backgroundColor:{
            "red": 0.839,
               "green": 0.839,
               "blue": 0.839
           },
           "textFormat": {
             "foregroundColor": {
              red :0.19,
              green :0.19,
              blue :0.6
             },
             "fontSize": 14,
             "bold": true
           }
         },
         userEnteredValue: { stringValue :"A" }
      }]
     }]
   }
    },
    {
      //avg
     updateCells : {
       range : {
       sheetId : 0,
       startRowIndex :1,
       endRowIndex:2,
       startColumnIndex:25,
       endColumnIndex:26
     },
     fields: '*',
     rows : [{
       values : [{
         userEnteredFormat : {
           verticalAlignment:"Top",
           horizontalAlignment:"center",
           backgroundColor:{
            "red": 0.839,
               "green": 0.839,
               "blue": 0.839
           },
           "textFormat": {
             "foregroundColor": {
              red :0.19,
              green :0.19,
              blue :0.6
             },
             "fontSize": 10,
             "bold": true
           }
         },
         userEnteredValue: { stringValue :"Average" }
      }]
     }]
   }
    },
    {
      addConditionalFormatRule:{
        index:0,
        rule:{
          ranges:[{
            sheetId : 0,
            startRowIndex :2,
            endRowIndex:100,
            startColumnIndex:25,
            endColumnIndex:26      
          },],
          booleanRule:{
            condition:{
              type : "NUMBER_LESS",
              values:[{
                userEnteredValue: "75"

              }]
            },
            format:{
              backgroundColor:{
                "red": 1,
                "green": 1,
                "blue": 0,
                "alpha":0
              }
            }

          }
        }
      }
    },
    {
      //grey at row 2 column X 
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :2,
          endRowIndex:3,
          startColumnIndex:23,
          endColumnIndex:24
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredFormat : {
              backgroundColor:{
                "red": 0.839,
                "green": 0.839,
                "blue": 0.839
              }
            }
         }]
        }]
      }
     },
     {
      //grey at row 1 column Y
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :2,
          endRowIndex:3,
          startColumnIndex:24,
          endColumnIndex:25
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredFormat : {
              backgroundColor:{
                "red": 0.839,
                "green": 0.839,
                "blue": 0.839
              }
            }
         }]
        }]
      }
     },
     {
      //grey at row 1 column Z
          updateCells : {
          range : {
          sheetId : 0,
          startRowIndex :2,
          endRowIndex:3,
          startColumnIndex:25,
          endColumnIndex:26
        },
        fields: '*',
        rows : [{
          values : [{
            userEnteredFormat : {
              backgroundColor:{
                "red": 0.839,
                "green": 0.839,
                "blue": 0.839
              }
            }
         }]
        }]
      }
     },
     {
      //row 2-3 border thick
    "updateBorders":{
       "range": {
         "sheetId": 0,
         "startRowIndex": 2,
         "endRowIndex": 3
       },
       "bottom": {
         "style": "Solid_thick",
         "width": 20,
         "color": {
           red :0.8,
           blue :0.8,
           green :0.8
         }
     }     
       } 
   },
   {
    //row 1-2 border dash-white
    "updateBorders":{
       "range": {
         "sheetId": 0,
         "startRowIndex": 1,
         "endRowIndex": 2,
         "startColumnIndex": 23,
         "endColumnIndex": 26
       },
       "bottom": {
         "style": "dashed",
         "width": 1,
         "color": {
           red :0.839,
           blue :0.839,
           green :0.839
         }
       }          
     } 
   }

  ]
  }
})
 }

 module.exports=createsheet;
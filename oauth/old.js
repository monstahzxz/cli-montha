const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


var dataa ={
  semester : "S8-CSE",
  subject : "Data Mining-CS410",
  teacher : "Dr Salim A",
  student : {
    1 : "Saran",
    2 : "Sonu",
    3 : "Vimal",
    4 : "Vivi",
    5 : "Sabu",
    6 : "Sanju",
    7 : "Testh",
    8 : "Akhil",
    9 : "Maddy",
    10 : "Jk",
    11 : "Pandi"
  }
};
var attendance ={
  date:"16/9",
  day:"Mon",
 list:["P","A","P","P","A","P","P","A","P","A","P"]
};
// const x=11;
// console.log(dataa.subject);
var auth;

function init(oauth)
{
   auth = oauth;
  //  calculate("1SOiLBW8It4LCdIcr6jrljiQnDZ0T43kDdJafkcFogCE");
    // createsheet(dataa);
   appendData("1SOiLBW8It4LCdIcr6jrljiQnDZ0T43kDdJafkcFogCE",attendance);
  

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


// function createsheet(dataa,callback) {
function createsheet(dataa) {
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
        sheetData(spreadsheetId,dataa);
        // calculate(spreadsheetId);
        // callback(spreadsheetId);     
    }  
});
}


//   function deletesheet(spreadsheetId) {   
//       var sheets = google.sheets('v4');
//       sheets.spreadsheets.batchUpdate({
//       auth:auth,
//       spreadsheetId:spreadsheetId,
//       requestBody:{
//              requests :[{ 
//                  deleteSheet : {
//                      sheetId:0 //sheetid here is an int of each sheet in a spreadsheet   
//                  }
//              }]
//       }
//     });
// }


function mergecells(spreadsheetId,dataa){
  var sheets = google.sheets('v4');
 

  sheets.spreadsheets.batchUpdate({
        auth:auth,
        spreadsheetId:spreadsheetId,     
        requestBody : {
          requests :[ 
        {
        //title
       "updateSpreadsheetProperties": {
           "properties": {"title": dataa.subject},
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
            //print
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
                  userEnteredValue: { stringValue: "            Enter P for Present, L for Late, E for Excused absence, and U for Unexcused absence. Use the 'Attendance key' tab to customize.                               "},
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
    //b1
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

{    // append attendance taken
  function sheetData(spreadsheetId,dataa) {
   var sheets = google.sheets('v4');
   var values=[];  
   for(key in dataa.student)
   {
     values.push(
       {
         values : [{
          userEnteredValue :{
               stringValue : key 
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
              stringValue : dataa.student[key]
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
  //dataa data
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
  //dataa data
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
//dataa data
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

{    // append attendance taken
  function appendData(spreadsheetId,attendance) {
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
 sheets.spreadsheets.batchUpdate({
   auth:auth,
   spreadsheetId:spreadsheetId,     
   requestBody : {
     requests :[
       {
        
          insertRange :{
            range:{
              sheetId : 0,
              startRowIndex:1,
              endRowIndex:100,
              startColumnIndex :2,
              endColumnIndex:3,
            },
            shiftDimension:"Columns"
          }
         },
         { 
       updateCells : {
         range : {
         sheetId : 0,
         startRowIndex:1,
         endRowIndex:100,
         startColumnIndex :2,
         endColumnIndex:3,
          },
        fields: '*',
         rows : details 
     }  
     },
     {
      insertRange :{
        range:{
          sheetId : 0,
          startRowIndex:1,
          endRowIndex:100,
          startColumnIndex :2,
          endColumnIndex:3,
        },
        shiftDimension:"Columns"
      }
     }
     ,
     {
      deleteDimension:{
        range:{
          "sheetId": 0,
          dimension:"Columns",
          "startIndex": 2,
          "endIndex": 3
        }
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
   {
    //print with color
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
          },
          userEnteredValue: { stringValue: "            Enter P for Present, L for Late, E for Excused absence, and U for Unexcused absence. Use the 'Attendance key' tab to customize.                               "},
       }]
      }]
    }
   }
     
    ]
   }
  })
  // calculate(spreadsheetId);
  }
}
var x="4";
//formula
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
    requests :[{
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
      //p
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
      //p
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
      //yellow at row 1 column 10,11,12
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
      //yellow at row 1 column 10,11,12
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
      //yellow at row 1 column 10,11,12
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
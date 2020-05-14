  
   sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A112:A112', 
  }, (err, response) => {
    // if (err) {
    //   console.log('The API returned an error: ' + err);
    //   return;
    // } 
    // var rows = response.data.values;
    // if (rows.length === 0) {
      // console.log('No data found.');
    // } else {
      // for (var i = 0; i<=rows.length; i++) {
        // const row = rows[0];
        var a=Number(response.data.values);
        // console.log(rows);
        // console.log(row.join(", "));
      // }
      console.log(a);
    // }
  }
  );
// var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// var pwdLen = 10;
// var randPassword = Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');


//delete[obj:key];
'use strict';
var crypto = require('crypto');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
var a = genRandomString(10);
console.log(a);




sub = {
    subjectCode:code,
    subjectName:name,
    semester:semester,
    teacher:result[choice].name,
    spreadsheetid
}



createsheet({
    semester:semester,
    subjectCode:code,
    teacher: result[choice].name,
    subjectName:name
},function(spreadsheetId){
    sub = {
        subjectCode:code,
        subjectName:name,
        semester:semester,
        teacher:result[choice]._id,
        spreadsheetId:spreadsheetId
    }
    addSubject(sub,function(){
        callback();
    });
});
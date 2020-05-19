#!/usr/bin/env node
var readline = require('readline');
var fs = require('fs');

'use strict';
var crypto = require('crypto');



const {
    addUser,
    findUser,
    updateUser,
    removeUser,
    listUser,
    addSubject,
    findSubject,
    removeSubject,
    listSubjects,
    findStudents,
    deleteStudents,
    addStudents,
    getsheetid
} = require('./index.js');

const {
    updatedata,
    createsheet
} = require('./oauth/index.js');

var interface = readline.createInterface({
    input : process.stdin,
    output :process.stdout,
    terminal:false,
    prompt : '>> '
});

interface.prompt();

interface.on('line',function(str){
    processString(str,function(){
        interface.prompt();
    });
    
    //processFlags(str);
});

// processFlags = function(str){
//     flags = str.split('--');
    
// }

function password_generator(){
    var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var pwdLen = 10;
    var randPassword = Array(pwdLen).fill(pwdChars).map(function(x) {
        return x[Math.floor(Math.random() * x.length)] 
    }).join('');
    return randPassword;
};
// var genRandomString = function(length){
//     return crypto.randomBytes(Math.ceil(length/2))
//             .toString('hex') /** convert to hexadecimal format */
//             .slice(0,length);   /** return required number of characters */
// };

// var sha512 = function(password, salt){
//     var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
//     hash.update(password);
//     var value = hash.digest('hex');
//     return {
//         salt:salt,
//         passwordHash:value
//     };
// };

// function saltHashPassword(userpassword) {
//     var salt = genRandomString(10); /** Gives us salt of length 16 */
//     var passwordData = sha512(userpassword, salt);
//     console.log('UserPassword = '+userpassword);
//     console.log('Passwordhash = '+passwordData.passwordHash);
//     console.log('nSalt = '+passwordData.salt);
// }

processString = function(str,callback){
    if(str == 'addUser'){
        interface.question('username : ',(username) => {
            interface.question('email: ',(email) =>{
                interface.question('phone number: ',(phnno) =>{
                    user = {name:username,password:password_generator(),email:email,phnNo:phnno};
                    addUser(user,function(){
                        callback();
                    });
                })
            })
        });
        
    }
    else if(str == 'findUser' || str == '--fu'){
        interface.question('name of user: ',(name) => {
            findUser(name,function(result){
                console.info(result);
                callback();
            });
        });
    }
    else if(str == 'updateUser' || str == '--uu'){
        interface.question('enter the id of user : ',(_id) => {
            interface.question('new name: ',(username) => {
                interface.question('new password: ',(password) =>{
                    interface.question('new email: ',(email) =>{
                        interface.question('new phnno: ',(phnno) => {
                            user = {name:username,password:password,email:email,phnNo:phnno};
                            updateUser(_id,user,function(){
                                callback();
                            });
                        })   
                    })
                })
            })
        });
    } 
    else if(str == 'removeUser' || str == '--ru'){
        interface.question('enter the id of user : ',(_id) =>{
            removeUser(_id,function(){
                callback();
            });
        });
    } 
    else if(str =='listUsers' || str == '--lu'){
        listUser(function(res){
            console.log(res);
            callback();
        });
    }
    else if(str == 'addSubject' || str== '--as'){
        //var id;
        var choice;
        interface.question('Subject code : ', (code) => {
            interface.question('Subject name: ',(name) =>{
                interface.question('Semester: ',(semester) =>{
                    interface.question('Teacher: ',(teacher) =>{
                        findUser(teacher,(result) =>{ 
                            if(result.length > 1){
                                console.log(result);
                                interface.question('multiple users found, please select one (1 to n): ',(c) =>{
                                    choice = c-1;
                                    findStudents(semester,(results) =>{
                                        createsheet({
                                            semester:semester,
                                            subjectCode:code,
                                            teacher: result[choice].name,
                                            subjectName:name,
                                            students:results
                                        },(spreadsheetId) => {
                                            sub = {
                                                subjectCode:code,
                                                subjectName:name,
                                                semester:semester,
                                                teacher:result[choice]._id,
                                                googleSheetId:spreadsheetId
                                            }
                                            addSubject(sub,function(){
                                                callback();
                                            });
                                        });
                                    });
                                })
                            }
                            else{
                                choice = 0;
                                findStudents(semester,(results) =>{
                                    createsheet({
                                        semester:semester,
                                        subjectCode:code,
                                        teacher: result[choice].name,
                                        subjectName:name,
                                        students:results
                                    },(spreadsheetId) => {
                                        sub = {
                                            subjectCode:code,
                                            subjectName:name,
                                            semester:semester,
                                            teacher:result[choice]._id,
                                            googleSheetId:spreadsheetId
                                        }
                                        addSubject(sub,function(){
                                            callback();
                                        });
                                    });
                                });
                            }
                            

                        });
                    })
                })
            })
        });
    }
    else if(str == 'findSubject' || str =='--fs'){
        interface.question('name of subject: ',(name) =>{
            findSubject(name,function(result){
                console.info(result);
                callback();
            })
        });
    }

    else if(str == 'updateSubject' || str =='--us'){
        interface.question('id: ',(_id) =>{
            interface.question("subject name: ",(name) =>{
                interface.question("subject code: ",(code) => {
                    interface.question("semester: ",(semester) => {
                        interface.question("teacher: ",(teacher) =>{
                            findUser(teacher,(result) =>{
                                if(result.length > 1){
                                    console.log(result);
                                    interface.question('multiple users found, please select one (1 to n): ',(c) =>{
                                        choice = c-1;
                                        sheetid = getsheetid(_id,()=>{
                                            callback();
                                        });
                                        updatedata(sheetid,{
                                            semester:semester,
                                            subjectName:name,
                                            subjectCode:code,
                                            teacher:result[choice].name
                                        });
                                        console.log("subject Updated");
                                        callback();
                                    })
                                }
                                else{
                                    choice = 0;
                                    sheetid = getsheetid(_id,()=>{
                                        callback();
                                    });
                                    sheetData(sheetid,{
                                        semester:semester,
                                        subjectName:name,
                                        subjectCode:code,
                                        teacher:result[choice].name
                                    });
                                    console.log("subject Updated");
                                    callback();
                                }
                                
                            });
                        })
                    })
                })
            })
        });    
    }
    else if(str =="removeSubject"){
        interface.question("enter subject name: ",(subject) => {
            removeSubject(subject,function(){
                callback();
            })
        });
    }
    else if(str =='listSubjects'){
        listSubjects(function(){
            callback();
        });
    }

    else if(str == "findStudents"){
        interface.question("Please enter the semester : ",(semester) =>{
            findStudents(semester,function(result){
                console.info(result);
                callback();
            })
        })
    }
    else if(str == "addStudents"){
        interface.question("which semester : ",(semester)=> {
            interface.question("filename : ",(filename) =>{
                addStudents(semester,filename,function(){
                    callback();
                });
            })
        });   
    }

    else if(str == "deleteStudents"){
        interface.question("which semester: ",(semester)=>{
            deleteStudents(semester,function(){
                callback();
            });
        });
    }

    else if(str == 'help'){
        //console.log("sdhbvfhdsvfh");
        fs.readFile('./help.txt','utf-8',function(err,data){
            if (err){
                console.log(err);
            }
            console.log(data);
            callback();
        })
    }
    else if(str == "version"){
        console.log("1.0.0");
    }
    else if(str == "exit"){
        process.exit(0);
    }
    else{
        console.log('enter valid command \n Type help to display all commands');
        callback();
    }
    }

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
    findStudents,
    addStudents
} = require('./index.js');

//const createsheet = require('./oauth/index.js');

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
    if(str == 'addUser' || str == '--au'){
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
        interface.question('id : ',(_id) => {
            interface.question('new name: ',(username) => {
                interface.question('password: ',(password) =>{
                    interface.question('email: ',(email) =>{
                        interface.question('phnno: ',(phnno) => {
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
        interface.question('id',(_id) =>{
            removeUser(_id,function(){
                callback();
            });
        });
    } 
    else if(str =='listUser' || str == '--lu'){
        listUser(function(){
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
                        findUser(name,(result) =>{
                            if(result.length > 1){
                                console.log(result);
                                interface.question('multiple users found, please select one (1 to n): ',(choice) =>{
                                    choice = choice;
                                })
                            }
                            else{
                                choice = 0;
                            }
                            findStudents(semester,(result) =>{
                                createsheet({
                                    semester:semester,
                                    subjectCode:code,
                                    teacher: result[choice].name,
                                    subjectName:name,
                                    students:result
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
                            });

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
                            findUser(name,(result) =>{
                                if(result.length > 1){
                                    console.log(result);
                                    interface.question('multiple users found, please select one (1 to n): ',(choice) =>{
                                        choice = choice;
                                    })
                                }
                                else{
                                    choice = 0;
                                }
                                updateSheet()
                            });
                        })
                    })
                })
            })
        });    
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

    else if(str == 'help' || str == 'attendance -h' || str == "attendance --help"){
        //console.log("sdhbvfhdsvfh");
        fs.readFile('G:/attendance/help.txt','utf-8',function(err,data){
            if (err){
                console.log(err);
            }
            console.log(data);
            callback();
        })
    }
    else if(str == "attendance -V" || str =="attendance --version"){
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

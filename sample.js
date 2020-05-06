#!/usr/bin/env node
var readline = require('readline');

const {
    addUser,
    findUser,
    updateUser,
    removeUser,
    listUser
} = require('./index.js');

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
            findUser(name,function(){
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
    else if(str == 'help' || str == '--h'){
        
    }
    else if(str == "exit"){
        process.exit(0);
    }
    else{
        console.log('enter valid command');
        callback();
    }
    }

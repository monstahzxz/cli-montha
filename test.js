#!/usr/bin/env node
var readline = require('readline');

var _interface = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : '>> '
});

_interface.prompt();

_interface.on('line',function(str){
    processFlags(str)
    processString(str)

    _interface.prompt();
});


processFlags = function(str) {
    flags = str.split('--');
    console.log(flags);

    if(flags.indexOf('help') > -1) {
        console.log('help!!');
    }
}

processString = function(str) {
    if (str == 'addUser' || str == 'au') {
        
    }
    else if (str == 'deleteUser') {
        console.log('deleted')
    }
}
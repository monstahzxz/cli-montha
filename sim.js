// var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// var pwdLen = 10;
// var randPassword = Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');


// console.log(randPassword);



// var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// var pwdLen = 10;
// var randPassword = Array(pwdLen).fill(pwdChars).map(function(x) {
//         return x[Math.floor(Math.random() * x.length)] 
//     }).join('');
console.log(password_generator());

function password_generator(){
    var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var pwdLen = 10;
    var randPassword = Array(pwdLen).fill(pwdChars).map(function(x) {
            return x[Math.floor(Math.random() * x.length)] 
    }).join('');
    return randPassword;
};


//delete[obj:key];
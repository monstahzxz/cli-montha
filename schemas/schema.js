const mongoose = require('mongoose');

//teacher schema
// const subjectSchema = mongoose.Schema({
//     subjectId: String,
//     teacher: mongoose.Schema.Types.ObjectId,
//     subjectName: String,
//     semester: String,
//     department: String
// });

const userSchema = mongoose.Schema({
    //userId : {type: String},
    name : {type: String},
    password : {type: String},
    email: {type: String},
    phnNo : {type: String}
});

//export
//module.exports = mongoose.Schema('subjects',subjectSchema);
module.exports = mongoose.model('user',userSchema);

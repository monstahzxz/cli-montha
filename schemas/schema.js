const mongoose = require('mongoose');

var schemas ={};
const subjectSchema = mongoose.Schema({
    subjectCode: String,
    subjectName: String,
    semester: String,
    teacher: mongoose.Schema.Types.ObjectId,
    googleSheetId: String
});

const studentSchema = mongoose.Schema({
    semester: String,
    rollNo: String,
    name: String
});

const userSchema = mongoose.Schema({
    //userId : {type: String},
    name : {type: String},
    password : {type: String},
    email: {type: String},
    phnNo : {type: String},
    //salt: {type: String}
});
schemas.subjectSchema = mongoose.model('subject',subjectSchema);
schemas.userSchema = mongoose.model('user',userSchema);
schemas.studentSchema = mongoose.model('student',studentSchema);
//export
module.exports = schemas;
//mongoose.model('subjects',subjectSchema);
// module.exports = mongoose.model('user',userSchema);

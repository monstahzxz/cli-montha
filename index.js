const mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
//map global promise- to avoid nwarning
mongoose.Promise = global.Promise;
//connection to db

const db = mongoose.connect('mongodb://localhost:27017/Datastorage',
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//require teacher
const {subjectSchema,userSchema,studentSchema} = require ('./schemas/schema.js');

//functions
function closeconnection(){
    mongoose.connection.close();
}

//add user
const addUser = (user,callback) => {
    userSchema.create(user).then(user => {
        console.info('new User Added');
        //closeconnection();
        callback();
    });
}

//find user
const findUser = (name,callback) => {
    const search = new RegExp(name,'i');   //make case insensitive
    userSchema.find({name : search})
    .then(schema => {
        var result =[];
        for(i=0;i<schema.length;i++){
            result.push({
                name:schema.name,
                email:schema.email,
                phnNo: schema.phnNo
            })
        }
       // console.info(schema);
       // console.info(`${schema.length} users matches`);
        //closeconnection();
        callback(result);
    });
}

//update user
const updateUser = (_id,user,callback) => {
    userSchema.updateOne({_id},user)
    .then(schema => {
        console.info('User updated');
       // closeconnection();
        callback();
    });
}

//remove user
const removeUser = (_id,callback) => {
    userSchema.deleteOne({_id})
    .then(schema => {
        console.info('User removed');
       // closeconnection();
        callback();
    });
}

//List all users
const listUser = (callback) => {
    userSchema.find()
    .then(schema => {
        for(i=0;i<schema.length;i++)
        {
            console.log('\n userId: ' + schema[i]['_id']);
            console.log('username: ' + schema[i]['name']);
            console.log('email: ' + schema[i]['email']);
            console.log('\n');
        }
        //console.info(schema);
        console.info(`${schema.length} users matched`);
       // closeconnection();
        callback();
    });
}

const addSubject = (sub,callback) => {
    subjectSchema.create(sub).then(sub => {
        console.info('new subject Added');
        //closeconnection();
        callback();
    });
}

const findSubject = (name,callback) => {
    const search = new RegExp(name,'i');   //make case insensitive
    subjectSchema.find({name : search})
    .then(schema => {
        var result =[];
        for(i=0;i<schema.length;i++){
            result.push({
                code:schema.subjectCode,
                name:schema.subjectName,
                semester:schema.String,
                semester:schema.teacher,
                sheetid:googleSheetId
            })
        }
        callback(result);
    });
}

const findStudents = (semester,callback) => {
    studentSchema.find({semester:semester})
    .then(schema =>{
        var result =[];
        for(i=0;i<schema.length;i++){
            result.push({
                rollNo:schema.rollNo,
                name:schema.name
            })
        }
        callback();
    });
}

module.exports ={
    addUser,
    findUser,
    updateUser,
    removeUser,
    listUser,
    addSubject,
    findSubject,
    findStudents
}
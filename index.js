const mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
//map global promise- to avoid nwarning
mongoose.Promise = global.Promise;
//connection to db

const fs = require('fs');
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
            //console.log(result);
            result.push({
                _id:schema[i]._id,
                name:schema[i].name,
                email:schema[i].email,
                phnNo: schema[i].phnNo
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
        var res =[];
        for(i=0;i<schema.length;i++)
        {
            res.push({
                _id:schema[i]._id,
                name:schema[i].name,
                email:schema[i].email,
                phnNo: schema[i].phnNo
            })
            // console.log('\n userId: ' + schema[i]['_id']);
            // console.log('username: ' + schema[i]['name']);
            // console.log('email: ' + schema[i]['email']);
            // console.log('\n');
        }
        //console.info(schema);
        console.info(`${schema.length} users matched`);
       // closeconnection();
        callback(res);
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
    subjectSchema.find({subjectName : search})
    .then(schema => {
        var result =[];
        for(i=0;i<schema.length;i++){
            result.push({
                code:schema[i].subjectCode,
                name:schema[i].subjectName,
                semester:schema[i].semester,
                teacher:schema[i].teacher,
                sheetid:schema[i].googleSheetId
            })
        }
        callback(result);
    });
}

const findSpreadSheetId = (subjectName, callback) => {
    subjectSchema.find({subjectName: subjectName})
    .then(schema => {
        callback(schema[0].googleSheetId);
    });
};

const removeSubject = (subject,callback) =>{
    const search = new RegExp(subject,'i');
    subjectSchema.deleteOne({subjectName:search})
    .then(schema => {
        console.log("Subject removed");
        callback();
    })
}

const listSubjects = (callback) =>{
    subjectSchema.find()
    .then(schema => {
        console.log(schema);
        callback();
    })
}

const findStudents = (semester,callback) => {
    studentSchema.find({semester:semester})
    .then(schema =>{
        var result =[];
        for(i=0;i<schema.length;i++){
            result.push({
                rollNo:schema[i].rollNo,
                name:schema[i].name
            })
        }

        result.sort((a, b) => {
            if (a['rollNo'] < b['rollNo']) {
                return -1
            } else {
                return 1;
            }
            return 0;
        });
        callback(result);
    });
}

const deleteStudents = (semester,callback) =>{
    studentSchema.deleteMany({semester:semester})
    .then(schema => {
        console.log(semester + " students deleted");
        callback();
    })
}

const getsheetid = (_id,callback) =>{
    var res;
    subjectSchema.find({_id})
    .then(schema => {
        res =schema.googleSheetId;
        callback(res);
    })
}

const addStudents = (semester,filename,callback) => {
    var arr;
    var file = "./students/" + filename + ".csv";
    fs.readFile(file,'utf-8', function (err, data) {
    if (err) {
        console.log(err);
    }
    arr = data.split('\n');
    //console.log(arr);
    for(i=0;i<arr.length;i++){
        var a = arr[i].split(',');
        if(a[0]==""){
            continue;
        }
        else{
            a[1]=a[1].slice(0,a[1].length-1);
            var obj ={
                semester:semester,
                rollNo:a[0],
                name:a[1]
            }
        }
        //console.log(obj);
        studentSchema.create(obj)
    }
    console.log("students added ");
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
    removeSubject,
    listSubjects,
    findStudents,
    deleteStudents,
    addStudents,
    getsheetid,
    findSpreadSheetId
}
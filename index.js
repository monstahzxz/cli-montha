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
const schemas = require ('./schemas/schema.js');

//functions
function closeconnection(){
    mongoose.connection.close();
}

//add user
const addUser = (user,callback) => {
    schemas.create(user).then(user => {
        console.info('new User Added');
        //closeconnection();
        callback();
    });
}

//find user
const findUser = (name,callback) => {
    const search = new RegExp(name,'i');   //make case insensitive
    schemas.find({name : search})
    .then(schema => {
        console.info(schema);
        console.info(`${schema.length} users matches`);
        //closeconnection();
        callback();
    });
}

//update user
const updateUser = (_id,user,callback) => {
    schemas.updateOne({_id},user)
    .then(schema => {
        console.info('User updated');
       // closeconnection();
        callback();
    });
}

//remove user
const removeUser = (_id,callback) => {
    schemas.deleteOne({_id})
    .then(schema => {
        console.info('User removed');
       // closeconnection();
        callback();
    });
}

//List all users
const listUser = (callback) => {
    schemas.find()
    .then(schema => {
        console.info(schema);
        console.info(`${schema.length} users matched`);
       // closeconnection();
        callback();
    });
}


module.exports ={
    addUser,
    findUser,
    updateUser,
    removeUser,
    listUser
}
#!/usr/bin/env node
const program = require('commander');
const {prompt} = require('inquirer');

const {
    addUser,
    findUser,
    updateUser,
    removeUser,
    listUser
} = require('./index.js');


//questions

const questions = [
    {
        type: 'input',
        name: 'ID',
        message: 'user ID'
    },
    {
        type: 'input',
        name: 'name',
        message: 'name'
    },
    {
        type: 'password',
        name: 'password',
        message: 'enter password'
    },
    {
        type: 'input',
        name: 'phone',
        message: 'phone number'
    },
    {
        type: 'input',
        name: 'email',
        message: 'email'
    }
];

program
    .version('1.0.0')
    .description('Attendence Management System');

program
    .command('addUser')
    .alias('au')
    .description('add a user')
    .action(() => {
        prompt(questions).then(answers => addUser(answers));
    });

program
    .command('findUser <name>')
    .alias('fu')
    .description('find a user')
    .action(name => findUser(name));

program
    .command('updateUser <_id>')
    .alias('uu')
    .description('update a user')
    .action(_id => {
        prompt(questions).then(answers => updateUser(_id,answers));
    });

program
    .command('removeUser <_id>')
    .alias('ru')
    .description('remove a user')
    .action(_id => removeUser(_id));

program
    .command('listUser')
    .alias('lu')
    .description('list all users')
    .action(() => listUser());


program.parse(process.argv);
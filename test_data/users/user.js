const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const uuid = require('uuid');

module.exports = [
    {
        _id: new ObjectId('5c8e06552bc3613245d690ed'),
        verified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"Super Administrator",
        //password is admin
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        email:"admin@admin.com",
        verification: uuid.v4(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    },
    {
        _id: new ObjectId('5c8d5a4a545e5728e469cf6b'),
        verified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"user",
        //password is admin
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        email:"user@example.com",
        verification: uuid.v4(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    },
    {
        _id: new ObjectId('5c8e067751ca6c325c34b2db'),
        verified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"Leader",
        //password is admin
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        email:"leader@example.com",
        verification: uuid.v4(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    }
];

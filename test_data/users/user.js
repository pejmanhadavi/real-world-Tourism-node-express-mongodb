const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const uuid = require('uuid');

module.exports = [
    {
        _id: new ObjectId('5c8e06552bc3613245d690ed'),
        phoneVerified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"Super Administrator",
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        phone: '09091234567',
        finalizedRegistraion: true,
        email:"admin@admin.com",
        phoneVerification: '123456',
        phoneVerificationExpires: faker.date.past(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    },
    {
        _id: new ObjectId('5c8d5a4a545e5728e469cf6b'),
        phoneVerified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"user",
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        phone: '09091234567',
        finalizedRegistraion: true,
        email:"user@admin.com",
        phoneVerification: '123456',
        phoneVerificationExpires: faker.date.past(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    },
    {
        _id: new ObjectId('5c8e067751ca6c325c34b2db'),
        phoneVerified:true,
        loginAttempts:0,
        profileImages:[],
        languages:[],
        iWillShowYou:[],
        travelFacilities:[],
        name:"leader",
        password:"$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG",
        phone: '09091234567',
        finalizedRegistraion: true,
        email:"leader@admin.com",
        phoneVerification: '123456',
        phoneVerificationExpires: faker.date.past(),
        blockExpires: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        isAdmin: false
    }
];

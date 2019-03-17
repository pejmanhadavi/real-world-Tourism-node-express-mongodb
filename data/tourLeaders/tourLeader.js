const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports =[
    {
        _id:new ObjectId('5c6e5b4a8266be5fd8dbad7c'),
        "experiences":1000,
        "verified":true,
        "user":new ObjectId('5c8e067751ca6c325c34b2db'),
        "createdAt": faker.date.past(),
        "updatedAt": faker.date.recent()
    }
    ];
const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports =[
    {
        _id:new ObjectId('5c6e5b4a8266be5fd8dbad7c'),
        "experiences":[new ObjectId('5c8e342f7bcd6d2b56114945'), new ObjectId('5c8e343680ee502b6704abfe')],
        "verified":true,
        "user":new ObjectId('5c8e067751ca6c325c34b2db'),
        "createdAt": faker.date.past(),
        "updatedAt": faker.date.recent()
    }
    ];
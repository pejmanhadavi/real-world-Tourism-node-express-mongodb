const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = [
    {
        _id: new ObjectId('5c8e33466c3165282fbcc2ab'),
        title: 'EX1',
        cost: 80000,
        description: 'this is some description',
    },
    {
        _id: new ObjectId('5c8e342f7bcd6d2b56114945'),
        title: 'EX2',
        cost: 20000,
        description: 'this is some description',
    },
    {
        _id: new ObjectId('5c8e343680ee502b6704abfe'),
        title: 'EX3',
        cost: 50000,
        description: 'this is some description',
    },
];

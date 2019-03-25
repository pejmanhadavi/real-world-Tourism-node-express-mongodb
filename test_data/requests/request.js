const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = [
    {
        _id: new ObjectId('5c925bf416c0ba38ba3e9a5a'),
        tourLeaderFirstValidate: true,
        userFinalValidate: true,
        tourLeaderFinalValidate: true,
        paid: true,
        rated:false,
        user: new ObjectId('5c8d5a4a545e5728e469cf6b'),
        tourLeader: new ObjectId('5c6e5b4a8266be5fd8dbad7c'),
        tourLeaderUserId: new ObjectId('5c8e067751ca6c325c34b2db'),
        experiences: ['5c8e342f7bcd6d2b56114945', '5c8e343680ee502b6704abfe'],
        factorNumber:1551689552916,
        createdAt:"2019-03-04T08:52:32.919Z",
        updatedAt:"2019-03-04T12:31:32.468Z"
    }
];
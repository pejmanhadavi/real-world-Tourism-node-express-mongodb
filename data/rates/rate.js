const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const rates = [];
let rate;
const leaders = require('../tourleaders/tourleader').ids;
const users = require('../users/user').ids;
for( let i = 0 ; i < 20 ; i ++ ) {
    rate = {
        _id: new ObjectId(),
        tourLeader: leaders[ 20 - i ],
        user: users[i],
        star: Math.floor(Math.random() * 20 + 1),
        comment: `this is some comment ${i+1}`
    };

    rates.push(rate);

}

module.exports = rates;
module.exports.ids = rates.map(a => a._id);

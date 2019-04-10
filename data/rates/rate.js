const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const rates = [];
let rate;
const leaders = require('../tourleaders/tourleader').ids;
const users = require('../users/user').ids;
for( let i = 0 ; i < 20 ; i ++ ) {
    for(let j = 0 ; j < Math.floor(Math.random() * 10 + 1 ) ; j ++ ){
        rate = {
            _id: new ObjectId(),
            tourLeader: leaders[ 19 - i ],
            user: users[Math.floor(Math.random() * 20 )],
            star: Math.floor(Math.random() * 5 + 1),
            comment: faker.lorem.text(),
        };
        rates.push(rate);
    }


}

module.exports = rates;
module.exports.ids = rates.map(a => a._id);

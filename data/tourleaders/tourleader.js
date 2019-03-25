const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const leaders = [];
let leader;
const users = require('../users/user').ids;
const experiences = require('../experiences/experience').ids

for( let i = 0 ; i < 20 ; i ++ ) {
    leader = {
        _id: new ObjectId(),
        user: users[i],
        verified: true,
        experiences: [
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
            ]
    };

    leaders.push(leader);

}

module.exports = leaders;
module.exports.ids = leaders.map(a => a._id);

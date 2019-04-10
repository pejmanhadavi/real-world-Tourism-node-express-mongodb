const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const requests = [];
let request;
const users = require('../users/user').ids;
const leaders = require('../tourleaders/tourleader').ids;
const experiences = require('../experiences/experience').ids;

for( let i = 0 ; i < 20 ; i ++ ) {
    request = {
        _id: new ObjectId(),
        user: new ObjectId(users[i]),
        tourLeader: new ObjectId(leaders[20-i]),
        experiences: [
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
            new ObjectId(experiences[Math.floor(Math.random() * 20)]),
        ],
        tourLeaderUserId: users[i],
        paid: true,
        factorNumber: faker.random.number(),
    };

    requests.push(request);

}

module.exports = requests;
module.exports.ids = requests.map(a => a._id);

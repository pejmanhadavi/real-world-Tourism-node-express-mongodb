const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const facilities = [];
let facility;

for( let i = 0 ; i < 20 ; i ++ ) {
    facility = {
        _id: new ObjectId(),
        name: faker.name.title(),
    };

    facilities.push(facility);

}

module.exports = facilities;
module.exports.id = facilities.map(a => a._id);

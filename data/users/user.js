const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const uuid = require('uuid');
const users = [];
let user;
const cities = require('../cities/city').ids;
const provinces = require('../provinces/province').ids;
for( let i = 0 ; i < 20 ; i ++ ) {
    user = {
        _id: new ObjectId(),
        name: faker.name.firstName,
        password: '$2b$10$7JFz3Ah9Nnk5jwbj.gkAmOwusKA.T6XAYMrtSihxlJ/9bU2ZGmERG',
        email: faker.internet.email(),
        verification: uuid.v4(),
        verified: true,
        phone: faker.phone.phoneNumber('###########'),
        city: cities[i],
        province: provinces[i],
        profileImages: [
            faker.image.avatar(),
            faker.image.avatar(),
            faker.image.avatar(),
        ]
    };

    users.push(user);

}

module.exports = users;
module.exports.ids = users.map(a => a._id);

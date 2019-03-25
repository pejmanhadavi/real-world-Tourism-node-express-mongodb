const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const cities = [];
let city;
const provinces = require('../provinces/province').ids;

for( let i = 0 ; i < 20 ; i ++ ) {
    city = {
        _id: new ObjectId(),
        province: new ObjectId(provinces[i]),
        name: faker.address.state()
    };

    cities.push(city);

}

module.exports = cities;
module.exports.ids = cities.map(a => a._id);

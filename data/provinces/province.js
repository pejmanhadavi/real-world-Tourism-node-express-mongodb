const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const provinces = [];
let province;
for( let i = 0 ; i < 20 ; i ++ ) {

  province = {
    _id: new ObjectId(),
    name: faker.address.state()
  };

  provinces.push(province);

}

module.exports = provinces;
module.exports.ids = provinces.map(a => a._id);

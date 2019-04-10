const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const pays = [];
let pay;
const requests = require('../requests/request');

for( let i = 0 ; i < 20 ; i ++ ) {
    pay = {
        _id: new ObjectId(),
        factorNumber: requests[i].factorNumber,
        transactionId: faker.random.number(),
        amount: faker.random.number(),
        cardNumber: faker.random.words()
    };

    pays.push(pay);

}

module.exports = pays;
module.exports.ids = pays.map(a => a._id);

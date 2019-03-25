const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;
const experiences = [];
let experience;

for( let i = 0 ; i < 20 ; i ++ ) {
    experience = {
        _id: new ObjectId(),
        title: faker.name.title(),
        cost : faker.random.number(),
        description: faker.name.jobDescriptor(),
        profile: faker.image.transport(),
        images: [
            faker.image.nature(),
            faker.image.nature(),
            faker.image.nature()
        ]
    };

    experiences.push(experience);

}

module.exports = experiences;
module.exports.id = experiences.map(a => a._id);

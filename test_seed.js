const {Seeder} = require('mongo-seeding');
const path = require('path');

const config = {
    database: "mongodb://localhost:27017/touraso_test",
    inputPath: path.resolve(__dirname, './test_data'),
    dropDatabase: false
};

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('./test_data'));


const main = async () => {
    try {
        await seeder.import(collections);
        console.log('Seed complete!');
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
};

main();

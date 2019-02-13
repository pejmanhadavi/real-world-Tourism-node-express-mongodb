const mongoose = require('mongoose');
const config = require('config');
const DB_URL = process.env.MONGO_URI;


module.exports = () => {
	const connect = () => {
		mongoose.Promise = global.Promise;

		mongoose.connect(
			config.get('DATABASE'),
			{
				keepAlive: true,
				reconnectTries: Number.MAX_VALUE,
				useNewUrlParser: true
			},
			err => {
				let dbStatus = '';
				if (err) {
					dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`;
				}
				dbStatus = '*    DB Connection: OK\n****************************\n';
				// Prints initialization
				console.log('****************************');
				console.log('*    Starting Server');
				console.log(`*    Port: ${process.env.PORT || 3000}`);
				console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
				console.log('*    Database: MongoDB');
				console.log(dbStatus);
			}
		);
		mongoose.set('useCreateIndex', true);
		mongoose.set('useFindAndModify', false);
	};
	connect();

	mongoose.connection.on('error', console.log);
	mongoose.connection.on('disconnected', connect);

};

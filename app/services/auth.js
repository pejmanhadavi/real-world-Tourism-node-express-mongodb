const jwt = require('jsonwebtoken');

//GENERATE TOKEN
exports.generateToken = id => {
	const obj = {
		_id: id
	};

	return jwt.sign(obj, process.env.JWT_SECRET
		, {expiresIn: process.env.JWT_EXPIRATION}
	);
};
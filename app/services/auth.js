const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const algorithm = 'aes-256-ecb'
const password = process.env.JWT_SECRET

//GENERATE TOKEN
exports.generateToken = id => {
	const obj = {
		_id: id
	};
	return encrypt(
		jwt.sign(obj, process.env.JWT_SECRET
			, {expiresIn: process.env.JWT_EXPIRATION}
		)
	);
};


const encrypt = text => {
	const cipher = crypto.createCipher(algorithm, password);
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
};

/**
 * FOR DECRYPTING JWT WHILE LOGIN
 * IT USED IN CONFIG PASSPORT
 * @param text
 * @returns {*}
 */
const decrypt = text => {
	const decipher = crypto.createDecipher(algorithm, password);
	try{
		let dec = decipher.update(text, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}catch (err) {
		return err;
	}
};

exports.decrypt = decrypt;
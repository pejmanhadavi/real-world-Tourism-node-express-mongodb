const mongoose = require('mongoose');
const dateFns = require('date-fns');

const phoneSchema = require('../schemas/phone_status').phoneSchema;
const {buildErrObject}= require('../services/error_handler');

const HOURS_TO_BLOCK = 5;
const REGISTER_ATTEMPTS = 3;

/**********************
    * STATICS *
 **********************/

//CHECK PHONE
phoneSchema.statics.phoneExists = async phone => {
	return new Promise((resolve, reject) => {
		PhoneStatus.findOne({
			phone
		})
			.then(result => {
				if(result === null)
					resolve(false);
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//REGISTER PHONE
phoneSchema.statics.registerPhone = async phone => {
	return new Promise((resolve, reject) => {
		const phoneStatus = new PhoneStatus({
			phone
		});

		savePhoneStatus(phoneStatus)
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));

	});
};



//CHECK REGISTER ATTEMPTS AND BLOCK EXPIRES
phoneSchema.statics.checkRegisterAttemptsAndBlockExpires = async phoneStatus => {
	return new Promise(async (resolve, reject) => {
		if (blockIsExpired(phoneStatus)) {
			phoneStatus.attemps = 0;
			savePhoneStatus(phoneStatus)
				.then(result => resolve(result))
				.catch(err => reject(buildErrObject(422, err.message)));
		} else {
			// User is not blocked, check password (normal behaviour)
			resolve(true);
		}
	});
};

//INCREMENT ATTMEPS
phoneSchema.statics.incrementAttemps = async (phoneStatus) => {
	return new Promise(async (resolve, reject) => {
		phoneStatus.attemps += 1;
		savePhoneStatus(phoneStatus)
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//PHONE IS BLOCKED
phoneSchema.statics.phoneIsBlocked = async (phoneStatus) => {
	return new Promise((resolve, reject) => {
		if (phoneStatus.blockExpires > new Date()) {
			reject(buildErrObject(409, 'BLOCKED_PHONE'));
		}
		resolve(true);
	});
};

//BLOCK PHONE
phoneSchema.statics.blockPhone = async (phoneStatus) => {
	return new Promise(async (resolve, reject) => {
		if (phoneStatus.attemps > REGISTER_ATTEMPTS) {
			phoneStatus.blockExpires = dateFns.addHours(new Date, HOURS_TO_BLOCK);
			savePhoneStatus(phoneStatus)
				.then(result => resolve(result))
				.catch(err => reject(buildErrObject(422, err.message)));
		}
	});
};


phoneSchema.statics.deletePhoneStatus = async (phone) => {
	return new Promise((resolve, reject) => {
		PhoneStatus.remove({
			phone
		})
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/*******************
    * METHODS *
 ******************/




/*******************
    * HELPERS *
 ******************/
//BLOCK IS EXPIRED
const blockIsExpired = (phoneStatus) =>
	phoneStatus.attempts > REGISTER_ATTEMPTS && phoneStatus.blockExpires <= new Date();


//SAVE PHONE STATUS
const savePhoneStatus = async (phoneStatus) => {
	return new Promise((resolve, reject) => {
		phoneStatus.save()
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/**********************************
    * CREATE AND EXPORT MODEL *
**********************************/
const PhoneStatus = mongoose.model('PhoneStatus', phoneSchema);
exports.PhoneStatus = PhoneStatus;